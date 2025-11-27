from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.connection import Base, engine
from app.api.routers import categorias, platos, clientes, meseros, pedidos, detalles_pedidos

# Crear tablas
Base.metadata.create_all(bind=engine)

# Inicializar app
app = FastAPI(title="API REST - Restaurante")

# ----------------- CORS -----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)
# ----------------------------------------

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
