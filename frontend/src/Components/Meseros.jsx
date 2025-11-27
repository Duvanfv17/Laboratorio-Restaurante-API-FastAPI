import { useState, useEffect } from "react";
import api from "../api/api";

function Meseros() {
    // Estados para crear
    const [nombre, setNombre] = useState("");
    const [codigoEmpleado, setCodigoEmpleado] = useState("");

    // Estados para listar
    const [meseros, setMeseros] = useState([]);

    // Estado para edición
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState("");
    const [editCodigoEmpleado, setEditCodigoEmpleado] = useState("");

    // Cargar datos al iniciar
    useEffect(() => {
        cargarMeseros();
    }, []);

    const cargarMeseros = async () => {
        try {
            const resp = await api.get("/meseros/");
            setMeseros(resp.data);
        } catch (error) {
            console.log("Error al cargar meseros", error);
        }
    };

    // Crear mesero
    const crearMesero = async () => {
        try {
            await api.post("/meseros/", {
                nombre,
                codigo_empleado: codigoEmpleado,
            });

            alert("Mesero creado correctamente");

            setNombre("");
            setCodigoEmpleado("");

            cargarMeseros();
        } catch (error) {
            alert("Error al crear mesero");
        }
    };

    // Eliminar mesero
    const eliminarMesero = async (id) => {
        try {
            await api.delete(`/meseros/${id}`);
            alert("Mesero eliminado");
            cargarMeseros();
        } catch (error) {
            alert("Error al eliminar mesero");
        }
    };

    // Activar modo edición
    const activarEdicion = (mes) => {
        setEditando(mes.id);
        setEditNombre(mes.nombre);
        setEditCodigoEmpleado(mes.codigo_empleado);
    };

    // Guardar edición
    const actualizarMesero = async () => {
        try {
            await api.put(`/meseros/${editando}`, {
                nombre: editNombre,
                codigo_empleado: editCodigoEmpleado,
            });

            alert("Mesero actualizado");
            setEditando(null);
            cargarMeseros();
        } catch (error) {
            alert("Error al actualizar mesero");
        }
    };

    return (
        <div>
            <h2>Crear Mesero</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Nombre:</label><br />
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                /><br /><br />

                <label>Código de empleado:</label><br />
                <input
                    value={codigoEmpleado}
                    onChange={(e) => setCodigoEmpleado(e.target.value)}
                /><br /><br />

                <button onClick={crearMesero}>Guardar</button>
            </div>

            <hr />

            {/* LISTADO */}
            <h2>Listado de Meseros</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Código</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {meseros.map((mes) => (
                        <tr key={mes.id}>
                            <td>{mes.id}</td>

                            {/* NOMBRE */}
                            <td>
                                {editando === mes.id ? (
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                    />
                                ) : (
                                    mes.nombre
                                )}
                            </td>

                            {/* CÓDIGO EMPLEADO */}
                            <td>
                                {editando === mes.id ? (
                                    <input
                                        value={editCodigoEmpleado}
                                        onChange={(e) => setEditCodigoEmpleado(e.target.value)}
                                    />
                                ) : (
                                    mes.codigo_empleado
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === mes.id ? (
                                    <>
                                        <button onClick={actualizarMesero}>
                                            Guardar
                                        </button>

                                        <button onClick={() => setEditando(null)}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(mes)}>
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarMesero(mes.id)}
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

export default Meseros;
