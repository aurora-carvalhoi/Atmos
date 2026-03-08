var database = require("../database/config")


function cadastrar(nomeServidor, numeroIdentificacao, sistemaOperacional,enderecoIP, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeServidor, numeroIdentificacao, sistemaOperacional,enderecoIP, fkEmpresa);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO servidor (fkEmpresa, nome, numeroIdentificacao, sistemaOperacional,enderecoIP) VALUES (${fkEmpresa},'${nomeServidor}','${numeroIdentificacao}','${sistemaOperacional}','${enderecoIP}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cadastrarComponentes(Componentes, fkEmpresa, fkServidor) {

    var promises = [];

    for (var i = 0; i < Componentes.length; i++) {

        var instrucaoSql = `
        INSERT INTO servidor_componentes (fkServidor, fkEmpresa, fkComponente)
        VALUES (${fkServidor}, ${fkEmpresa}, ${Componentes[i]});
        `;

        promises.push(database.executar(instrucaoSql));
    }

    return Promise.all(promises);
}


module.exports = {
    cadastrar,
    cadastrarComponentes
};