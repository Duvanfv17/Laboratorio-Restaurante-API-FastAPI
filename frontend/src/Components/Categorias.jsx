import { useState, useEffect } from "react";
import api from "../api/api";


function Categorias() {
    // Estados para crear
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");

    // Estados para listar
    const [categorias, setCategorias] = useState([]);

    // Estado para edición
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState("");
    const [editDescripcion, setEditDescripcion] = useState("");

    // Cargar categorías al iniciar
    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const resp = await api.get("/categorias/");
            setCategorias(resp.data);
        } catch (error) {
            console.log("Error al cargar categorías", error);
        }
    };

    // Crear categoría
    const crearCategoria = async () => {
        try {
            await api.post("/categorias/", {
                nombre,
                descripcion,
            });

            alert("Categoría creada correctamente");

            setNombre("");
            setDescripcion("");

            cargarCategorias();
        } catch (error) {
            alert("Error al crear categoría");
        }
    };

    // Eliminar categoría
    const eliminarCategoria = async (id) => {
        try {
            await api.delete(`/categorias/${id}`);
            alert("Categoría eliminada");
            cargarCategorias();
        } catch (error) {
            alert("Error al eliminar categoría");
        }
    };

    // Activar modo edición
    const activarEdicion = (cat) => {
        setEditando(cat.id);
        setEditNombre(cat.nombre);
        setEditDescripcion(cat.descripcion);
    };

    // Guardar edición
    const actualizarCategoria = async () => {
        try {
            await api.put(`/categorias/${editando}`, {
                nombre: editNombre,
                descripcion: editDescripcion,
            });

            alert("Categoría actualizada");
            setEditando(null);
            cargarCategorias();
        } catch (error) {
            alert("Error al actualizar categoría");
        }
    };

    return (
        <div>
            <h2>Crear Categoría</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Nombre:</label><br />
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                /><br /><br />

                <label>Descripción:</label><br />
                <textarea
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                /><br /><br />

                <button onClick={crearCategoria}>Guardar</button>
            </div>

            <hr />

            {/* LISTADO */}
            <h2>Listado de Categorías</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {categorias.map((cat) => (
                        <tr key={cat.id}>
                            <td>{cat.id}</td>

                            {/* NOMBRE */}
                            <td>
                                {editando === cat.id ? (
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                    />
                                ) : (
                                    cat.nombre
                                )}
                            </td>

                            {/* DESCRIPCIÓN */}
                            <td>
                                {editando === cat.id ? (
                                    <textarea
                                        value={editDescripcion}
                                        onChange={(e) => setEditDescripcion(e.target.value)}
                                    />
                                ) : (
                                    cat.descripcion
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === cat.id ? (
                                    <>
                                        <button onClick={actualizarCategoria}>
                                            Guardar
                                        </button>
                                        <button onClick={() => setEditando(null)}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(cat)}>
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminarCategoria(cat.id)}
                                            style={{ color: "red", marginLeft: "10px" }}
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Categorias;
