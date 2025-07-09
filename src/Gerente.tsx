import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GerenteCard from "./GerenteCard.tsx";
import './Gerente.css';

interface GerenteState {
    idGerente: number,
    nomeGerente: string,
    salarioGerente: number,
    departamentoGerente: string
}

function Gerente() {
    const navigate = useNavigate();
    const [idGerente, setIdGerente] = useState("");
    const [nomeGerente, setNomeGerente] = useState("");
    const [salarioGerente, setSalarioGerente] = useState("");
    const [departamentoGerente, setDepartamentoGerente] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [gerentes, setGerentes] = useState<GerenteState[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const buscaDados = async () => {
            setLoading(true);
            try {
                const resultado = await fetch('http://localhost:8000/gerente');
                if (resultado.status === 200 || resultado.status === 201) {
                    const dados = await resultado.json();
                    setGerentes(dados);
                }
                if (resultado.status === 400) {
                    const erro = await resultado.json();
                    setMensagem(erro.mensagem);
                }
            } catch (erro) {
                setMensagem("Fetch não encontrado");
            }
            setLoading(false);
        };
        buscaDados();
    }, []);

    async function TrataCadastro(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!nomeGerente || !salarioGerente || !departamentoGerente) {
            setMensagem("Preencha todos os campos obrigatórios.");
            return;
        }
        if (parseFloat(salarioGerente) < 0) {
            setMensagem("Salário não pode ser negativo.");
            return;
        }

        const novoGerente = {
            idGerente: idGerente ? Number(idGerente) : undefined,
            nomeGerente: nomeGerente,
            salarioGerente: parseFloat(salarioGerente),
            departamentoGerente: departamentoGerente
        };

        try {
            const resposta = await fetch('http://localhost:8000/gerente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoGerente)
            });
            if (resposta.status === 201 || resposta.status === 200) {
                const gerenteCriado = await resposta.json();
                setGerentes([...gerentes, gerenteCriado]);
                setMensagem('Gerente cadastrado com sucesso!');
            } else {
                setMensagem('Erro ao cadastrar gerente.');
            }
        } catch (erro) {
            setMensagem('Erro de conexão com o backend.');
        }

        setIdGerente("");
        setNomeGerente("");
        setSalarioGerente("");
        setDepartamentoGerente("");
    }

    function trataIdGerente(event: React.ChangeEvent<HTMLInputElement>) {
        setIdGerente(event.target.value);
    }

    function trataNomeGerente(event: React.ChangeEvent<HTMLInputElement>) {
        setNomeGerente(event.target.value);
    }

    function trataSalarioGerente(event: React.ChangeEvent<HTMLInputElement>) {
        setSalarioGerente(event.target.value);
    }

    function trataDepartamentoGerente(event: React.ChangeEvent<HTMLInputElement>) {
        setDepartamentoGerente(event.target.value);
    }

    const excluirGerente = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este gerente?")) return;
        try {
            const resposta = await fetch(`http://localhost:8000/gerente/${id}`, {
                method: 'DELETE',
            });
            if (resposta.status === 200 || resposta.status === 204) {
                // Atualize a lista após deletar
                setGerentes(gerentes.filter(g => g.idGerente !== id));
                setMensagem('Gerente excluído com sucesso!');
            } else {
                setMensagem('Erro ao excluir gerente.');
            }
        } catch (erro) {
            setMensagem('Erro ao conectar com o backend.');
        }
    };

    return (
        <div className="gerente-container">
            <h1 className="gerente-titulo">Cadastro de Gerentes</h1>
            <button className="gerente-botao" onClick={() => navigate('/menu-cadastro')}>Início</button>
            {mensagem && <div className="mensagem"><p>{mensagem}</p></div>}

            <form onSubmit={TrataCadastro}>
                <div className="form-group">
                    <label htmlFor="idGerente">ID:</label>
                    <input
                        type="text"
                        id="idGerente"
                        value={idGerente}
                        onChange={trataIdGerente}
                        placeholder="Digite o ID"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="nomeGerente">Nome do Gerente:</label>
                    <input
                        type="text"
                        id="nomeGerente"
                        value={nomeGerente}
                        onChange={trataNomeGerente}
                        placeholder="Digite o nome"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="salarioGerente">Salário:</label>
                    <input
                        type="number"
                        id="salarioGerente"
                        value={salarioGerente}
                        onChange={trataSalarioGerente}
                        placeholder="Digite o salário"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="departamentoGerente">Departamento:</label>
                    <input
                        type="text"
                        id="departamentoGerente"
                        value={departamentoGerente}
                        onChange={trataDepartamentoGerente}
                        placeholder="Digite o departamento"
                        required
                    />
                </div>
                <button type="submit" className="gerente-botao">Cadastrar Gerente</button>
            </form>

            <h2 className="gerente-titulo" style={{fontSize: "1.5rem"}}>Gerentes Cadastrados</h2>
            {loading ? (
                <p>Carregando...</p>
            ) : gerentes.length === 0 ? (
                <p>Nenhum gerente cadastrado ainda.</p>
            ) : (
                gerentes.map(gerente => (
                    <GerenteCard
                        key={gerente.idGerente}
                        gerente={gerente}
                        onExcluir={excluirGerente}
                    />
                ))
            )}
        </div>
    );
}


export default Gerente;

