import mysql from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();

// CORS configurado para permitir todos os métodos necessários
await app.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
});

// Interfaces e types

interface Usuario {
  id?: string;
  nome: string;
  sobrenome: string;
  cidade: string;
}

type Funcionario = {
  idFuncionario?: number;
  nomeFuncionario: string;
  salarioFuncionario: number;
  cargoFuncionario: string;
};

type Gerente = {
  idGerente?: number;
  nomeGerente: string;
  salarioGerente: number;
  departamentoGerente: string;
};

type Secretario = {
  idSecretario?: number;
  nomeSecretario: string;
  salarioSecretario: number;
  setorSecretario: string;
};

// Rotas

// Servidor funcionando
app.get('/', async (request, reply) => {
  reply.send("Fastify Funcionando!");
});

// Usuários

app.post('/usuarios', async (request: FastifyRequest<{ Body: Usuario }>, reply) => {
  const { id, nome, sobrenome, cidade } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query("INSERT INTO usuarios (id, nome, sobrenome, cidade) VALUES (?, ?, ?, ?)", [id, nome, sobrenome, cidade]);
    await conn.end();
    reply.status(200).send({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar usuário." });
  }
});

app.get('/usuarios', async (request, reply) => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const [rows] = await conn.query("SELECT * FROM usuarios");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar usuários." });
  }
});

app.put('/usuarios/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: Usuario }>, reply) => {
  const { id } = request.params;
  const { nome, sobrenome, cidade } = request.body;

  // Validação simples dos campos
  if (
    !nome || typeof nome !== 'string' || nome.trim() === '' ||
    !sobrenome || typeof sobrenome !== 'string' || sobrenome.trim() === '' ||
    !cidade || typeof cidade !== 'string' || cidade.trim() === ''
  ) {
    return reply.status(400).send({ mensagem: "Campos 'nome', 'sobrenome' e 'cidade' são obrigatórios e devem ser válidos." });
  }

  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });

    const [result] = await conn.query(
      "UPDATE usuarios SET nome = ?, sobrenome = ?, cidade = ? WHERE id = ?",
      [nome.trim(), sobrenome.trim(), cidade.trim(), id]
    );

    await conn.end();

    reply.status(200).send({ mensagem: "Usuário atualizado com sucesso!" });
  } catch (erro: any) {
    console.error("Erro no PUT /usuarios/:id:", erro);
    reply.status(500).send({ mensagem: "Erro interno ao atualizar usuário." });
  }
});

app.delete('/usuarios/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query("DELETE FROM usuarios WHERE id = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Usuário excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir usuário." });
  }
});

// Funcionários

app.post('/funcionarios', async (request: FastifyRequest<{ Body: Funcionario }>, reply) => {
  const { idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const result: any = await conn.query(
      "INSERT INTO funcionarios (idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario) VALUES (?, ?, ?, ?)",
      [idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario]
    );
    const insertedId = idFuncionario ? idFuncionario : result[0].insertId;
    const [rows]: any = await conn.query("SELECT * FROM funcionarios WHERE idFuncionario = ?", [insertedId]);
    await conn.end();
    reply.status(201).send(rows[0]);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar funcionário." });
  }
});

app.get('/funcionarios', async (request, reply) => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const [rows] = await conn.query("SELECT * FROM funcionarios");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar funcionários." });
  }
});

app.put('/funcionarios/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: Funcionario }>, reply) => {
  const { id } = request.params;
  const { nomeFuncionario, salarioFuncionario, cargoFuncionario } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query(
      "UPDATE funcionarios SET nomeFuncionario = ?, salarioFuncionario = ?, cargoFuncionario = ? WHERE idFuncionario = ?",
      [nomeFuncionario, salarioFuncionario, cargoFuncionario, id]
    );
    await conn.end();
    reply.status(200).send({ mensagem: "Funcionário atualizado com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao atualizar funcionário." });
  }
});

app.delete('/funcionarios/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query("DELETE FROM funcionarios WHERE idFuncionario = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Funcionário excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir funcionário." });
  }
});

// Gerentes

app.post('/gerente', async (request: FastifyRequest<{ Body: Gerente }>, reply) => {
  const { idGerente, nomeGerente, salarioGerente, departamentoGerente } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const result: any = await conn.query(
      "INSERT INTO gerente (idGerente, nomeGerente, salarioGerente, departamentoGerente) VALUES (?, ?, ?, ?)",
      [idGerente, nomeGerente, salarioGerente, departamentoGerente]
    );
    const insertedId = idGerente ? idGerente : result[0].insertId;
    const [rows]: any = await conn.query("SELECT * FROM gerente WHERE idGerente = ?", [insertedId]);
    await conn.end();
    reply.status(201).send(rows[0]);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar gerente." });
  }
});

app.get('/gerente', async (request, reply) => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const [rows] = await conn.query("SELECT * FROM gerente");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar gerentes." });
  }
});

app.put('/gerente/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: Gerente }>, reply) => {
  const { id } = request.params;
  const { nomeGerente, salarioGerente, departamentoGerente } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query(
      "UPDATE gerente SET nomeGerente = ?, salarioGerente = ?, departamentoGerente = ? WHERE idGerente = ?",
      [nomeGerente, salarioGerente, departamentoGerente, id]
    );
    await conn.end();
    reply.status(200).send({ mensagem: "Gerente atualizado com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao atualizar gerente." });
  }
});

app.delete('/gerente/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query("DELETE FROM gerente WHERE idGerente = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Gerente excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir gerente." });
  }
});

// Secretários

app.post('/secretarios', async (request: FastifyRequest<{ Body: Secretario }>, reply) => {
  const { idSecretario, nomeSecretario, salarioSecretario, setorSecretario } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const result: any = await conn.query(
      "INSERT INTO secretarios (idSecretario, nomeSecretario, salarioSecretario, setorSecretario) VALUES (?, ?, ?, ?)",
      [idSecretario, nomeSecretario, salarioSecretario, setorSecretario]
    );
    const insertedId = idSecretario ? idSecretario : result[0].insertId;
    const [rows]: any = await conn.query("SELECT * FROM secretarios WHERE idSecretario = ?", [insertedId]);
    await conn.end();
    reply.status(201).send(rows[0]);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar secretário." });
  }
});

app.get('/secretarios', async (request, reply) => {
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    const [rows] = await conn.query("SELECT * FROM secretarios");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar secretários." });
  }
});

app.put('/secretarios/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: Secretario }>, reply) => {
  const { id } = request.params;
  const { nomeSecretario, salarioSecretario, setorSecretario } = request.body;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query(
      "UPDATE secretarios SET nomeSecretario = ?, salarioSecretario = ?, setorSecretario = ? WHERE idSecretario = ?",
      [nomeSecretario, salarioSecretario, setorSecretario, id]
    );
    await conn.end();
    reply.status(200).send({ mensagem: "Secretário atualizado com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao atualizar secretário." });
  }
});

app.delete('/secretarios/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({ host: 'localhost', user: 'root', password: '', database: 'Atividade', port: 3306 });
    await conn.query("DELETE FROM secretarios WHERE idSecretario = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Secretário excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir secretário." });
  }
});

// Iniciar servidor
app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em ${address}`);
});
