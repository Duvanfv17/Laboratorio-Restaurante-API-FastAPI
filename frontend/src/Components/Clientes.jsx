import { useState, useEffect } from "react";
import api from "../api/api";

function Clientes() {

    // Estados para crear
    const [nombre, setNombre] = useState("");
    const [telefono, setTelefono] = useState("");
    const [correo, setCorreo] = useState("");

    // Estados para listar
    const [clientes, setClientes] = useState([]);

    // Estado para edición
    const [editando, setEditando] = useState(null);
    const [editNombre, setEditNombre] = useState("");
    const [editTelefono, setEditTelefono] = useState("");
    const [editCorreo, setEditCorreo] = useState("");

    // Cargar datos al iniciar
    useEffect(() => {
        cargarClientes();
    }, []);

    const cargarClientes = async () => {
        try {
            const resp = await api.get("/clientes/");
            setClientes(resp.data);
        } catch (error) {
            console.log("Error al cargar clientes", error);
        }
    };

    // Crear cliente
    const crearCliente = async () => {
        try {
            await api.post("/clientes/", {
                nombre,
                telefono,
                correo,
            });

            alert("Cliente creado correctamente");

            setNombre("");
            setTelefono("");
            setCorreo("");

            cargarClientes();
        } catch (error) {
            alert("Error al crear cliente");
        }
    };

    // Eliminar cliente
    const eliminarCliente = async (id) => {
        try {
            await api.delete(`/clientes/${id}`);
            alert("Cliente eliminado");
            cargarClientes();
        } catch (error) {
            alert("Error al eliminar cliente");
        }
    };

    // Activar modo edición
    const activarEdicion = (cliente) => {
        setEditando(cliente.id);
        setEditNombre(cliente.nombre);
        setEditTelefono(cliente.telefono);
        setEditCorreo(cliente.correo);
    };

    // Guardar edición
    const actualizarCliente = async () => {
        try {
            await api.put(`/clientes/${editando}`, {
                nombre: editNombre,
                telefono: editTelefono,
                correo: editCorreo,
            });

            alert("Cliente actualizado");
            setEditando(null);
            cargarClientes();
        } catch (error) {
            alert("Error al actualizar cliente");
        }
    };

    return (
        <div>
            <h2>Crear Cliente</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Nombre:</label><br />
                <input
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                /><br /><br />

                <label>Teléfono:</label><br />
                <input
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                /><br /><br />

                <label>Correo:</label><br />
                <input
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                /><br /><br />

                <button onClick={crearCliente}>Guardar</button>
            </div>

            <hr />

            {/* LISTADO */}
            <h2>Listado de Clientes</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {clientes.map((cli) => (
                        <tr key={cli.id}>
                            <td>{cli.id}</td>

                            {/* NOMBRE */}
                            <td>
                                {editando === cli.id ? (
                                    <input
                                        value={editNombre}
                                        onChange={(e) => setEditNombre(e.target.value)}
                                    />
                                ) : (
                                    cli.nombre
                                )}
                            </td>

                            {/* TELEFONO */}
                            <td>
                                {editando === cli.id ? (
                                    <input
                                        value={editTelefono}
                                        onChange={(e) => setEditTelefono(e.target.value)}
                                    />
                                ) : (
                                    cli.telefono
                                )}
                            </td>

                            {/* CORREO */}
                            <td>
                                {editando === cli.id ? (
                                    <input
                                        value={editCorreo}
                                        onChange={(e) => setEditCorreo(e.target.value)}
                                    />
                                ) : (
                                    cli.correo
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === cli.id ? (
                                    <>
                                        <button onClick={actualizarCliente}>
                                            Guardar
                                        </button>

                                        <button onClick={() => setEditando(null)}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(cli)}>
                                            Editar
                                        </button>

                                        <button
                                            onClick={() => eliminarCliente(cli.id)}
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

export default Clientes;
