const database = require("../database/config")

function listar(){
    var instrucaoSql = "SELECT * FROM empresa";
    return database.executar(instrucaoSql);
}

function listarRecentes(){
    var instrucaoSql = `    SELECT idEmpresa, nomeResponsavel, razaoSocial, statusEmpresa, cidade, uf
    FROM empresa LEFT JOIN endereco ON idEmpresa = fkEmpresa
    order by idEmpresa desc limit 3; `;
    return database.executar(instrucaoSql);
}

function listarEmpresasCadastradas(){
    var instrucaoSql = `
    SELECT idEmpresa, razaoSocial, nomeResponsavel, cnpj, telefoneCelular, email, statusEmpresa
    FROM empresa LEFT JOIN contato on idEmpresa = fkEmpresa
    order by idEmpresa desc; 
    `;
    return database.executar(instrucaoSql);
}

function cadastrar(nome, responsavel, cnpj, email, telefoneCelular, cep, logradouro, bairro, cidade, uf, numero, status, ddd) {
    var instrucaoSqlEmpresa = `
        INSERT INTO empresa (nomeResponsavel, razaoSocial, cnpj, senha, statusEmpresa) 
        VALUES ('${responsavel}', '${nome}', '${cnpj}', '123456', '${status}');
    `;

    return database.executar(instrucaoSqlEmpresa).then((resultado) => {
        const idEmpresa = resultado.insertId;

        var instrucaoSqlContato = `
            INSERT INTO contato (idContato, fkEmpresa, DDD, telefoneFixo, telefoneCelular, email) 
            VALUES (1, ${idEmpresa}, '${ddd}', 'null', '${telefoneCelular}', '${email}');
        `;

        var instrucaoSqlEndereco = `
            INSERT INTO endereco (cep, logradouro, numero, bairro, cidade, uf, fkEmpresa)
            VALUES ('${cep}', '${logradouro}', ${numero}, '${bairro}', '${cidade}', '${uf}', ${idEmpresa});
        `;

        database.executar(instrucaoSqlContato);
        return database.executar(instrucaoSqlEndereco);
    });
}

module.exports = {
    listar,
    listarRecentes,
    listarEmpresasCadastradas,
    cadastrar
};