var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT idFuncionario, nome, email, cargo
        FROM funcionarioAtmos
        WHERE email = '${email}'
          AND senha = '${senha}'
          AND statusFuncionario = 'Ativo';
    `;

    console.log("Executando SQL:\n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = { autenticar };
