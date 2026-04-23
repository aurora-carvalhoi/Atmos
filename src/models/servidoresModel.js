var database = require("../database/config")


function cadastrar(nomeIdentificacao, numeroIdentificacao, sistemaOperacional,enderecoIPV4, fkEmpresa) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeIdentificacao, numeroIdentificacao, sistemaOperacional,enderecoIPV4, fkEmpresa);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        INSERT INTO servidor (fkEmpresa, nomeIdentificacao, numeroIdentificacao, sistemaOperacional,enderecoIPV4) VALUES (${fkEmpresa},'${nomeIdentificacao}','${numeroIdentificacao}','${sistemaOperacional}','${enderecoIPV4}');
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

function listarServidores(){
    var instrucaoSql = "SELECT * FROM servidor";
    return database.executar(instrucaoSql);
}

function listarServidoresRecentes(){
    var instrucaoSql = `
    SELECT idServidor, nomeIdentificacao, enderecoIPV4, sistemaOperacional
    FROM servidor
    order by idServidor desc limit 3;
    `;
    return database.executar(instrucaoSql);
}

function listarServidoresCadastrados(){
    var instrucaoSql = `
    SELECT idServidor, nomeIdentificacao, enderecoIPV4, sistemaOperacional, razaoSocial
    FROM servidor LEFT JOIN empresa on idEmpresa = fkEmpresa
    order by idServidor desc;
    `;
    return database.executar(instrucaoSql);
}


module.exports = {
    cadastrar,
    cadastrarComponentes,
    listarServidores,
    listarServidoresRecentes,
    listarServidoresCadastrados
};