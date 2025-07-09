//1 - Criar tela inicial para login de administrador

 //2 -criar página que tenha 4 botões para levar para as páginas ( cadastro de funcionários, cadastro de cliente, cadastro de gerentes e cadastro de secretário)

//3 - CRIAR AS PÁGINAS 

 //4 - bonus - tentar criar página que mostre todos os cadastrados 



import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Secretario.css';

function Secretario() {
    const [idSecretario, setIdSecretario] = useState("");
    const [nomeSecretario, setNomeSecretario] = useState("");
    const [salarioSecretario, setSalarioSecretario] = useState("");
    const [setorSecretario, setSetorSecretario] = useState("");
    const [mensagem, setMensagem] = useState("");
    const navigate = useNavigate();

    async function handleCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagem("");
        try {
            const resposta = await fetch('http://localhost:8000/secretarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idSecretario: idSecretario ? Number(idSecretario) : undefined,
                    nomeSecretario,
                    salarioSecretario: Number(salarioSecretario),
                    setorSecretario
                })
            });
            if (resposta.status === 200 || resposta.status === 201) {
                setMensagem("Secretário cadastrado com sucesso!");
                setIdSecretario(""); setNomeSecretario(""); setSalarioSecretario(""); setSetorSecretario("");
                setTimeout(() => navigate("/menu-cadastro"), 2000);
            } else {
                const erro = await resposta.json();
                setMensagem(erro.mensagem || "Erro ao cadastrar secretário.");
            }
        } catch (erro) {
            setMensagem("Erro de conexão com o backend.");
        }
    }

    function irParaMenu() {
        navigate("/menu-cadastro");
    }

    return (
        <div className="app">
            <header>
                <div className="logo">Cadastro de Secretário</div>
            </header>
            <main>
                {mensagem &&
                    <div className={`mensagem ${mensagem.includes("Erro") ? "erro" : "sucesso"}`}>
                        <p>{mensagem}</p>
                    </div>
                }
                <div className="container-cadastro">
                    <h2>Cadastre um Secretário</h2>
                    <form onSubmit={handleCadastro}>
                        <div className="form-group">
                            <label htmlFor="idSecretario">ID:</label>
                            <input
                                type="number"
                                id="idSecretario"
                                value={idSecretario}
                                onChange={e => setIdSecretario(e.target.value)}
                                placeholder="Digite o ID"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="nomeSecretario">Nome:</label>
                            <input
                                type="text"
                                id="nomeSecretario"
                                value={nomeSecretario}
                                onChange={e => setNomeSecretario(e.target.value)}
                                placeholder="Digite o nome"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="salarioSecretario">Salário:</label>
                            <input
                                type="number"
                                id="salarioSecretario"
                                value={salarioSecretario}
                                onChange={e => setSalarioSecretario(e.target.value)}
                                placeholder="Digite o salário"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="setorSecretario">Setor:</label>
                            <input
                                type="text"
                                id="setorSecretario"
                                value={setorSecretario}
                                onChange={e => setSetorSecretario(e.target.value)}
                                placeholder="Digite o setor"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-cadastrar">
                            Cadastrar
                        </button>
                    </form>
                    <button className="btn-login" style={{marginTop: '1rem'}} onClick={irParaMenu}>
                        Voltar ao menu
                    </button>
                </div>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Cadastro de Secretários. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default Secretario;