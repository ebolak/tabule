from database import Base
from flask_security import UserMixin, RoleMixin
# from sqlalchemy import create_engine
from sqlalchemy.orm import relationship, backref
from sqlalchemy import Boolean, DateTime, Column, Integer, String, ForeignKey, Table

association_table = Table('association', Base.metadata,
    Column('user_id', Integer, ForeignKey('user.id')),
    Column('role_id', Integer, ForeignKey('role.id'))
)

class User(Base, UserMixin):
    __tablename__ = 'user'
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    username = Column(String(255))
    password = Column(String(255))
    active = Column(Boolean)
    roles = relationship("Role", secondary=association_table)

    def __repr__(self):
        return self.email

class Role(Base, RoleMixin):
    __tablename__ = 'role'
    id = Column(Integer, primary_key=True)
    name = Column(String(80), unique=True)
    description = Column(String(255))

    def __repr__(self):
        return self.name