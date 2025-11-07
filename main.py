# main.py
# Archivo principal que ejecuta la API

from fastapi import FastAPI
from database import Base, engine
from routers import categorias, platos, clientes, meseros, pedidos, detalles_pedidos

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Inicializar la aplicación
app = FastAPI(title="API REST - Restaurante")

# Registrar routers
app.include_router(categorias.router)
app.include_router(platos.router)
app.include_router(clientes.router)
app.include_router(meseros.router)
app.include_router(pedidos.router)
app.include_router(detalles_pedidos.router)

@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a la API del Restaurante"}
