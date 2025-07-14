import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

interface Usuario {
  id: number;
  nome: string;
  cidade: string;
}

function EditarUsuario() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  // Tenta pegar os dados do usuário via state da navegação, se existir
  const usuarioInicial = location.state as Usuario | undefined;

  const [formData, setFormData] = useState<Usuario>({
    id: id ? Number(id) : 0,
    nome: usuarioInicial?.nome || "",
    cidade: usuarioInicial?.cidade || "",
  });

  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(!usuarioInicial); // se não tem dados iniciais, precisa buscar

  useEffect(() => {
    // Se não recebeu dados via state, buscar pelo id
    if (!usuarioInicial && id) {
      const fetchUsuario = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/usuarios/${id}`);
          if (response.ok) {
            const data = await response.json();
            setFormData({
              id: data.id,
              nome: data.nome,
              cidade: data.cidade,
            });
          } else {
            setMensagem("Erro ao buscar dados do usuário.");
          }
        } catch {
          setMensagem("Erro de conexão com o servidor.");
        } finally {
          setLoading(false);
        }
      };
      fetchUsuario();
    }
  }, [id, usuarioInicial]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");

    if (!formData.nome.trim() || !formData.cidade.trim()) {
      setMensagem("Preencha todos os campos.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/usuarios/${formData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: formData.nome,
          cidade: formData.cidade,
        })
      });

      if (response.ok) {
        setMensagem("Usuário atualizado com sucesso!");
        // Opcional: voltar para lista após alguns segundos
        setTimeout(() => {
          navigate("/todos-cadastros");
        }, 1500);
      } else {
        const errorData = await response.json();
        setMensagem(errorData.message || "Erro ao atualizar usuário.");
      }
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    }
  };

  if (loading) {
    return <p>Carregando dados do usuário...</p>;
  }

  return (
    <div className="editar-usuario-container">
      <h1>Editar Usuário</h1>
      {mensagem && (
        <div className={`mensagem ${mensagem.includes("sucesso") ? "sucesso" : "erro"}`}>
          {mensagem}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cidade">Cidade:</label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            required
          />
        </div>
        <div className="botoes-acao">
          <button type="submit">Salvar Alterações</button>
          <button type="button" onClick={() => navigate("/todos-cadastros")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditarUsuario;
