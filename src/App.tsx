import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaginaCadastroUsuario from "./Pagina";
import PaginaLogin from "./PaginaLogin";
import MenuCadastro from "./MenuCadastro";
import Funcionario from "./Funcionario";
import Gerente from "./Gerente";
import Secretario from "./Secretario";
import TodosCadastros from "./TodosCadastros";
import EditarUsuario from './EditarUsuario';

// Importe as páginas de cadastro quando criar

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PaginaCadastroUsuario />} />
                <Route path="/PaginaLogin" element={<PaginaLogin />} />
                <Route path="/menu-cadastro" element={<MenuCadastro />} />
                <Route path="/cadastro-funcionario" element={<Funcionario />} />
                <Route path="/cadastro-gerente" element={<Gerente />} />
                <Route path="/cadastro-secretario" element={<Secretario />} />
                <Route path="/todos-cadastros" element={<TodosCadastros />} />
                <Route path="/editar-usuario/:id" element={<EditarUsuario />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;



