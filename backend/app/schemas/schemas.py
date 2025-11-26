# app/schemas/schemas.py

from pydantic import BaseModel
from datetime import datetime

# -------- Categoría --------
class CategoriaBase(BaseModel):
    nombre: str
    descripcion: str

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(CategoriaBase):
    id: int
    class Config:
        from_attributes = True


# -------- Plato --------
class PlatoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    categoria_id: int

class PlatoCreate(PlatoBase):
    pass

class Plato(PlatoBase):
    id: int
    class Config:
        from_attributes = True


# -------- Cliente --------
class ClienteBase(BaseModel):
    nombre: str
    telefono: str
    correo: str

class ClienteCreate(ClienteBase):
    pass

class Cliente(ClienteBase):
    id: int
    class Config:
        from_attributes = True


# -------- Mesero --------
class MeseroBase(BaseModel):
    nombre: str
    codigo_empleado: str

class MeseroCreate(MeseroBase):
    pass

class Mesero(MeseroBase):
    id: int
    class Config:
        from_attributes = True


# -------- Pedido --------
class PedidoBase(BaseModel):
    cliente_id: int
    mesero_id: int
    total: float
    estado: str

class PedidoCreate(PedidoBase):
    pass

class Pedido(PedidoBase):
    id: int
    fecha_creacion: datetime
    class Config:
        from_attributes = True

# -------- Detalles_Pedidos --------
class DetallePedidoBase(BaseModel):
    pedido_id: int
    plato_id: int
    cantidad: int
    subtotal: float

class DetallePedidoCreate(DetallePedidoBase):
    pass

class DetallePedido(DetallePedidoBase):
    id: int
    class Config:
        from_attributes = True

