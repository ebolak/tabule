from flask_security.forms import get_form_field_label, email_required, email_validator, valid_user_email, password_required, password_length, EqualTo
from wtforms import BooleanField, Field, HiddenField, PasswordField, \
    StringField, SubmitField, ValidationError, validators
import eventlet
# eventlet.monkey_patch()
import json
from flask import Flask, render_template, url_for, redirect, current_app
from flask_mail import Mail
from flask_jsglue import JSGlue
from flask_mqtt import Mqtt
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_admin.base import MenuLink
from database import db_session, init_db, Base, engine
from models import User, Role
from flask_security import Security, login_required, SQLAlchemySessionUserDatastore, current_user
from flask_security import UserMixin, RoleMixin
from flask_security.forms import LoginForm, ChangePasswordForm, ForgotPasswordForm, ResetPasswordForm, StringField, SubmitField, Required, Length
from flask_socketio import SocketIO, emit, disconnect, join_room, leave_room
import functools
eventlet.monkey_patch()


# Create Flask application
app = Flask(__name__)
app.config.from_pyfile("config.py")

JSGlue(app)


# SocketIO
async_mode = "eventlet"
socketio = SocketIO(app, async_mode=async_mode, manage_session=False)


# Mqtt
mqtt = Mqtt(app)
with app.app_context():
    topics = current_app.config.get("MQTT_TOPICS")
    namespace = current_app.config["NAME_SPACE"]


# overriding default security forms?


class ExtendedLoginForm(LoginForm):
    email = StringField(
        "", validators=[email_required, email_validator, valid_user_email])
    password = PasswordField("", validators=[password_required])
    submit = SubmitField("Přihlásit")


class ExtendedForgotPasswordForm(ForgotPasswordForm):
    email = StringField("",
                        validators=[email_required, email_validator, valid_user_email])
    submit = SubmitField("Odeslat")


class ExtendedResetPasswordForm(ResetPasswordForm):
    password = PasswordField("", validators=[password_required, password_length, EqualTo(
        'password_confirm', message='RETYPE_PASSWORD_MISMATCH')])
    password_confirm = PasswordField("", validators=[password_required, password_length, EqualTo(
        'password', message='RETYPE_PASSWORD_MISMATCH')])
    submit = SubmitField("Obnovit heslo")


class ExtendedPasswordChangeForm(ChangePasswordForm):
    password = PasswordField("", validators=[password_required])
    new_password = PasswordField("", validators=[password_required, password_length, EqualTo(
        'new_password_confirm', message='RETYPE_PASSWORD_MISMATCH')])
    new_password_confirm = PasswordField("", validators=[password_required, password_length, EqualTo(
        'new_password', message='RETYPE_PASSWORD_MISMATCH')])
    submit = SubmitField("Změnit heslo")


# Setup Flask-Security
user_datastore = SQLAlchemySessionUserDatastore(db_session, User, Role)
security = Security(app, user_datastore, login_form=ExtendedLoginForm, change_password_form=ExtendedPasswordChangeForm,
                    forgot_password_form=ExtendedForgotPasswordForm, reset_password_form=ExtendedResetPasswordForm)

# This processor is added to all templates


@security.context_processor
def security_context_processor():
    with app.app_context():
        return dict(line_name=current_app.config.get("LINE_NAME"))

# Create a user to test with


@app.before_first_request
def create_user():
    init_db()
    if not user_datastore.find_role("Admin"):
        user_datastore.create_role(name="Admin", description="Admin")
        db_session.commit()
    if not user_datastore.find_user(email="admin@example.com"):
        user_datastore.create_user(
            email="admin@example.com", password="password", roles=["Admin"])
        db_session.commit()


# Customized Role model for SQL-Admin
# Prevent administration of Roles unless the currently logged-in user has the "Admin" role
class MyAdminIndexView(AdminIndexView):
    def is_accessible(self):
        return current_user.has_role("Admin")

# Customized Role model for SQL-Admin


class UserAdmin(ModelView):
    def is_accessible(self):
        return current_user.has_role("Admin")


admin = Admin(app, name=app.config["LINE_NAME"] + " Admin",
              template_mode="bootstrap3", index_view=MyAdminIndexView(), url="/")
admin.add_view(UserAdmin(User, db_session))
admin.add_view(UserAdmin(Role, db_session))
admin.add_link(MenuLink(name='Tabule', category='Odkazy', endpoint='index'))

# flask_mail
mail = Mail(app)

# views


@app.route("/")
def index():
    return render_template("index.html", line_name=current_app.config["LINE_NAME"], name_space=current_app.config["NAME_SPACE"])


@app.route("/control")
@login_required
def control():
    return render_template("control.html", line_name=current_app.config["LINE_NAME"], name_space=current_app.config["NAME_SPACE"])


@app.route("/settingsMain")
@login_required
def settingsMain():
    return render_template("settingsMain.html", line_name=current_app.config["LINE_NAME"], name_space=current_app.config["NAME_SPACE"])


@app.route("/settingsShift")
@login_required
def settingsShift():
    return render_template("settingsShift.html", line_name=current_app.config["LINE_NAME"], name_space=current_app.config["NAME_SPACE"])


@app.route("/settingsSirene")
@login_required
def settingsSirene():
    return render_template("settingsSirene.html", line_name=current_app.config["LINE_NAME"], name_space=current_app.config["NAME_SPACE"])


# socketIO
with app.app_context():
    namespace = current_app.config.get("NAME_SPACE")
    room = current_app.config.get("ROOM")


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if not current_user.is_authenticated:
            leave_room(room)
        else:
            return f(*args, **kwargs)
    return wrapped


@socketio.on("connect", namespace=namespace)
def test_connect():
    if current_user.is_authenticated and current_user.email:
        print("Client " + current_user.email + " connected")
        join_room(room)
    else:
        print("Client Anonymous connected")


@socketio.on("disconnect", namespace=namespace)
def test_disconnect():
    if current_user.is_authenticated and current_user.email:
        print("Client " + current_user.email + " disconnected")
        join_room(room)
    else:
        print("Client Anonymous disconnected")


@socketio.on("publish", namespace=namespace)
# @authenticated_only
def handle_publish(data):
    if current_user.is_authenticated:
        msg = json.loads(data)
        mqtt.publish(msg["topic"], json.dumps(msg["payload"]), qos=2)

# mqtt


@mqtt.on_connect()
def handle_connect(client, userdata, flags, rc):
    # Mqtt subscirbe topics
    for key, val in topics.items():
        mqtt.subscribe(key)
        # print(key)
    # pass


@mqtt.on_disconnect()
def handle_disconnect():
    #   mqtt.unsubscribe_all()
    socketio.emit('actualValuesError', None, namespace=namespace, room=None)


@mqtt.on_message()
def handle_mqtt_message(client, userdata, message):
    msg = dict(
        topic=message.topic,
        payload=message.payload.decode()
    )
    if msg["topic"] in topics:
        payload = json.loads(msg["payload"])
        if payload["signal"] != None:
            keys = payload["signal"].split(";")
            values = payload["value"]
            msg["payload"] = dict(zip(keys, values))
            socketio.emit(msg["topic"], msg, namespace=topics[msg["topic"]]
                          ["namespace"], room=topics[msg["topic"]]["room"])


@mqtt.on_log()
def handle_logging(client, userdata, level, buf):
    print(level, buf)
    pass


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    socketio.run(app, host="0.0.0.0", port=5000, use_reloader=True, debug=True)
