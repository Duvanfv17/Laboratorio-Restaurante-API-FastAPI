# routers/detalles_pedidos.py
# CRUD para Detalles de Pedidos

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models.models as models
import schemas.schemas as schemas
from database import SessionLocal

router = APIRouter(prefix="/detalles_pedidos", tags=["Detalles de Pedidos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.DetallePedido)
def crear_detalle(detalle: schemas.DetallePedidoCreate, db: Session = Depends(get_db)):
    nuevo_detalle = models.DetallePedido(**detalle.dict())
    db.add(nuevo_detalle)
    db.commit()
    db.refresh(nuevo_detalle)
    return nuevo_detalle

@router.get("/", response_model=list[schemas.DetallePedido])
def obtener_detalles(db: Session = Depends(get_db)):
    return db.query(models.DetallePedido).all()

@router.get("/{id}", response_model=schemas.DetallePedido)
def obtener_detalle(id: int, db: Session = Depends(get_db)):
    detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    return detalle

@router.put("/{id}", response_model=schemas.DetallePedido)
def actualizar_detalle(id: int, detalle_actualizado: schemas.DetallePedidoCreate, db: Session = Depends(get_db)):
    detalle_db = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not detalle_db:
        return {"error": "Detalle no encontrado"}
    for key, value in detalle_actualizado.dict().items():
        setattr(detalle_db, key, value)
    db.commit()
    db.refresh(detalle_db)
    return detalle_db

@router.delete("/{id}")
def eliminar_detalle(id: int, db: Session = Depends(get_db)):
    detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not detalle:
        return {"error": "Detalle no encontrado"}
    db.delete(detalle)
    db.commit()
    return {"mensaje": "Detalle eliminado correctamente"}
