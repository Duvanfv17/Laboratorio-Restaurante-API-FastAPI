import { useState, useEffect } from "react";
import api from "../api/api";

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [meseros, setMeseros] = useState([]);

  const [form, setForm] = useState({
    cliente_id: "",
    mesero_id: "",
    total: "",
    estado: "",
  });

  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => {
    const resPedidos = await api.get("/pedidos/");
    const resClientes = await api.get("/clientes/");
    const resMeseros = await api.get("/meseros/");

    setPedidos(resPedidos.data);
    setClientes(resClientes.data);
    setMeseros(resMeseros.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambios = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    const datos = { ...form, total: parseFloat(form.total) };

    if (editId === null) {
      await api.post("/pedidos/", datos);
    } else {
      await api.put(`/pedidos/${editId}`, datos);
      setEditId(null);
    }

    setForm({ cliente_id: "", mesero_id: "", total: "", estado: "" });
    cargarDatos();
  };

  const editar = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const eliminar = async (id) => {
    await api.delete(`/pedidos/${id}`);
    cargarDatos();
  };

  return (
    <div>
      <h2>Pedidos</h2>

      <select name="cliente_id" value={form.cliente_id} onChange={manejarCambios}>
        <option value="">Seleccione cliente</option>
        {clientes.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <select name="mesero_id" value={form.mesero_id} onChange={manejarCambios}>
        <option value="">Seleccione mesero</option>
        {meseros.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      <input name="total" placeholder="Total" value={form.total} onChange={manejarCambios} />
      <input name="estado" placeholder="Estado" value={form.estado} onChange={manejarCambios} />

      <button onClick={guardar}>{editId === null ? "Crear" : "Actualizar"}</button>

      <hr />

      <h3>Lista de pedidos</h3>
      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            Pedido #{p.id} — Total: ${p.total} — Estado: {p.estado}
            <button onClick={() => editar(p)}>Editar</button>
            <button onClick={() => eliminar(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
