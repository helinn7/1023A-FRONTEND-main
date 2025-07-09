
import mysql from 'mysql2/promise';
import fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';

const app = fastify();

await app.register(cors, { origin: true });

// Interface para tipar os dados do usuário
interface Usuario {
  id?: string; 
  nome: string;
  sobrenome: string;
  cidade: string;
}

// Rota para verificar se o servidor está funcionando 
app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
  reply.send("Fastify Funcionando!");
});

// Rota para salvar dados do formulário de pessoa
app.post('/usuarios', async (request: FastifyRequest<{ Body: Usuario }>, reply: FastifyReply) => {
  const {id, nome, sobrenome, cidade } = request.body;

  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });

    // Inserir na tabela usuarios
    await conn.query(
      "INSERT INTO usuarios (id, nome, sobrenome, cidade) VALUES (?, ?, ?, ?)",
      [id, nome, sobrenome, cidade]
    );

    await conn.end();
    reply.status(200).send({ mensagem: "Usuário cadastrado com sucesso!" });
  } catch (erro: any) {
    console.log(`❌ Deu erro! :` + erro);
    if (erro.code === "ECONNREFUSED") {
      console.log("❌ ERRO: LIGUE O LARAGON => Conexão recusada");
      reply.status(400).send({ mensagem: "❌ ERRO: LIGUE O LARAGON => Conexão recusada" });
    } else if (erro.code === 'ER_BAD_DB_ERROR') {
      console.log("❌ ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO => Conexão não encontrada");
      reply.status(400).send({ mensagem: "❌ ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO => Conexão não encontrada" });
    } else if (erro.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log("❌ ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO => Conexão não encontrada");
      reply.status(400).send({ mensagem: "❌ ERRO: CONFERIR O USUÁRIO E SENHA DEFINIDOS NA CONEXÃO => Conexão não encontrada" });
    } else if (erro.code === 'ER_NO_SUCH_TABLE') {
      console.log("❌ ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY");
      reply.status(400).send({ mensagem: "❌ ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY" });
    } else if (erro.code === 'ER_PARSE_ERROR') {
      console.log("❌ ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS");
      reply.status(400).send({ mensagem: "❌ ERRO: Você tem um erro de escrita em sua QUERY confira: VÍRGULAS, PARENTESES E NOME DE COLUNAS" });
    } else if (erro.code === 'ER_DUP_ENTRY') {
      console.log("Usuário já existente");
      reply.status(400).send({ mensagem: "Usuário já existente" });
    } else if (erro.code === 'ER_BAD_FIELD_ERROR') {
      console.log("❌ ERRO: Você tem um erro na busca por um campo que não existe");
      reply.status(400).send({ mensagem: "❌ ERRO: Você tem um erro na busca por um campo que não existe" });
    } else {
      console.log(erro);
      reply.status(400).send({ mensagem: "❌ ERRO: Não identificado" });
    }
  }
});

// Rota para buscar usuários cadastrados
app.get('/usuarios', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });

    // Consultar todos os usuários na tabela "usuarios"
    const [rows] = await conn.query("SELECT id, nome, sobrenome, cidade FROM usuarios");
    await conn.end();

    reply.status(200).send(rows);
  } catch (erro: any) {
    console.log(`❌ Deu erro! :` + erro);
    if (erro.code === "ECONNREFUSED") {
      reply.status(400).send({ mensagem: "❌ ERRO: LIGUE O LARAGON => Conexão recusada" });
    } else if (erro.code === 'ER_BAD_DB_ERROR') {
      reply.status(400).send({ mensagem: "❌ ERRO: CRIE UM BANCO DE DADOS COM O NOME DEFINIDO NA CONEXÃO => Conexão não encontrada" });
    } else if (erro.code === 'ER_NO_SUCH_TABLE') {
      reply.status(400).send({ mensagem: "❌ ERRO: Você deve criar a tabela com o mesmo nome da sua QUERY" });
    } else {
      reply.status(400).send({ mensagem: "❌ ERRO: Não identificado" });
    }
  }
});

// Interface para tipar os dados do funcionário
type Funcionario = {
  idFuncionario?: number;
  nomeFuncionario: string;
  salarioFuncionario: number;
  cargoFuncionario: string;
};

