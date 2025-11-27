import { useState, useEffect } from "react";
import api from "../api/api";

function DetallesPedidos() {
    // Selects
    const [pedidos, setPedidos] = useState([]);
    const [platos, setPlatos] = useState([]);

    // Estados para crear
    const [pedidoId, setPedidoId] = useState("");
    const [platoId, setPlatoId] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [subtotal, setSubtotal] = useState("");

    // Listado
    const [detalles, setDetalles] = useState([]);

    // Estados para edición
    const [editando, setEditando] = useState(null);
    const [editPedidoId, setEditPedidoId] = useState("");
    const [editPlatoId, setEditPlatoId] = useState("");
    const [editCantidad, setEditCantidad] = useState("");
    const [editSubtotal, setEditSubtotal] = useState("");

    // Cargar datos iniciales
    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const d = await api.get("/detalles_pedidos/");
            const p = await api.get("/pedidos/");
            const pl = await api.get("/platos/");

            setDetalles(d.data);
            setPedidos(p.data);
            setPlatos(pl.data);

        } catch (error) {
            console.log("Error al cargar datos", error);
        }
    };

    // Crear detalle
    const crearDetalle = async () => {
        try {
            await api.post("/detalles_pedidos/", {
                pedido_id: pedidoId,
                plato_id: platoId,
                cantidad: parseInt(cantidad),
                subtotal: parseFloat(subtotal)
            });

            alert("Detalle creado correctamente");

            setPedidoId("");
            setPlatoId("");
            setCantidad("");
            setSubtotal("");

            cargarDatos();
        } catch (error) {
            alert("Error al crear detalle");
        }
    };

    // Eliminar detalle
    const eliminarDetalle = async (id) => {
        try {
            await api.delete(`/detalles_pedidos/${id}`);
            alert("Detalle eliminado");
            cargarDatos();
        } catch (error) {
            alert("Error al eliminar detalle");
        }
    };

    // Activar modo edición
    const activarEdicion = (d) => {
        setEditando(d.id);
        setEditPedidoId(d.pedido_id);
        setEditPlatoId(d.plato_id);
        setEditCantidad(d.cantidad);
        setEditSubtotal(d.subtotal);
    };

    // Guardar edición
    const actualizarDetalle = async () => {
        try {
            await api.put(`/detalles_pedidos/${editando}`, {
                pedido_id: editPedidoId,
                plato_id: editPlatoId,
                cantidad: parseInt(editCantidad),
                subtotal: parseFloat(editSubtotal)
            });

            alert("Detalle actualizado correctamente");
            setEditando(null);
            cargarDatos();

        } catch (error) {
            alert("Error al actualizar detalle");
        }
    };

    return (
        <div>
            <h2>Crear Detalle de Pedido</h2>

            {/* FORMULARIO CREAR */}
            <div>
                <label>Pedido:</label><br />
                <select
                    value={pedidoId}
                    onChange={(e) => setPedidoId(e.target.value)}
                >
                    <option value="">Seleccione</option>
                    {pedidos.map((p) => (
                        <option key={p.id} value={p.id}>Pedido #{p.id}</option>
                    ))}
                </select><br /><br />

                <label>Plato:</label><br />
                <select
                    value={platoId}
                    onChange={(e) => setPlatoId(e.target.value)}
                >
                    <option value="">Seleccione</option>
                    {platos.map((pl) => (
                        <option key={pl.id} value={pl.id}>{pl.nombre}</option>
                    ))}
                </select><br /><br />

                <label>Cantidad:</label><br />
                <input
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                /><br /><br />

                <label>Subtotal:</label><br />
                <input
                    type="number"
                    value={subtotal}
                    onChange={(e) => setSubtotal(e.target.value)}
                /><br /><br />

                <button onClick={crearDetalle}>Guardar</button>
            </div>

            <hr />

            {/* TABLA */}
            <h2>Listado de Detalles</h2>

            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pedido</th>
                        <th>Plato</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    {detalles.map((d) => (
                        <tr key={d.id}>
                            <td>{d.id}</td>

                            {/* PEDIDO */}
                            <td>
                                {editando === d.id ? (
                                    <select
                                        value={editPedidoId}
                                        onChange={(e) => setEditPedidoId(e.target.value)}
                                    >
                                        {pedidos.map((p) => (
                                            <option key={p.id} value={p.id}>Pedido #{p.id}</option>
                                        ))}
                                    </select>
                                ) : (
                                    `Pedido #${d.pedido_id}`
                                )}
                            </td>

                            {/* PLATO */}
                            <td>
                                {editando === d.id ? (
                                    <select
                                        value={editPlatoId}
                                        onChange={(e) => setEditPlatoId(e.target.value)}
                                    >
                                        {platos.map((pl) => (
                                            <option key={pl.id} value={pl.id}>{pl.nombre}</option>
                                        ))}
                                    </select>
                                ) : (
                                    platos.find((pl) => pl.id === d.plato_id)?.nombre
                                )}
                            </td>

                            {/* CANTIDAD */}
                            <td>
                                {editando === d.id ? (
                                    <input
                                        type="number"
                                        value={editCantidad}
                                        onChange={(e) => setEditCantidad(e.target.value)}
                                    />
                                ) : (
                                    d.cantidad
                                )}
                            </td>

                            {/* SUBTOTAL */}
                            <td>
                                {editando === d.id ? (
                                    <input
                                        type="number"
                                        value={editSubtotal}
                                        onChange={(e) => setEditSubtotal(e.target.value)}
                                    />
                                ) : (
                                    `$${d.subtotal}`
                                )}
                            </td>

                            {/* BOTONES */}
                            <td>
                                {editando === d.id ? (
                                    <>
                                        <button onClick={actualizarDetalle}>Guardar</button>
                                        <button onClick={() => setEditando(null)}>Cancelar</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => activarEdicion(d)}>Editar</button>
                                        <button
                                            onClick={() => eliminarDetalle(d.id)}
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

export default DetallesPedidos;
