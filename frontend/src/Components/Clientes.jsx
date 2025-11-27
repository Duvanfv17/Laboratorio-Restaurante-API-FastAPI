import { useState, useEffect } from "react";
import api from "../api/api";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nombre: "", telefono: "", correo: "" });
  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => {
    const res = await api.get("/clientes/");
    setClientes(res.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambios = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    if (editId === null) {
      await api.post("/clientes/", form);
    } else {
      await api.put(`/clientes/${editId}`, form);
      setEditId(null);
    }
    setForm({ nombre: "", telefono: "", correo: "" });
    cargarDatos();
  };

  const editar = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const eliminar = async (id) => {
    await api.delete(`/clientes/${id}`);
    cargarDatos();
  };

  return (
    <div>
      <h2>Clientes</h2>

      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambios} />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={manejarCambios} />
      <input name="correo" placeholder="Correo" value={form.correo} onChange={manejarCambios} />

      <button onClick={guardar}>{editId === null ? "Crear" : "Actualizar"}</button>

      <hr />

      <h3>Lista de clientes</h3>

      <ul>
        {clientes.map((c) => (
          <li key={c.id}>
            {c.nombre} - {c.telefono} - {c.correo}
            <button onClick={() => editar(c)}>Editar</button>
            <button onClick={() => eliminar(c.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
