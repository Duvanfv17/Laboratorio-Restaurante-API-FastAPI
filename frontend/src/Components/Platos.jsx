import { useState, useEffect } from "react";
import api from "../api/api";

export default function Platos() {
  const [platos, setPlatos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
  });
  const [editId, setEditId] = useState(null);

  const cargarDatos = async () => {
    const resPlatos = await api.get("/platos/");
    const resCategorias = await api.get("/categorias/");
    setPlatos(resPlatos.data);
    setCategorias(resCategorias.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const manejarCambios = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const guardar = async () => {
    const datos = { ...form, precio: parseFloat(form.precio) };

    if (editId === null) {
      await api.post("/platos/", datos);
    } else {
      await api.put(`/platos/${editId}`, datos);
      setEditId(null);
    }

    setForm({ nombre: "", descripcion: "", precio: "", categoria_id: "" });
    cargarDatos();
  };

  const editar = (item) => {
    setEditId(item.id);
    setForm(item);
  };

  const eliminar = async (id) => {
    await api.delete(`/platos/${id}`);
    cargarDatos();
  };

  return (
    <div>
      <h2>Platos</h2>

      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={manejarCambios} />
      <input
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={manejarCambios}
      />
      <input name="precio" placeholder="Precio" value={form.precio} onChange={manejarCambios} />

      <select name="categoria_id" value={form.categoria_id} onChange={manejarCambios}>
        <option value="">Seleccione categoría</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      <button onClick={guardar}>{editId === null ? "Crear" : "Actualizar"}</button>

      <hr />

      <h3>Lista de platos</h3>
      <ul>
        {platos.map((p) => (
          <li key={p.id}>
            {p.nombre} — ${p.precio} — {p.descripcion} (Cat: {p.categoria_id})
            <button onClick={() => editar(p)}>Editar</button>
            <button onClick={() => eliminar(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
