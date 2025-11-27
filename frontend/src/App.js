import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Categorias from "./Components/Categorias";
import Clientes from "./Components/Clientes";
import Meseros from "./Components/Meseros";
import Platos from "./Components/Platos";
import Pedidos from "./Components/Pedidos";
import DetallesPedidos from "./Components/DetallesPedidos";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/categorias">Categorías</Link> |
        <Link to="/clientes">Clientes</Link> |
        <Link to="/meseros">Meseros</Link> |
        <Link to="/platos">Platos</Link> |
        <Link to="/pedidos">Pedidos</Link> |
        <Link to="/detalles-pedidos">Detalles Pedidos</Link>
      </nav>

      <Routes>
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/meseros" element={<Meseros />} />
        <Route path="/platos" element={<Platos />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/detalles-pedidos" element={<DetallesPedidos />} />
      </Routes>
    </Router>
  );
}

export default App;
