from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models.models as models
import schemas.schemas as schemas
from database import SessionLocal

router = APIRouter(prefix="/pedidos", tags=["Pedidos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Pedido])
def obtener_pedidos(db: Session = Depends(get_db)):
    return db.query(models.Pedido).all()

@router.post("/", response_model=schemas.Pedido)
def crear_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    nuevo_pedido = models.Pedido(**pedido.dict())
    db.add(nuevo_pedido)
    db.commit()
    db.refresh(nuevo_pedido)
    return nuevo_pedido

@router.put("/{id}", response_model=schemas.Pedido)
def actualizar_pedido(id: int, pedido_actualizado: schemas.PedidoCreate, db: Session = Depends(get_db)):
    pedido_db = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not pedido_db:
        return {"error": "Pedido no encontrado"}
    for key, value in pedido_actualizado.dict().items():
        setattr(pedido_db, key, value)
    db.commit()
    db.refresh(pedido_db)
    return pedido_db

@router.delete("/{id}")
def eliminar_pedido(id: int, db: Session = Depends(get_db)):
    pedido = db.query(models.Pedido).filter(models.Pedido.id == id).first()
    if not pedido:
        return {"error": "Pedido no encontrado"}
    db.delete(pedido)
    db.commit()
    return {"mensaje": "Pedido eliminado correctamente"}
