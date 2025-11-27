import { useState, useEffect } from "react";
import api from "../api/api";

function Pedidos() {
    // Estados para selects
    const [clientes, setClientes] = useState([]);
    const [meseros, setMeseros] = useState([]);

    // Estados para crear
    const [clienteId, setClienteId] = useState("");
    const [meseroId, setMeseroId] = useState("");
    const [total, setTotal] = useState("");
    const [estado, setEstado] = useState("");

    // Estados para listar
    const [pedidos, setPedidos] = useState([]);

    // Estado para edición
    const [editando, setEditando] = useState(null);
    const [editClienteId, setEditClienteId] = useState("");
    const [editMeseroId, setEditMeseroId] = useState("");
    const [editTotal, setEditTotal] = useState("");
    const [editEstado, setEditEstado] = useState("");

    // Cargar datos al iniciar
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const p = await api.get("/pedidos/");
            const c = await api.get("/clientes/");
            const m = await api.get("/meseros/");

            setPedidos(p.data);
            setClientes(c.data);
            setMeseros(m.data);

        } catch (error) {
            console.log("Error al cargar datos", error);
        }
    };

    // Crear pedido
    const crearPedido = async () => {
        try {
            await api.post("/pedidos/", {
                cliente_id: clienteId,
                mesero_id: meseroId,
                total: parseFloat(total),
                estado,
            });

            alert("Pedido creado correctamente");

            setClienteId("");
            setMeseroId("");
            setTotal("");
            setEstado("");

            cargarDatos();
        } catch (error) {
            alert("Error al crear pedido");
        }
    };

    // Eliminar pedido
    const eliminarPedido = async (id) => {
        try {
            await api.delete(`/pedidos/${id}`);
            alert("Pedido eliminado");
            cargarDatos();
        } catch (error) {
            alert("Error al eliminar pedido");
        }
    };

    // Activar modo edición
    const activarEdicion = (p) => {
        setEditando(p.id);
        setEditClienteId(p.cliente_id);
        setEditMeseroId(p.mesero_id);
        setEditTotal(p.total);
        setEditEstado(p.estado);
    };

    // Guardar edición
    const actualizarPedido = async () => {
        try {
            await api.put(`/pedidos/${editando}`, {
                cliente_id: editClienteId,
                mesero_id: editMeseroId,
                total: parseFloat(editTotal),
                estado: editEstado,
            });

            alert("Pedido actualizado correctamente");

            setEditando(null);
            cargarDatos();

        } catch (error) {
            alert("Error al actualizar pedido");
        }
    };

    return (
        <div>
            <h2>Crear Pedido</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Cliente:</label><br />
                <select
                    value={clienteId}
                    onChange={(e) => setClienteId(e.target.value)}
                >
                    <option value="">Seleccione</option>
                    {clientes.map((c) => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                </select><br /><br />

                <label>Mesero:</label><br />
                <select
                    value={meseroId}
                    onChange={(e) => setMeseroId(e.target.value)}
                >
                    <option value="">Seleccione</option>
                    {meseros.map((m) => (
                        <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                </select><br /><br />

                <label>Total:</label><br />
                <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                /><br /><br />

                <label>Estado:</label><br />
                <input
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                /><br /><br />

                <button onClick={crearPedido}>Guardar</button>
            </div>

            <hr />

            {/* LISTADO */}
            <h2>Listado de Pedidos</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Mesero</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {pedidos.map((p) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>

                            {/* CLIENTE */}
                            <td>
                                {editando === p.id ? (
                                    <select
                                        value={editClienteId}
                                        onChange={(e) => setEditClienteId(e.target.value)}
                                    >
                                        {clientes.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                ) : (
                                    clientes.find((c) => c.id === p.cliente_id)?.nombre
                                )}
                            </td>

                            {/* MESERO */}
                            <td>
                                {editando === p.id ? (
                                    <select
                                        value={editMeseroId}
                                        onChange={(e) => setEditMeseroId(e.target.value)}
                                    >
                                        {meseros.map((m) => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                        ))}
                                    </select>
                                ) : (
                                    meseros.find((m) => m.id === p.mesero_id)?.nombre
                                )}
                            </td>

                            {/* TOTAL */}
                            <td>
                                {editando === p.id ? (
                                    <input
                                        type="number"
                                        value={editTotal}
                                        onChange={(e) => setEditTotal(e.target.value)}
                                    />
                                ) : (
                                    `$${p.total}`
                                )}
                            </td>

                            {/* ESTADO */}
                            <td>
                                {editando === p.id ? (
                                    <input
                                        value={editEstado}
                                        onChange={(e) => setEditEstado(e.target.value)}
                                    />
                                ) : (
                                    p.estado
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === p.id ? (
                                    <>
                                        <button onClick={actualizarPedido}>Guardar</button>
                                        <button onClick={() => setEditando(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(p)}>Editar</button>
                                        <button
                                            onClick={() => eliminarPedido(p.id)}
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

export default Pedidos;
