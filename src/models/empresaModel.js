const database = require("../database/config")

function listar(){
    var instrucaoSql = "SELECT * FROM cadastroEmpresa";
    return database.executar(instrucaoSql);
}

function listarRecentes(){
    var instrucaoSql = `    SELECT idcadastroEmpresa AS idEmpresa, nomeResponsavel, nomeEmpresa, statusCliente, cidade, uf
    FROM cadastroEmpresa LEFT JOIN endereco ON idcadastroEmpresa = fkEmpresa
    order by idEmpresa desc limit 3; `;
    return database.executar(instrucaoSql);
}

module.exports = {
    listar,
    listarRecentes
}