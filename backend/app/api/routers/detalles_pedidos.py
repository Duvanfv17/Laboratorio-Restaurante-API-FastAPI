# app/api/routers/detalles_pedidos.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.database.connection import SessionLocal

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
    # Pydantic leerá la propiedad subtotal desde el modelo
    return nuevo_detalle

@router.get("/", response_model=list[schemas.DetallePedido])
def obtener_detalles(db: Session = Depends(get_db)):
    detalles = db.query(models.DetallePedido).all()
    # No es necesario setear subtotal si usas @property y from_attributes=True,
    # pero para seguridad (si algún ORMs no expone la property) podemos inyectarlo:
    for d in detalles:
        try:
            # fuerza la lectura para que Pydantic la vea
            _ = d.subtotal
        except Exception:
            pass
    return detalles

@router.get("/{id}", response_model=schemas.DetallePedido)
def obtener_detalle(id: int, db: Session = Depends(get_db)):
    detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    return detalle

@router.put("/{id}", response_model=schemas.DetallePedido)
def actualizar_detalle(id: int, detalle_actualizado: schemas.DetallePedidoCreate, db: Session = Depends(get_db)):
    detalle_db = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not detalle_db:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    for key, value in detalle_actualizado.dict().items():
        setattr(detalle_db, key, value)
    db.commit()
    db.refresh(detalle_db)
    return detalle_db

@router.delete("/{id}")
def eliminar_detalle(id: int, db: Session = Depends(get_db)):
    detalle = db.query(models.DetallePedido).filter(models.DetallePedido.id == id).first()
    if not detalle:
        raise HTTPException(status_code=404, detail="Detalle no encontrado")
    db.delete(detalle)
    db.commit()
    return {"mensaje": "Detalle eliminado correctamente"}
