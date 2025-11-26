# app/api/routers/clientes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.database.connection import SessionLocal


router = APIRouter(prefix="/clientes", tags=["Clientes"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Cliente])
def obtener_clientes(db: Session = Depends(get_db)):
    return db.query(models.Cliente).all()

@router.post("/", response_model=schemas.Cliente)
def crear_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    nuevo_cliente = models.Cliente(**cliente.dict())
    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)
    return nuevo_cliente

@router.put("/{id}", response_model=schemas.Cliente)
def actualizar_cliente(id: int, cliente_actualizado: schemas.ClienteCreate, db: Session = Depends(get_db)):
    cliente_db = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not cliente_db:
        return {"error": "Cliente no encontrado"}
    for key, value in cliente_actualizado.dict().items():
        setattr(cliente_db, key, value)
    db.commit()
    db.refresh(cliente_db)
    return cliente_db

@router.delete("/{id}")
def eliminar_cliente(id: int, db: Session = Depends(get_db)):
    cliente = db.query(models.Cliente).filter(models.Cliente.id == id).first()
    if not cliente:
        return {"error": "Cliente no encontrado"}
    db.delete(cliente)
    db.commit()
    return {"mensaje": "Cliente eliminado correctamente"}
