# app/models/models.py

from datetime import datetime, timezone, timedelta
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database.connection import Base  # ← Import corregido

class Categoria(Base):
    __tablename__ = "categorias"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    descripcion = Column(String)
    platos = relationship("Plato", back_populates="categoria")


class Plato(Base):
    __tablename__ = "platos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    descripcion = Column(String)
    precio = Column(Float)
    categoria_id = Column(Integer, ForeignKey("categorias.id"))
    categoria = relationship("Categoria", back_populates="platos")
    detalles = relationship("DetallePedido", back_populates="plato")


class Cliente(Base):
    __tablename__ = "clientes"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    telefono = Column(String)
    correo = Column(String)
    pedidos = relationship("Pedido", back_populates="cliente")


class Mesero(Base):
    __tablename__ = "meseros"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    codigo_empleado = Column(String)
    pedidos = relationship("Pedido", back_populates="mesero")


class Pedido(Base):
    __tablename__ = "pedidos"
    id = Column(Integer, primary_key=True, index=True)
    cliente_id = Column(Integer, ForeignKey("clientes.id"))
    mesero_id = Column(Integer, ForeignKey("meseros.id"))
    total = Column(Float)
    estado = Column(String)
    fecha_creacion = Column(DateTime, default=lambda: datetime.now(timezone(timedelta(hours=-5))))
    cliente = relationship("Cliente", back_populates="pedidos")
    mesero = relationship("Mesero", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido")

# app/models/models.py  (solo la clase DetallePedido)
from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class DetallePedido(Base):
    __tablename__ = "detalles_pedidos"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedidos.id"))
    plato_id = Column(Integer, ForeignKey("platos.id"))
    cantidad = Column(Integer)
    subtotal = Column(Float)

    pedido = relationship("Pedido", back_populates="detalles")
    plato = relationship("Plato", back_populates="detalles")
