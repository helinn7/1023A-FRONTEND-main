
// Importa o hook useState do React para gerenciar estados locais
import { useState } from "react";
// Importa o hook useNavigate do React Router para navegação programática
import { useNavigate } from "react-router-dom";
// Importa o arquivo de estilos CSS para o componente
import './Funcionario.css';

// Componente principal de cadastro de funcionário
function Funcionario() {
    // Estado para o ID do funcionário
    const [idFuncionario, setIdFuncionario] = useState("");
    // Estado para o nome do funcionário
    const [nomeFuncionario, setNomeFuncionario] = useState("");
    // Estado para o salário do funcionário
    const [salarioFuncionario, setSalarioFuncionario] = useState("");
    // Estado para o cargo do funcionário
    const [cargoFuncionario, setCargoFuncionario] = useState("");
    // Estado para mensagens de sucesso ou erro
    const [mensagem, setMensagem] = useState("");
    // Hook para navegação
    const navigate = useNavigate();

    // Função para lidar com o envio do formulário de cadastro
    async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Evita o recarregamento da página
        setMensagem(""); // Limpa mensagens anteriores
        try {
            // Faz a requisição para o backend para cadastrar o funcionário
            const resposta = await fetch('http://localhost:8000/funcionarios', {
                method: 'POST', // Método HTTP POST
                headers: { 'Content-Type': 'application/json' }, // Define o tipo de conteúdo como JSON
                body: JSON.stringify({
                    idFuncionario: idFuncionario ? Number(idFuncionario) : undefined, // Envia o ID se preenchido
                    nomeFuncionario, // Envia o nome
                    salarioFuncionario: Number(salarioFuncionario), // Envia o salário convertido para número
                    cargoFuncionario // Envia o cargo
                })
            });
            // Se o cadastro for bem-sucedido
            if (resposta.status === 200 || resposta.status === 201) {
                setMensagem("Funcionário cadastrado com sucesso!"); // Mostra mensagem de sucesso
                setIdFuncionario(""); // Limpa o campo ID
                setNomeFuncionario(""); // Limpa o campo nome
                setSalarioFuncionario(""); // Limpa o campo salário
                setCargoFuncionario(""); // Limpa o campo cargo
                setTimeout(() => navigate("/menu-cadastro"), 2000); // Redireciona para o menu após 2 segundos
            } else {
                // Se houver erro, mostra a mensagem retornada pelo backend
                const erro = await resposta.json();
                setMensagem(erro.mensagem || "Erro ao cadastrar funcionário.");
            }
        } catch (erro) {
            // Se não conseguir conectar ao backend
            setMensagem("Erro de conexão com o backend.");
        }
    }

    // Função para voltar ao menu de cadastro
    function irParaMenu() {
        navigate("/menu-cadastro");
    }



    // Renderização do componente
    return (
        <div className="app"> {/* Container principal */}
            <header>
                <div className="logo">Cadastro de Funcionário</div> {/* Logo/título do topo */}
            </header>
            <main>
                {/* Exibe mensagem de sucesso ou erro, se houver */}
                {mensagem &&
                    <div className={`mensagem ${mensagem.includes("Erro") ? "erro" : "sucesso"}`}>
                        <p>{mensagem}</p>
                    </div>
                }
                <div className="funcionario-container"> {/* Container do formulário */}
                    <h2 className="funcionario-titulo">Cadastre um Funcionário</h2>
                    <form onSubmit={handleCadastro}> {/* Formulário de cadastro */}
                        <div className="form-group">
                            <label htmlFor="idFuncionario">ID:</label>
                            <input
                                type="number"
                                id="idFuncionario"
                                value={idFuncionario}
                                onChange={e => setIdFuncionario(e.target.value)} // Atualiza o estado do ID
                                placeholder="Digite o ID"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nomeFuncionario">Nome:</label>
                            <input
                                type="text"
                                id="nomeFuncionario"
                                value={nomeFuncionario}
                                onChange={e => setNomeFuncionario(e.target.value)} // Atualiza o estado do nome
                                placeholder="Digite o nome"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salarioFuncionario">Salário:</label>
                            <input
                                type="number"
                                id="salarioFuncionario"
                                value={salarioFuncionario}
                                onChange={e => setSalarioFuncionario(e.target.value)} // Atualiza o estado do salário
                                placeholder="Digite o salário"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cargoFuncionario">Cargo:</label>
                            <input
                                type="text"
                                id="cargoFuncionario"
                                value={cargoFuncionario}
                                onChange={e => setCargoFuncionario(e.target.value)} // Atualiza o estado do cargo
                                placeholder="Digite o cargo"
                                required
                            />
                        </div>
                        <button type="submit" className="funcionario-botao">
                            Cadastrar
                        </button>
                    </form>
                    <button className="funcionario-botao" style={{marginTop: '1rem'}} onClick={irParaMenu}>
                        Voltar ao menu
                    </button>
                </div>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Cadastro de Funcionários. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

// Exporta o componente para ser usado em outros arquivos
export default Funcionario;
