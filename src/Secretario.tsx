import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Secretario.css';

interface SecretarioState {
  idSecretario: number;
  nomeSecretario: string;
  salarioSecretario: number;
  setorSecretario: string;
  idUsuario?: number; // Opcional caso precise no futuro
}

function Secretario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SecretarioState>({
    idSecretario: 0,
    nomeSecretario: "",
    salarioSecretario: 0,
    setorSecretario: ""
  });
  const [idSecretarioEditando, setIdSecretarioEditando] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [secretarios, setSecretarios] = useState<SecretarioState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarSecretarios = async () => {
      try {
        const response = await fetch('http://localhost:8000/secretarios');
        if (response.ok) {
          const dados = await response.json();
          setSecretarios(dados);
        } else {
          setMensagem("Erro ao buscar secretários.");
        }
      } catch (error) {
        setMensagem("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };
    carregarSecretarios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'salarioSecretario' || name === 'idSecretario'
        ? Number(value)
        : value
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");

    if (!formData.nomeSecretario || !formData.setorSecretario) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const url = idSecretarioEditando 
        ? `http://localhost:8000/secretarios/${idSecretarioEditando}`
        : 'http://localhost:8000/secretarios';
      const method = idSecretarioEditando ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (resposta.ok) {
        const secretarioAtualizado = await resposta.json();
        
        if (idSecretarioEditando) {
          setSecretarios(secretarios.map(s => 
            s.idSecretario === idSecretarioEditando ? secretarioAtualizado : s
          ));
          setMensagem("Secretário atualizado com sucesso!");
        } else {
          setSecretarios([...secretarios, secretarioAtualizado]);
          setMensagem("Secretário cadastrado com sucesso!");
        }

        limparFormulario();
      } else {
        const erro = await resposta.json();
        setMensagem(erro.message || "Erro ao processar a requisição.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor.");
    }
  }

  const limparFormulario = () => {
    setFormData({
      idSecretario: 0,
      nomeSecretario: "",
      salarioSecretario: 0,
      setorSecretario: ""
    });
    setIdSecretarioEditando(null);
  };

  const excluirSecretario = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este secretário?")) return;
    
    try {
      const resposta = await fetch(`http://localhost:8000/secretarios/${id}`, {
        method: 'DELETE',
      });
      
      if (resposta.ok) {
        setSecretarios(secretarios.filter(s => s.idSecretario !== id));
        setMensagem("Secretário excluído com sucesso.");
        if (idSecretarioEditando === id) limparFormulario();
      } else {
        setMensagem("Erro ao excluir secretário.");
      }
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  const editarSecretario = (secretario: SecretarioState) => {
    setFormData({ ...secretario });
    setIdSecretarioEditando(secretario.idSecretario);
    setMensagem(`Editando secretário: ${secretario.nomeSecretario}`);
  };

  return (
    <div className="secretario-container">
      <h1 className="secretario-titulo">Cadastro de Secretários</h1>
      <button className="secretario-botao" onClick={() => navigate('/menu-cadastro')}>
        Voltar ao Menu
      </button>
      
      {mensagem && (
        <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
          <p>{mensagem}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idSecretario">ID do Secretário:</label>
          <input
            type="number"
            id="idSecretario"
            name="idSecretario"
            value={formData.idSecretario || ""}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nomeSecretario">Nome:</label>
          <input
            type="text"
            id="nomeSecretario"
            name="nomeSecretario"
            value={formData.nomeSecretario}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salarioSecretario">Salário:</label>
          <input
            type="number"
            id="salarioSecretario"
            name="salarioSecretario"
            value={formData.salarioSecretario || ""}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="setorSecretario">Setor:</label>
          <input
            type="text"
            id="setorSecretario"
            name="setorSecretario"
            value={formData.setorSecretario}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="botoes-acao">
          <button type="submit" className="secretario-botao">
            {idSecretarioEditando ? "Atualizar Secretário" : "Cadastrar Secretário"}
          </button>
          {idSecretarioEditando && (
            <button 
              type="button" 
              onClick={limparFormulario}
              className="secretario-botao cancelar"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <h2 className="secretario-titulo lista-titulo">Secretários Cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : secretarios.length === 0 ? (
        <p>Nenhum secretário cadastrado ainda.</p>
      ) : (
        <div className="secretarios-lista">
          {secretarios.map((secretario, index) => (
            <div
              key={secretario.idSecretario || `s-${index}`}
              className={`secretario-card ${idSecretarioEditando === secretario.idSecretario ? 'editando' : ''}`}
            >
              <div className="secretario-info">
                <h3>{secretario.nomeSecretario}</h3>
                <p><strong>ID:</strong> {secretario.idSecretario}</p>
                <p><strong>Setor:</strong> {secretario.setorSecretario}</p>
                <p><strong>Salário:</strong> R$ {secretario.salarioSecretario.toFixed(2)}</p>
              </div>
              
              <div className="secretario-acoes">
                <button
                  onClick={() => editarSecretario(secretario)}
                  className={idSecretarioEditando === secretario.idSecretario ? 'botao-editar ativo' : 'botao-editar'}
                  disabled={idSecretarioEditando === secretario.idSecretario}
                >
                  Editar
                </button>
                <button
                  onClick={() => excluirSecretario(secretario.idSecretario)}
                  className="botao-excluir"
                  disabled={idSecretarioEditando === secretario.idSecretario}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Secretario;