var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idUsuario, nome, email, fkEmpresa as empresaId FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrar(email, codigo) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, codigo)
    var instrucaoSql = `
        SELECT idUsuario, codigoAcesso, email, fkEmpresa as empresaId FROM usuario WHERE email = '${email}' AND codigoAcesso = '${codigo}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function finalizarCadastro(nome, senha, id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", nome, senha, id)
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', senha = '${senha}'WHERE idUsuario = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql

function cadastrarFuncionario(fkEmpresa, idSuperior ,nome,email,dataNascimento,cpf,senha){
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", fkEmpresa, idSuperior, nome,email, dataNascimento,cpf,senha);

    var instrucaoSql = `
    INSERT INTO usuario(fkEmpresa, fkSuperior, nome, email, dataNascimento, cpf, senha, statusUsuario, tipoUsuario) VALUES ('${fkEmpresa}','${idSuperior}','${nome}','${email}','${dataNascimento}','${cpf}','${senha}','Ativo','Funcionario');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarColaboradores(){
    var instrucaoSql = `
    SELECT * FROM usuario;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarFuncionario,
    cadastrar,
    finalizarCadastro,
    listarColaboradores
};

