import { useState, useEffect } from "react";
import api from "../api/api";

export default function Meseros() {
  const [meseros, setMeseros] = useState([]);
  const [form, setForm] = useState({ nombre: "", codigo_empleado: "" });
  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => {
    const res = await api.get("/meseros/");
    setMeseros(res.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambios = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    if (editId === null) {
      await api.post("/meseros/", form);
    } else {
      await api.put(`/meseros/${editId}`, form);
      setEditId(null);
    }
    setForm({ nombre: "", codigo_empleado: "" });
    cargarDatos();
  };

  const editar = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const eliminar = async (id) => {
    await api.delete(`/meseros/${id}`);
    cargarDatos();
  };

  return (
    <div>
      <h2>Meseros</h2>

      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambios} />
      <input
        name="codigo_empleado"
        placeholder="Código"
        value={form.codigo_empleado}
        onChange={manejarCambios}
      />

      <button onClick={guardar}>{editId === null ? "Crear" : "Actualizar"}</button>

      <hr />

      <h3>Lista de meseros</h3>
      <ul>
        {meseros.map((m) => (
          <li key={m.id}>
            {m.nombre} — {m.codigo_empleado}
            <button onClick={() => editar(m)}>Editar</button>
            <button onClick={() => eliminar(m.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
