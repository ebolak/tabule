# Global context config
# line name
LINE_NAME = "L14"

# Create dummy secrey key so we can use sessions
SECRET_KEY = '123456790'

# Create in-memory database
#DATABASE_FILE = 'sample_db.sqlite'
#SQLALCHEMY_DATABASE_URI = 'sqlite:///' + DATABASE_FILE
#SQLALCHEMY_ECHO = True

# Flask-Security config
#SECURITY_URL_PREFIX = "/admin"
SECURITY_PASSWORD_HASH = "pbkdf2_sha512"
SECURITY_PASSWORD_SALT = "ATGUOHAELKiubahiughaerGOJAEGj"

# Flask-Security URLs, overridden because they don't put a / at the end
#SECURITY_LOGIN_URL = "/login"
#SECURITY_LOGOUT_URL = "/logout/"
#SECURITY_CHANGE_URL = "/change/"
#SECURITY_RESET_URL = "/reset/"
#SECURITY_REGISTER_URL = "/register/"

#SECURITY_POST_LOGIN_VIEW = "/admin/"
#SECURITY_POST_LOGOUT_VIEW = "/admin/"
#SECURITY_POST_REGISTER_VIEW = "/admin/"
#SECURITY_POST_CHANGE_VIEW = "/change/"
#SECURITY_POST_RESET_VIEW = "/reset/"
#SECURITY_POST_RESET_VIEW = "/login"


# Flask-Security features
SECURITY_CHANGEABLE = True
SECURITY_REGISTERABLE = False
SECURITY_SEND_REGISTER_EMAIL = False
SECURITY_SEND_PASSWORD_CHANGE_EMAIL = False
SECURITY_REGISTERABLE = False
SECURITY_RECOVERABLE = True
SECURITY_SEND_REGISTER_EMAIL = False
SECURITY_SEND_PASSWORD_CHANGE_EMAIL = False
SECURITY_SEND_PASSWORD_RESET_EMAIL = True
SECURITY_SEND_PASSWORD_RESET_NOTICE_EMAIL = False
SECURITY_DEFAULT_REMEMBER_ME = True

# override flask security default messages
SECURITY_EMAIL_SENDER = "no-reply-" + LINE_NAME + "@fujikiko-fkc.cz"
SECURITY_EMAIL_SUBJECT_PASSWORD_RESET = LINE_NAME + " Obnovení hesla"
SECURITY_EMAIL_SUBJECT_PASSWORD_NOTICE = LINE_NAME + " Vaše heslo bylo obnoveno"
SECURITY_EMAIL_SUBJECT_PASSWORD_CHANGE_NOTICE = LINE_NAME + " Vaše heslo bylo změněno"

SECURITY_MSG_INVALID_PASSWORD = (('Nesprávné heslo'), 'error')
SECURITY_MSG_PASSWORD_RESET_REQUEST = (('Odkaz pro obnovení hesla byl zaslán na %(email)s'), 'info')
SECURITY_MSG_PASSWORD_RESET = (('Vaše heslo bylo změněno a přihlášení proběhlo automaticky'), 'success')
SECURITY_MSG_USER_DOES_NOT_EXIST = (("Nesprávné přihlašovací jméno"), "error")
SECURITY_MSG_EMAIL_NOT_PROVIDED = (("Zadejte email"), "error")
SECURITY_MSG_INVALID_EMAIL_ADDRESS = (("Neplatná emailová adresa"), "error")
SECURITY_MSG_PASSWORD_NOT_PROVIDED = (("Zadejte heslo"), "error")
SECURITY_MSG_RETYPE_PASSWORD_MISMATCH = (("Hesla se neshodují"), "error")
SECURITY_MSG_PASSWORD_NOT_PROVIDED = (("Zadejte heslo"), "error")
SECURITY_MSG_PASSWORD_INVALID_LENGTH = (('Heslo musí obsahovat alespoň 6 znaků'), 'error')
SECURITY_MSG_PASSWORD_IS_THE_SAME = (('Vaše nové heslo se musí lišit od předchozího hesla'), 'error')
SECURITY_MSG_PASSWORD_CHANGE = (('Vaše heslo bylo změněno'), 'success')
SECURITY_MSG_LOGIN = (('Přihlaste se k přístupu na tuto stránku'), 'info')

# flask mail
MAIL_SERVER = '192.168.121.9'
MAIL_PORT = 25
#MAIL_USE_SSL = False
#MAIL_USERNAME = 'username'
#MAIL_PASSWORD = 'password'

SQLALCHEMY_TRACK_MODIFICATIONS = False

# Flask-Mqtt
MQTT_BROKER_URL = "127.0.0.1"
#MQTT_BROKER_URL = "localhost"
MQTT_BROKER_PORT = 1883
MQTT_USERNAME = ""
MQTT_PASSWORD = ""
MQTT_KEEPALIVE = 5
MQTT_TLS_ENABLED = False
#MQTT_CLIENT_ID = "LXX"

# socketIO
NAME_SPACE = "/" + LINE_NAME
ROOM = "settings"

MQTT_TOPICS = {
	 LINE_NAME + "/actualValues" : {"namespace": NAME_SPACE, "room" : None },
	 LINE_NAME + "/andons" : {"namespace": NAME_SPACE, "room" : None },
	 LINE_NAME + "/settings" : {"namespace": NAME_SPACE, "room" : ROOM },
	 LINE_NAME + "/settingsShift/1" : {"namespace": NAME_SPACE, "room" : ROOM },
	 LINE_NAME + "/settingsShift/2" : {"namespace": NAME_SPACE, "room" : ROOM },
	 LINE_NAME + "/settingsShift/3" : {"namespace": NAME_SPACE, "room" : ROOM },
	 LINE_NAME + "/settingsSirene/green" : {"namespace": NAME_SPACE, "room" : ROOM },
	 LINE_NAME + "/settingsSirene/yellow" : {"namespace": NAME_SPACE, "room" : ROOM },
	 LINE_NAME + "/settingsSirene/red" : {"namespace": NAME_SPACE, "room" : ROOM }
}







