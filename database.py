# database.py
# Configuración de la base de datos usando SQLAlchemy

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

sqllitename = "restaurante.db"
# URL de conexión a SQLite (puedes cambiarla por PostgreSQL o MySQL si deseas)
URL_BASE_DATOS = "sqlite:///./restaurante.db"

# Crear motor de base de datos
engine = create_engine(URL_BASE_DATOS, connect_args={"check_same_thread": False})

# Sesión local
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Clase base para los modelos
Base = declarative_base()
