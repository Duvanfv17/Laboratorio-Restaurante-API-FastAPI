from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models.models as models
import schemas.schemas as schemas
from database import SessionLocal

router = APIRouter(prefix="/meseros", tags=["Meseros"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Mesero])
def obtener_meseros(db: Session = Depends(get_db)):
    return db.query(models.Mesero).all()

@router.post("/", response_model=schemas.Mesero)
def crear_mesero(mesero: schemas.MeseroCreate, db: Session = Depends(get_db)):
    nuevo_mesero = models.Mesero(**mesero.dict())
    db.add(nuevo_mesero)
    db.commit()
    db.refresh(nuevo_mesero)
    return nuevo_mesero

@router.put("/{id}", response_model=schemas.Mesero)
def actualizar_mesero(id: int, mesero_actualizado: schemas.MeseroCreate, db: Session = Depends(get_db)):
    mesero_db = db.query(models.Mesero).filter(models.Mesero.id == id).first()
    if not mesero_db:
        return {"error": "Mesero no encontrado"}
    for key, value in mesero_actualizado.dict().items():
        setattr(mesero_db, key, value)
    db.commit()
    db.refresh(mesero_db)
    return mesero_db

@router.delete("/{id}")
def eliminar_mesero(id: int, db: Session = Depends(get_db)):
    mesero = db.query(models.Mesero).filter(models.Mesero.id == id).first()
    if not mesero:
        return {"error": "Mesero no encontrado"}
    db.delete(mesero)
    db.commit()
    return {"mensaje": "Mesero eliminado correctamente"}
