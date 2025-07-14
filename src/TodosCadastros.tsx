import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './TodosCadastros.css';

interface Gerente {
  idGerente: number;
  nomeGerente: string;
  salarioGerente: number;
  departamentoGerente: string;
}

interface Funcionario {
  idFuncionario: number;
  nomeFuncionario: string;
  salarioFuncionario: number;
  cargoFuncionario: string;
}

interface Secretario {
  idSecretario: number;
  nomeSecretario: string;
  salarioSecretario: number;
  setorSecretario: string;
}

interface Usuario {
  id: number;
  nome: string;
  cidade: string;
}

function TodosCadastros() {
  const [gerente, setGerente] = useState<Gerente[]>([]);
  const [funcionario, setFuncionario] = useState<Funcionario[]>([]);
  const [secretario, setSecretario] = useState<Secretario[]>([]);
  const [usuario, setUsuario] = useState<Usuario[]>([]);
  const [mensagem, setMensagem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [gerenteRes, funcionarioRes, secretarioRes, usuarioRes] = await Promise.all([
          fetch("http://localhost:8000/gerente"),
          fetch("http://localhost:8000/funcionarios"),
          fetch("http://localhost:8000/secretarios"),
          fetch("http://localhost:8000/usuarios")
        ]);

        setGerente(gerenteRes.ok ? await gerenteRes.json() : []);
        setFuncionario(funcionarioRes.ok ? await funcionarioRes.json() : []);
        setSecretario(secretarioRes.ok ? await secretarioRes.json() : []);
        setUsuario(usuarioRes.ok ? await usuarioRes.json() : []);
      } catch (error) {
        setMensagem("erro|Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const editarUsuario = (usuario: Usuario) => {
    navigate(`/editar-usuario/${usuario.id}`, { state: usuario });
  };

  const excluirUsuario = async (id: number) => {
    if (!window.confirm("Deseja excluir este usuário?")) return;

    try {
      const resposta = await fetch(`http://localhost:8000/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (resposta.ok) {
        setUsuario(usuario.filter(u => u.id !== id));
        setMensagem("sucesso|Usuário excluído com sucesso.");
      } else {
        setMensagem("erro|Erro ao excluir usuário.");
      }
    } catch (error) {
      setMensagem("erro|Erro de conexão com o servidor.");
    }
  };

  if (isLoading) {
    return (
      <div className="todos-cadastros loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados...</p>
      </div>
    );
  }

  return (
    <div className="todos-cadastros">
      <div className="todos-cadastros-header">
        <h1>Todos os Cadastros</h1>
        <button onClick={() => navigate('/menu-cadastro')}>
          Voltar ao Menu
        </button>
      </div>

      {mensagem && (
        <div className={`mensagem ${mensagem.split("|")[0]}`}>
          {mensagem.split("|")[1]}
        </div>
      )}

      <div className="cadastro-section">
        <div className="cadastro-header">
          <h2 className="gerente-icon">Gerentes</h2>
          <span className="cadastro-count">{gerente.length} cadastros</span>
        </div>
        <ul>
          {gerente.length === 0 ? (
            <li>Nenhum gerente cadastrado.</li>
          ) : (
            gerente.map((g: Gerente) => (
              <li key={g.idGerente}>
                <span>{g.nomeGerente}</span>
                <div>
                  <span>{g.departamentoGerente}</span> - 
                  <span>R$ {Number(g.salarioGerente).toFixed(2)}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="cadastro-section">
        <div className="cadastro-header">
          <h2 className="funcionario-icon">Funcionários</h2>
          <span className="cadastro-count">{funcionario.length} cadastros</span>
        </div>
        <ul>
          {funcionario.length === 0 ? (
            <li>Nenhum funcionário cadastrado.</li>
          ) : (
            funcionario.map((f: Funcionario) => (
              <li key={f.idFuncionario}>
                <span>{f.nomeFuncionario}</span>
                <div>
                  <span>{f.cargoFuncionario}</span> - 
                  <span>R$ {Number(f.salarioFuncionario).toFixed(2)}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="cadastro-section">
        <div className="cadastro-header">
          <h2 className="secretario-icon">Secretários</h2>
          <span className="cadastro-count">{secretario.length} cadastros</span>
        </div>
        <ul>
          {secretario.length === 0 ? (
            <li>Nenhum secretário cadastrado.</li>
          ) : (
            secretario.map((s: Secretario) => (
              <li key={s.idSecretario}>
                <span>{s.nomeSecretario}</span>
                <div>
                  <span>{s.setorSecretario}</span> - 
                  <span>R$ {Number(s.salarioSecretario).toFixed(2)}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="cadastro-section">
        <div className="cadastro-header">
          <h2 className="usuario-icon">Usuários</h2>
          <span className="cadastro-count">{usuario.length} cadastros</span>
        </div>
        <ul>
          {usuario.length === 0 ? (
            <li>Nenhum usuário cadastrado.</li>
          ) : (
            usuario.map((c: Usuario) => (
              <li key={c.id}>
                <span>{c.nome}</span>
                <div>
                  <span>{c.cidade}</span>
                </div>
                <div className="acoes-usuario">
                  <button onClick={() => editarUsuario(c)}>Editar</button>
                  <button onClick={() => excluirUsuario(c.id)}>Excluir</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default TodosCadastros;