// Rota para cadastrar funcionário
app.post('/funcionarios', async (request: FastifyRequest<{ Body: Funcionario }>, reply: FastifyReply) => {
  const { idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario } = request.body;
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    let result: any;
    if (idFuncionario) {
      result = await conn.query(
        "INSERT INTO funcionarios (idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario) VALUES (?, ?, ?, ?)",
        [idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario]
      );
    } else {
      result = await conn.query(
        "INSERT INTO funcionarios (idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario) VALUES (?, ?, ?, ?)",
        [idFuncionario, nomeFuncionario, salarioFuncionario, cargoFuncionario]
      );
    }
    // Retorna o funcionário criado (com id)
    const insertedId = idFuncionario ? idFuncionario : result[0].insertId;
    const [rows]: any = await conn.query("SELECT * FROM funcionarios WHERE idFuncionario = ?", [insertedId]);
    await conn.end();
    reply.status(201).send(rows[0]);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar funcionário." });
  }
});

// Rota para listar funcionários
app.get('/funcionarios', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    const [rows] = await conn.query("SELECT * FROM funcionarios");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar funcionários." });
  }
});

// Rota para excluir funcionário
app.delete('/funcionarios/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    await conn.query("DELETE FROM funcionarios WHERE idFuncionario = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Funcionário excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir funcionário." });
  }
});

// Interface para tipar os dados do gerente
type Gerente = {
  idGerente?: number;
  nomeGerente: string;
  salarioGerente: number;
  departamentoGerente: string;
};

// Rota para cadastrar gerente
app.post('/gerente', async (request: FastifyRequest<{ Body: Gerente }>, reply: FastifyReply) => {
  const { idGerente, nomeGerente, salarioGerente, departamentoGerente } = request.body;
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    let result: any;
    if (idGerente) {
      result = await conn.query(
        "INSERT INTO gerente (idGerente, nomeGerente, salarioGerente, departamentoGerente) VALUES (?, ?, ?, ?)",
        [idGerente, nomeGerente, salarioGerente, departamentoGerente]
      );
    } else {
      result = await conn.query(
        "INSERT INTO gerente (idGerente, nomeGerente, salarioGerente, departamentoGerente) VALUES (?, ?, ?, ?)",
        [idGerente, nomeGerente, salarioGerente, departamentoGerente]
      );
    }
    // Retorna o gerente criado (com id)
    const insertedId = idGerente ? idGerente : result[0].insertId;
    const [rows]: any = await conn.query("SELECT * FROM gerente WHERE idGerente = ?", [insertedId]);
    await conn.end();
    reply.status(201).send(rows[0]);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar gerente." });
  }
});

// Rota para listar gerentes
app.get('/gerente', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    const [rows] = await conn.query("SELECT * FROM gerente");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar gerentes." });
  }
});

// Rota para excluir gerente
app.delete('/gerente/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    await conn.query("DELETE FROM gerente WHERE idGerente = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Gerente excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir gerente." });
  }
});

// Iniciar o servidor
app.listen({ port: 8000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});

// Interface para tipar os dados do secretário
type Secretario = {
  idSecretario?: number;
  nomeSecretario: string;
  salarioSecretario: number;
  setorSecretario: string;
};

// Rota para cadastrar secretário
app.post('/secretarios', async (request: FastifyRequest<{ Body: Secretario }>, reply: FastifyReply) => {
  const { idSecretario, nomeSecretario, salarioSecretario, setorSecretario } = request.body;
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    let result: any;
    if (idSecretario) {
      result = await conn.query(
        "INSERT INTO secretarios (idSecretario, nomeSecretario, salarioSecretario, setorSecretario) VALUES (?, ?, ?, ?)",
        [idSecretario, nomeSecretario, salarioSecretario, setorSecretario]
      );
    } else {
      result = await conn.query(
        "INSERT INTO secretarios (nomeSecretario, salarioSecretario, setorSecretario) VALUES (?, ?, ?)",
        [nomeSecretario, salarioSecretario, setorSecretario]
      );
    }
    const insertedId = idSecretario ? idSecretario : result[0].insertId;
    const [rows]: any = await conn.query("SELECT * FROM secretarios WHERE idSecretario = ?", [insertedId]);
    await conn.end();
    reply.status(201).send(rows[0]);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao cadastrar secretário." });
  }
});

// Rota para listar secretários
app.get('/secretarios', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    const [rows] = await conn.query("SELECT * FROM secretarios");
    await conn.end();
    reply.status(200).send(rows);
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao buscar secretários." });
  }
});

// Rota para excluir secretário
app.delete('/secretarios/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  const { id } = request.params;
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Atividade',
      port: 3306,
    });
    await conn.query("DELETE FROM secretarios WHERE idSecretario = ?", [id]);
    await conn.end();
    reply.status(200).send({ mensagem: "Secretário excluído com sucesso!" });
  } catch (erro: any) {
    reply.status(400).send({ mensagem: "Erro ao excluir secretário." });
  }
});

