from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models.models as models
import schemas.schemas as schemas
from database import SessionLocal

router = APIRouter(prefix="/categorias", tags=["Categorias"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Categoria])
def obtener_categorias(db: Session = Depends(get_db)):
    return db.query(models.Categoria).all()

@router.post("/", response_model=schemas.Categoria)
def crear_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    nueva_categoria = models.Categoria(**categoria.dict())
    db.add(nueva_categoria)
    db.commit()
    db.refresh(nueva_categoria)
    return nueva_categoria

@router.put("/{id}", response_model=schemas.Categoria)
def actualizar_categoria(id: int, categoria_actualizada: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    categoria_db = db.query(models.Categoria).filter(models.Categoria.id == id).first()
    if not categoria_db:
        return {"error": "Categoría no encontrada"}
    for key, value in categoria_actualizada.dict().items():
        setattr(categoria_db, key, value)
    db.commit()
    db.refresh(categoria_db)
    return categoria_db

@router.delete("/{id}")
def eliminar_categoria(id: int, db: Session = Depends(get_db)):
    categoria = db.query(models.Categoria).filter(models.Categoria.id == id).first()
    if not categoria:
        return {"error": "Categoría no encontrada"}
    db.delete(categoria)
    db.commit()
    return {"mensaje": "Categoría eliminada correctamente"}
