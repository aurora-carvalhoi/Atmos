const database = require("../database/config")

function listar(){
    var instrucaoSql = "SELECT * FROM cadastroEmpresa";
    return database.executar(instrucaoSql);
}

module.exports = {
    listar
}