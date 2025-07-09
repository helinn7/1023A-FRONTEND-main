import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './PaginaLogin.css';

function PaginaLogin() {
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [sobrenome, setSobrenome] = useState("");
    const [cidade, setCidade] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMensagem("");
        setIsLoading(true);
        
        try {
            const resposta = await fetch('http://localhost:8000/usuarios');
            if (resposta.status === 200) {
                const usuarios = await resposta.json();
                const existe = usuarios.some((u: any) =>
                    String(u.id) === id &&
                    u.nome === nome &&
                    u.sobrenome === sobrenome &&
                    u.cidade === cidade
                );
                
                if (existe) {
                    setMensagem("success|Login realizado com sucesso!");
                    setTimeout(() => navigate("/menu-cadastro"), 1500);
                } else {
                    setMensagem("error|Credenciais inválidas. Tente novamente.");
                }
            } else {
                setMensagem("error|Erro ao conectar com o servidor.");
            }
        } catch (erro) {
            setMensagem("error|Erro de conexão com o backend.");
        } finally {
            setIsLoading(false);
        }
    }

    function irParaCadastro() {
        navigate("/");
    }

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-overlay"></div>
            </div>
            
            <div className="login-content">
                <div className="login-card">
                    <div className="login-header">
                        <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-258c-61f7-ba83-37c28f632f4b/raw?se=2025-07-08T14%3A53%3A50Z&sp=r&sv=2024-08-04&sr=b&scid=3250a5fc-12fc-575a-921e-86379424bdc2&skoid=71e8fa5c-90a9-4c17-827b-14c3005164d6&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-07T22%3A27%3A01Z&ske=2025-07-08T22%3A27%3A01Z&sks=b&skv=2024-08-04&sig=SNYy%2BN4cUS4BdWEPyPtaSFZ0oWiYynDeBFcelkCWqv0%3D" alt="Logo" className="login-logo" />
                        <h1>Bem-vindo de volta</h1>
                        <p>Faça login para acessar o painel administrativo</p>
                    </div>
                    
                    {mensagem && (
                        <div className={`login-message ${mensagem.split("|")[0]}`}>
                            {mensagem.split("|")[1]}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="form-group">
                            <label htmlFor="id">ID de Usuário</label>
                            <input
                                type="text"
                                id="id"
                                value={id}
                                onChange={e => setId(e.target.value)}
                                placeholder="Digite seu ID"
                                required
                            />
                            <i className="icon-user"></i>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="nome">Nome</label>
                            <input
                                type="text"
                                id="nome"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                placeholder="Digite seu nome"
                                required
                            />
                            <i className="icon-id-card"></i>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="sobrenome">Sobrenome</label>
                            <input
                                type="text"
                                id="sobrenome"
                                value={sobrenome}
                                onChange={e => setSobrenome(e.target.value)}
                                placeholder="Digite seu sobrenome"
                                required
                            />
                            <i className="icon-users"></i>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="cidade">Cidade</label>
                            <input
                                type="text"
                                id="cidade"
                                value={cidade}
                                onChange={e => setCidade(e.target.value)}
                                placeholder="Digite sua cidade"
                                required
                            />
                            <i className="icon-map-marker"></i>
                        </div>
                        
                        <button type="submit" className="login-button" disabled={isLoading}>
                            {isLoading ? (
                                <span className="loading-spinner"></span>
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>Não tem uma conta? <button onClick={irParaCadastro}>Cadastre-se</button></p>
                        <a href="#" className="forgot-password">Esqueceu sua senha?</a>
                    </div>
                </div>
                
            </div>
            
            <footer className="login-page-footer">
                <p>&copy; {new Date().getFullYear()} Sistema Administrativo. Todos os direitos reservados.</p>
                <div className="footer-links">
                    <a href="#">Termos de Serviço</a>
                    <a href="#">Política de Privacidade</a>
                    <a href="#">Contato</a>
                </div>
            </footer>
        </div>
    );
}

export default PaginaLogin;