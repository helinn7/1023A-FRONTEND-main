import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Gerente.css';

interface GerenteState {
  idGerente: number;
  nomeGerente: string;
  salarioGerente: number;
  departamentoGerente: string;
  idUsuario: number;
}

function Gerente() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<GerenteState>({
    idGerente: 0,
    nomeGerente: "",
    salarioGerente: 0,
    departamentoGerente: "",
    idUsuario: 0
  });
  const [idGerenteEditando, setIdGerenteEditando] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [gerentes, setGerentes] = useState<GerenteState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscaDados = async () => {
      try {
        const resultado = await fetch('http://localhost:8000/gerente');
        if (resultado.ok) {
          const dados = await resultado.json();
          setGerentes(dados);
        } else {
          setMensagem("Erro ao buscar gerentes.");
        }
      } catch (error) {
        setMensagem("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };
    buscaDados();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'salarioGerente' || name === 'idUsuario' || name === 'idGerente'
        ? Number(value)
        : value
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");

    if (!formData.nomeGerente || !formData.departamentoGerente || formData.idUsuario <= 0) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const url = idGerenteEditando 
        ? `http://localhost:8000/gerente/${idGerenteEditando}`
        : 'http://localhost:8000/gerente';

      const method = idGerenteEditando ? 'PUT' : 'POST';

      const resposta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (resposta.ok) {
        const gerenteAtualizado = await resposta.json();
        
        if (idGerenteEditando) {
          setGerentes(gerentes.map(g => 
            g.idGerente === idGerenteEditando ? gerenteAtualizado : g
          ));
          setMensagem("Gerente atualizado com sucesso!");
        } else {
          setGerentes([...gerentes, gerenteAtualizado]);
          setMensagem("Gerente cadastrado com sucesso!");
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
      idGerente: 0,
      nomeGerente: "",
      salarioGerente: 0,
      departamentoGerente: "",
      idUsuario: 0
    });
    setIdGerenteEditando(null);
  };

  const excluirGerente = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este gerente?")) return;
    
    try {
      const resposta = await fetch(`http://localhost:8000/gerente/${id}`, {
        method: 'DELETE',
      });
      
      if (resposta.ok) {
        setGerentes(gerentes.filter(g => g.idGerente !== id));
        setMensagem("Gerente excluído com sucesso.");
        if (idGerenteEditando === id) limparFormulario();
      } else {
        setMensagem("Erro ao excluir gerente.");
      }
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  const editarGerente = (gerente: GerenteState) => {
    setFormData({ ...gerente });
    setIdGerenteEditando(gerente.idGerente);
    setMensagem(`Editando gerente: ${gerente.nomeGerente}`);
  };

  return (
    <div className="gerente-container">
      <h1 className="gerente-titulo">Cadastro de Gerentes</h1>
      <button className="gerente-botao" onClick={() => navigate('/menu-cadastro')}>Início</button>
      
      {mensagem && (
        <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
          <p>{mensagem}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idGerente">ID do Gerente:</label>
          <input
            type="number"
            id="idGerente"
            name="idGerente"
            value={formData.idGerente || ""}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nomeGerente">Nome:</label>
          <input
            type="text"
            id="nomeGerente"
            name="nomeGerente"
            value={formData.nomeGerente}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salarioGerente">Salário:</label>
          <input
            type="number"
            id="salarioGerente"
            name="salarioGerente"
            value={formData.salarioGerente || ""}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="departamentoGerente">Departamento:</label>
          <input
            type="text"
            id="departamentoGerente"
            name="departamentoGerente"
            value={formData.departamentoGerente}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="idUsuario">ID do Usuário:</label>
          <input
            type="number"
            id="idUsuario"
            name="idUsuario"
            value={formData.idUsuario || ""}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>
        
        <div className="botoes-acao">
          <button type="submit" className="gerente-botao">
            {idGerenteEditando ? "Atualizar Gerente" : "Cadastrar Gerente"}
          </button>
          {idGerenteEditando && (
            <button 
              type="button" 
              onClick={limparFormulario}
              className="gerente-botao cancelar"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <h2 className="gerente-titulo lista-titulo">Gerentes Cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : gerentes.length === 0 ? (
        <p>Nenhum gerente cadastrado ainda.</p>
      ) : (
        <div className="gerentes-lista">
          {gerentes.map((gerente, index) => (
            <div
              key={gerente.idGerente || `g-${index}`}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                margin: "16px 0",
                background: "#fafbfc"
              }}
            >
              <div><strong>ID:</strong> {gerente.idGerente}</div>
              <div><strong>Nome:</strong> {gerente.nomeGerente}</div>
              <div><strong>Salário:</strong> R$ {gerente.salarioGerente}</div>
              <div><strong>Departamento:</strong> {gerente.departamentoGerente}</div>
              <div><strong>ID do Usuário:</strong> {gerente.idUsuario}</div>
              <button
                className="gerente-botao"
                style={{ background: "#e67e22", marginTop: "8px", marginRight: "8px" }}
                onClick={() => editarGerente(gerente)}
              >
                Editar
              </button>
              <button
                className="gerente-botao"
                style={{ background: "#e74c3c", marginTop: "8px" }}
                onClick={() => excluirGerente(gerente.idGerente)}
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gerente;
