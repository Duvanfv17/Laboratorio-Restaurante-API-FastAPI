import { useState, useEffect } from "react";
import api from "../api/api";

function Platos() {
    // Select categorías
    const [categorias, setCategorias] = useState([]);

    // Crear
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoriaId, setCategoriaId] = useState("");

    // Listado
    const [platos, setPlatos] = useState([]);

    // Edición
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState("");
    const [editDescripcion, setEditDescripcion] = useState("");
    const [editPrecio, setEditPrecio] = useState("");
    const [editCategoriaId, setEditCategoriaId] = useState("");

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const resPlatos = await api.get("/platos/");
            const resCategorias = await api.get("/categorias/");
            setPlatos(resPlatos.data);
            setCategorias(resCategorias.data);
        } catch (error) {
            console.log("Error al cargar datos", error);
        }
    };

    // Crear plato
    const crearPlato = async () => {
        try {
            await api.post("/platos/", {
                nombre,
                descripcion,
                precio: parseFloat(precio),
                categoria_id: categoriaId
            });

            alert("Plato creado correctamente");

            setNombre("");
            setDescripcion("");
            setPrecio("");
            setCategoriaId("");

            cargarDatos();

        } catch (error) {
            alert("Error al crear plato");
        }
    };

    // Eliminar plato
    const eliminarPlato = async (id) => {
        try {
            await api.delete(`/platos/${id}`);
            alert("Plato eliminado");
            cargarDatos();
        } catch (error) {
            alert("Error al eliminar plato");
        }
    };

    // Activar edición
    const activarEdicion = (p) => {
        setEditando(p.id);
        setEditNombre(p.nombre);
        setEditDescripcion(p.descripcion);
        setEditPrecio(p.precio);
        setEditCategoriaId(p.categoria_id);
    };

    // Guardar cambios
    const actualizarPlato = async () => {
        try {
            await api.put(`/platos/${editando}`, {
                nombre: editNombre,
                descripcion: editDescripcion,
                precio: parseFloat(editPrecio),
                categoria_id: editCategoriaId
            });

            alert("Plato actualizado");

            setEditando(null);
            cargarDatos();

        } catch (error) {
            alert("Error al actualizar plato");
        }
    };

    return (
        <div>
            <h2>Crear Plato</h2>

            {/* FORM */}
            <div>
                <label>Nombre:</label><br />
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                /><br /><br />

                <label>Descripción:</label><br />
                <input
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                /><br /><br />

                <label>Precio:</label><br />
                <input
                    type="number"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                /><br /><br />

                <label>Categoría:</label><br />
                <select
                    value={categoriaId}
                    onChange={(e) => setCategoriaId(e.target.value)}
                >
                    <option value="">Seleccione</option>
                    {categorias.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.nombre}
                        </option>
                    ))}
                </select><br /><br />

                <button onClick={crearPlato}>Guardar</button>
            </div>

            <hr />

            {/* TABLA */}
            <h2>Listado de Platos</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Categoría</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {platos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>

                            {/* NOMBRE */}
                            <td>
                                {editando === p.id ? (
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                    />
                                ) : (
                                    p.nombre
                                )}
                            </td>

                            {/* DESCRIPCIÓN */}
                            <td>
                                {editando === p.id ? (
                                    <input
                                        value={editDescripcion}
                                        onChange={(e) => setEditDescripcion(e.target.value)}
                                    />
                                ) : (
                                    p.descripcion
                                )}
                            </td>

                            {/* PRECIO */}
                            <td>
                                {editando === p.id ? (
                                    <input
                                        type="number"
                                        value={editPrecio}
                                        onChange={(e) => setEditPrecio(e.target.value)}
                                    />
                                ) : (
                                    `$${p.precio}`
                                )}
                            </td>

                            {/* CATEGORÍA */}
                            <td>
                                {editando === p.id ? (
                                    <select
                                        value={editCategoriaId}
                                        onChange={(e) => setEditCategoriaId(e.target.value)}
                                    >
                                        {categorias.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.nombre}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    categorias.find((c) => c.id === p.categoria_id)?.nombre
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === p.id ? (
                                    <>
                                        <button onClick={actualizarPlato}>Guardar</button>
                                        <button onClick={() => setEditando(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(p)}>Editar</button>
                                        <button
                                            onClick={() => eliminarPlato(p.id)}
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

export default Platos;
