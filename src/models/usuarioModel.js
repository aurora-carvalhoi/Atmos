var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT idUsuario, nome, email, fkEmpresa as empresaId, statusUsuario, tipoUsuario FROM usuario WHERE email = '${email}' AND senha = '${senha}';
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

function cadastrarFuncionario(fkEmpresa, idSuperior, nome, email, dataNascimento, cpf, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", fkEmpresa, idSuperior, nome, email, dataNascimento, cpf, senha);

    var instrucaoSql = `
    INSERT INTO usuario(fkEmpresa, fkSuperior, nome, email, dataNascimento, cpf, senha, statusUsuario, tipoUsuario) VALUES ('${fkEmpresa}','${idSuperior}','${nome}','${email}','${dataNascimento}','${cpf}','${senha}','Ativo','Funcionario');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// function listarColaboradores(){
//     var instucaoSql = `select idUsuario, nome, usuario.email, razaoSocial as empresa 
//     from usuario join empresa on fk_empresa = idEmpresa order by idUsuario;`
//     return database.executar(instrucaoSql);
// }

function listarColaboradoresCadastrados() {
    var instrucaoSql = `
    SELECT nome, email, tipoUsuario, setor, statusUsuario
    FROM usuario
    ORDER BY idUsuario desc;
    `;
    return database.executar(instrucaoSql);
}

function cadastrarColaborador(nome, email, papel, equipe, cpf, dataNascimento, idEmpresa, status, senha) {
    var instrucaoSql = `
    INSERT INTO usuario (nome, email, tipoUsuario, setor, cpf, dataNascimento, fkEmpresa, statusUsuario, senha)
     VALUES ( '${nome}', '${email}', '${papel}', '${equipe}', '${cpf}', '${dataNascimento}', '${idEmpresa}', '${status}', '${senha}');
    `;
    return database.executar(instrucaoSql);
}


function listarColaboradoresEmpresa(idEmpresa) {
    var instrucaoSql = `
     SELECT u.idUsuario, u.nome, u.email, u.fkEmpresa as empresaId, u.statusUsuario, u.tipoUsuario, u.dataNascimento, u.cpf, 
        u.documentoIdentificacao, u.dataCadastro, u.dataAtualizacao, u.setor, s.nome as nomeSupevisor, e.razaoSocial AS razaoSocial FROM usuario AS u 
        LEFT JOIN usuario as s on u.fkSuperior = s.idUsuario
        JOIN empresa e on u.fkEmpresa= idEmpresa
    WHERE u.fkEmpresa = ${idEmpresa};
    `
    console.log("Execultando o comando: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function buscarUsuarioPorId(idUsuario) {
    var instrucaoSql = `
     SELECT u.idUsuario, u.nome, u.email, u.fkEmpresa as empresaId, u.statusUsuario, u.tipoUsuario, u.dataNascimento, u.cpf, 
        u.documentoIdentificacao, u.dataCadastro, u.dataAtualizacao, u.setor, s.nome as nomeSupevisor, e.razaoSocial AS razaoSocial FROM usuario AS u 
        LEFT JOIN usuario as s on u.fkSuperior = s.idUsuario
        JOIN empresa e on u.fkEmpresa= idEmpresa
    WHERE u.idUsuario = ${idUsuario};
    `
    console.log("Execultando o comando: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function alterarStatusUsuario(idUsuario, status) {
    var instrucaoSql = `
         UPDATE usuario set statusUsuario = '${status}', dataAtualizacao = CURRENT_TIMESTAMP WHERE idUsuario = ${idUsuario};
    `
    console.log("Execultando o comando: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function alterarDadoPerfil(nome, email, cpf, senha, dataNasc, idUsuario) {
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', email = '${email}', cpf = '${cpf}', dataNascimento = '${dataNasc}', senha = '${senha}', dataAtualizacao = CURRENT_TIMESTAMP WHERE idUsuario = ${idUsuario};
    `
    console.log("Execultando o comando: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

function atualizarDadosContribuidor(nome, email, cpf, dataNasc, tipoAcesso, fkSupervisor, idUsuario) {
    if (fkSupervisor == 'NULL') {
        var instrucaoSql = `
            UPDATE usuario SET nome = '${nome}', email = '${email}', cpf = '${cpf}', dataNascimento = '${dataNasc}', tipoUsuario = '${tipoAcesso}', fkSuperior = ${fkSupervisor}, dataAtualizacao = CURRENT_TIMESTAMP WHERE idUsuario = ${idUsuario};
        `
    } else {
        var instrucaoSql = `
            UPDATE usuario SET nome = '${nome}', email = '${email}', cpf = '${cpf}', dataNascimento = '${dataNasc}', tipoUsuario = '${tipoAcesso}', fkSuperior = '${fkSupervisor}', dataAtualizacao = CURRENT_TIMESTAMP WHERE idUsuario = ${idUsuario};
        `
    }
    console.log("Execultando o comando: \n" + instrucaoSql)
    return database.executar(instrucaoSql)
}

module.exports = {
    autenticar,
    cadastrarFuncionario,
    cadastrar,
    finalizarCadastro,
    // listarColaboradores,
    listarColaboradoresCadastrados,
    cadastrarColaborador,
    listarColaboradoresEmpresa,
    alterarStatusUsuario,
    buscarUsuarioPorId,
    alterarDadoPerfil,
    atualizarDadosContribuidor
};

