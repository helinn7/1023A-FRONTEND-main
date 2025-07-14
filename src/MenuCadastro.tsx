import { useNavigate } from "react-router-dom";
import './MenuCadastro.css'; 

function MenuCadastro() {
    const navigate = useNavigate();

    return (
        <div className="menu-cadastro-container">
            <div className="menu-cadastro">
                <h2>Menu de Cadastros</h2>
                <div className="botoes-cadastro">
                    <button onClick={() => navigate('/cadastro-funcionario')}>
                        Cadastro de Funcionários
                    </button>
                    <button onClick={() => navigate('/cadastro-gerente')}>
                        Cadastro de Gerentes
                    </button>
                    <button onClick={() => navigate('/cadastro-secretario')}>
                        Cadastro de Secretários
                    </button>
                    <button onClick={() => navigate('/todos-cadastros')}>
                        Ver Todos os Cadastros
                    </button>
                    <button onClick={() => navigate('/PaginaLogin')} style={{marginTop: '1rem', background: '#888', color: 'white'}}>
                        Voltar para Login
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MenuCadastro;