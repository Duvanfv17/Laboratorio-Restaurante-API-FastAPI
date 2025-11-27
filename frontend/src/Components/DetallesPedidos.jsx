import { useState, useEffect } from "react";
import api from "../api/api";

export default function DetallesPedidos() {
  const [detalles, setDetalles] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [platos, setPlatos] = useState([]);

  const [form, setForm] = useState({
    pedido_id: "",
    plato_id: "",
    cantidad: "",
    subtotal: "",
  });

  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => {
    const resDetalles = await api.get("/detalles_pedidos/");
    const resPedidos = await api.get("/pedidos/");
    const resPlatos = await api.get("/platos/");
    setDetalles(resDetalles.data);
    setPedidos(resPedidos.data);
    setPlatos(resPlatos.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambios = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    const datos = { 
      ...form, 
      cantidad: parseInt(form.cantidad),
      subtotal: parseFloat(form.subtotal) 
    };

    if (editId === null) {
      await api.post("/detalles_pedidos/", datos);
    } else {
      await api.put(`/detalles_pedidos/${editId}`, datos);
      setEditId(null);
    }

    setForm({ pedido_id: "", plato_id: "", cantidad: "", subtotal: "" });
    cargarDatos();
  };

  const editar = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const eliminar = async (id) => {
    await api.delete(`/detalles_pedidos/${id}`);
    cargarDatos();
  };

  return (
    <div>
      <h2>Detalles de pedidos</h2>

      <select name="pedido_id" value={form.pedido_id} onChange={manejarCambios}>
        <option value="">Seleccione pedido</option>
        {pedidos.map((p) => (
          <option key={p.id} value={p.id}>Pedido #{p.id}</option>
        ))}
      </select>

      <select name="plato_id" value={form.plato_id} onChange={manejarCambios}>
        <option value="">Seleccione plato</option>
        {platos.map((p) => (
          <option key={p.id} value={p.id}>{p.nombre}</option>
        ))}
      </select>

      <input name="cantidad" placeholder="Cantidad" value={form.cantidad} onChange={manejarCambios} />
      <input name="subtotal" placeholder="Subtotal" value={form.subtotal} onChange={manejarCambios} />

      <button onClick={guardar}>{editId === null ? "Crear" : "Actualizar"}</button>

      <hr />

      <h3>Lista de detalles</h3>
      <ul>
        {detalles.map((d) => (
          <li key={d.id}>
            Pedido {d.pedido_id} — Plato {d.plato_id} — Cantidad: {d.cantidad} — Subtotal: {d.subtotal}
            <button onClick={() => editar(d)}>Editar</button>
            <button onClick={() => eliminar(d.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
