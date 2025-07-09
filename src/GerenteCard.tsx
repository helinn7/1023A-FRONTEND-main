import React from "react";

interface GerenteCardProps {
    gerente: {
        idGerente: number;
        nomeGerente: string;
        salarioGerente: number;
        departamentoGerente: string;
    };
    onExcluir: (id: number) => void;
}

const GerenteCard: React.FC<GerenteCardProps> = ({ gerente, onExcluir }) => (
    <div style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        margin: "16px 0",
        background: "#fafbfc"
    }}>
        <div>
            <strong>ID:</strong> {gerente.idGerente}
        </div>
        <div>
            <strong>Nome:</strong> {gerente.nomeGerente}
        </div>
        <div>
            <strong>Salário:</strong> R$ {gerente.salarioGerente}
        </div>
        <div>
            <strong>Departamento:</strong> {gerente.departamentoGerente}
        </div>
        <button
            className="gerente-botao"
            style={{ background: "#e74c3c", marginTop: "8px" }}
            onClick={() => onExcluir(gerente.idGerente)}
        >
            Excluir
        </button>
    </div>

);

export default GerenteCard;