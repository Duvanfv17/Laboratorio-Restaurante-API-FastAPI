# app/api/routers/platos.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import models
from app.schemas import schemas
from app.database.connection import SessionLocal


router = APIRouter(prefix="/platos", tags=["Platos"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Plato])
def obtener_platos(db: Session = Depends(get_db)):
    return db.query(models.Plato).all()

@router.post("/", response_model=schemas.Plato)
def crear_plato(plato: schemas.PlatoCreate, db: Session = Depends(get_db)):
    nuevo_plato = models.Plato(**plato.dict())
    db.add(nuevo_plato)
    db.commit()
    db.refresh(nuevo_plato)
    return nuevo_plato

@router.put("/{id}", response_model=schemas.Plato)
def actualizar_plato(id: int, plato_actualizado: schemas.PlatoCreate, db: Session = Depends(get_db)):
    plato_db = db.query(models.Plato).filter(models.Plato.id == id).first()
    if not plato_db:
        return {"error": "Plato no encontrado"}
    for key, value in plato_actualizado.dict().items():
        setattr(plato_db, key, value)
    db.commit()
    db.refresh(plato_db)
    return plato_db

@router.delete("/{id}")
def eliminar_plato(id: int, db: Session = Depends(get_db)):
    plato = db.query(models.Plato).filter(models.Plato.id == id).first()
    if not plato:
        return {"error": "Plato no encontrado"}
    db.delete(plato)
    db.commit()
    return {"mensaje": "Plato eliminado correctamente"}
