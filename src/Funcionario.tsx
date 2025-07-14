import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Funcionario.css';

interface FuncionarioState {
  idFuncionario: number;
  nomeFuncionario: string;
  salarioFuncionario: number;
  cargoFuncionario: string;
  idUsuario: number;
}

function Funcionario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<FuncionarioState, 'idFuncionario'> & { idFuncionario?: number}>({
    nomeFuncionario: "",
    salarioFuncionario: 0,
    cargoFuncionario: "",
    idUsuario: 0
  });
  const [idFuncionarioEditando, setIdFuncionarioEditando] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState("");
  const [funcionarios, setFuncionarios] = useState<FuncionarioState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarFuncionarios = async () => {
      try {
        const response = await fetch('http://localhost:8000/funcionarios');
        if (response.ok) {
          const dados = await response.json();
          setFuncionarios(dados);
        } else {
          setMensagem("Erro ao buscar funcionários.");
        }
      } catch (error) {
        setMensagem("Erro de conexão com o servidor.");
      } finally {
        setLoading(false);
      }
    };
    carregarFuncionarios();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salarioFuncionario' || name === 'idUsuario' ? Number(value) : value
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem("");

    if (!formData.nomeFuncionario || !formData.cargoFuncionario || formData.idUsuario <= 0) {
      setMensagem("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      const url = idFuncionarioEditando 
        ? `http://localhost:8000/funcionarios/${idFuncionarioEditando}`
        : 'http://localhost:8000/funcionarios';
      const method = idFuncionarioEditando ? 'PUT' : 'POST';

      // No POST, não envie idFuncionario
      const { idFuncionario, ...bodyData } = formData;
      const dataToSend = idFuncionarioEditando ? formData : bodyData;

      const resposta = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (resposta.ok) {
        const funcionarioAtualizado = await resposta.json();
        
        if (idFuncionarioEditando) {
          setFuncionarios(funcionarios.map(f => 
            f.idFuncionario === idFuncionarioEditando ? funcionarioAtualizado : f
          ));
          setMensagem("Funcionário atualizado com sucesso!");
        } else {
          setFuncionarios([...funcionarios, funcionarioAtualizado]);
          setMensagem("Funcionário cadastrado com sucesso!");
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
      nomeFuncionario: "",
      salarioFuncionario: 0,
      cargoFuncionario: "",
      idUsuario: 0
    });
    setIdFuncionarioEditando(null);
  };

  const excluirFuncionario = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este funcionário?")) return;
    
    try {
      const resposta = await fetch(`http://localhost:8000/funcionarios/${id}`, {
        method: 'DELETE',
      });
      
      if (resposta.ok) {
        setFuncionarios(funcionarios.filter(f => f.idFuncionario !== id));
        setMensagem("Funcionário excluído com sucesso.");
        if (idFuncionarioEditando === id) limparFormulario();
      } else {
        setMensagem("Erro ao excluir funcionário.");
      }
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  const editarFuncionario = (funcionario: FuncionarioState) => {
    setFormData({ ...funcionario });
    setIdFuncionarioEditando(funcionario.idFuncionario);
    setMensagem(`Editando funcionário: ${funcionario.nomeFuncionario}`);
  };

  return (
    <div className="funcionario-container">
      <h1 className="funcionario-titulo">Cadastro de Funcionários</h1>
      <button className="funcionario-botao" onClick={() => navigate('/menu-cadastro')}>Início</button>
      
      {mensagem && (
        <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
          <p>{mensagem}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="idFuncionario">ID do Funcionário:</label>
          <input
            type="number"
            id="idFuncionario"
            name="idFuncionario"
            value={formData.idFuncionario || ""}
            onChange={handleInputChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label htmlFor="nomeFuncionario">Nome:</label>
          <input
            type="text"
            id="nomeFuncionario"
            name="nomeFuncionario"
            value={formData.nomeFuncionario}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="salarioFuncionario">Salário:</label>
          <input
            type="number"
            id="salarioFuncionario"
            name="salarioFuncionario"
            value={formData.salarioFuncionario || ""}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cargoFuncionario">Cargo:</label>
          <input
            type="text"
            id="cargoFuncionario"
            name="cargoFuncionario"
            value={formData.cargoFuncionario}
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
          <button type="submit" className="funcionario-botao">
            {idFuncionarioEditando ? "Atualizar Funcionário" : "Cadastrar Funcionário"}
          </button>
          {idFuncionarioEditando && (
            <button 
              type="button" 
              onClick={limparFormulario}
              className="funcionario-botao cancelar"
            >
              Cancelar Edição
            </button>
          )}
        </div>
      </form>

      <h2 className="funcionario-titulo lista-titulo">Funcionários Cadastrados</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : funcionarios.length === 0 ? (
        <p>Nenhum funcionário cadastrado ainda.</p>
      ) : (
        <div className="funcionarios-lista">
          {funcionarios.map((funcionario, index) => (
            <div
              key={funcionario.idFuncionario || `f-${index}`}
              className="funcionario-card"
              style={{
                border: idFuncionarioEditando === funcionario.idFuncionario ? "2px solid #3498db" : "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                margin: "16px 0",
                background: "#fafbfc"
              }}
            >
              <div><strong>ID:</strong> {funcionario.idFuncionario}</div>
              <div><strong>Nome:</strong> {funcionario.nomeFuncionario}</div>
              <div><strong>Salário:</strong> R$ {Number(funcionario.salarioFuncionario).toFixed(2)}</div>
              <div><strong>Cargo:</strong> {funcionario.cargoFuncionario}</div>
              <div><strong>ID do Usuário:</strong> {funcionario.idUsuario}</div>
              <div className="funcionario-acoes">
                <button
                  className="funcionario-botao editar"
                  onClick={() => editarFuncionario(funcionario)}
                  disabled={idFuncionarioEditando === funcionario.idFuncionario}
                >
                  Editar
                </button>
                <button
                  className="funcionario-botao excluir"
                  onClick={() => excluirFuncionario(funcionario.idFuncionario)}
                  disabled={idFuncionarioEditando === funcionario.idFuncionario}
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

export default Funcionario;