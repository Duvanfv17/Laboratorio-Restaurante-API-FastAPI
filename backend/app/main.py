# app/main.py

from fastapi import FastAPI
from app.database.connection import Base, engine

from app.api.routers import categorias, platos, clientes, meseros, pedidos, detalles_pedidos

Base.metadata.create_all(bind=engine)

app = FastAPI(title="API REST - Restaurante")

app.include_router(categorias.router)
app.include_router(platos.router)
app.include_router(clientes.router)
app.include_router(meseros.router)
app.include_router(pedidos.router)
app.include_router(detalles_pedidos.router)

@app.get("/")
def inicio():
    return {"mensaje": "Bienvenido a la API del Restaurante"}

