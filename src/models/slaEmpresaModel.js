var database = require("../database/config")


function alterarTrm(fkEmpresa, tmrH, tmrM) {
    var instrucaoSql = `
        UPDATE slaEmpresa SET tmrHoras = ${tmrH}, tmrMinutos = ${tmrM}
            WHERE fkEmpresa = ${fkEmpresa};        
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function alterarQtdIncidente(fkEmpresa, qtdIncidentes) {
    var instrucaoSql = `
        UPDATE slaEmpresa SET qtdIncidentes = ${qtdIncidentes}
        WHERE fkEmpresa = ${fkEmpresa};       
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarSlaEmpresa(fkEmpresa) {
    var instrucaoSql = `
        SELECT tmrHoras, tmrMinutos, qtdIncidentes
        FROM slaEmpresa
        WHERE fkEmpresa = ${fkEmpresa};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    alterarTrm,
    alterarQtdIncidente,
    buscarSlaEmpresa
}