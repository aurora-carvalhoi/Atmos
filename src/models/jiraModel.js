const Jira = require("../configs/jiraConfig")
// Aq pega as variaveis de configuração do jira, tipo email e token
// retorna jiraConfig{credenciais separadas} e credenciais em base 64 para o navegador

/*
link da api: https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/#api-rest-api-3-search-get
usa de base a chamadosSemAtribuicao()
complementoUrl = para pegar a função que vc quer acessar, no caso /search/jql onde o jql 
    é o que o jira pede como novo padrão
filtro = serve para aplicar filtro de busca, não pode mais buscar tudo 
    link para ver alguns parametros: https://support.atlassian.com/jira-software-cloud/docs/jql-fields/
campos = só pra buscar oq vc quer apenas, tipo só a descrição ou descricao,prioridade
*/

function testeConexao() {
    // apenas para testar a conexao e as credenciais, tem que retornar alguma coisa 
    var complementoUrl = "/myself"
    return fetch(`${Jira.jiraConfig.baseUrl}${complementoUrl}`, {
        method: "GET",

        headers: {
            "Authorization": `Basic ${Jira.credenciais}`,
            "Accept": "application/json"
        }
    })
}

async function chamadosSemAtribuicao() {
    var complementoUrl = "/search/jql"
    var filtro = `?jql=(assignee IS EMPTY OR assignee = "atmos") AND statusCategory != Done`
    var campos = `&fields=summary,description,priority,status,created`
    var dados = await fetch(`${Jira.jiraConfig.baseUrl}${complementoUrl}${filtro}${campos}`, {
        method: "GET",
        headers: {
            "Authorization": `Basic ${Jira.credenciais}`,
            "Accept": "application/json"
        }
    })
    var resposta = await dados.json();
    return resposta
}

async function buscarTempoResolucao() {
    var complementoUrl = "/search/jql"
    var filtro = `?jql=statusCategory = Done AND resolutiondate >= startOfMonth() AND resolutiondate <= endOfMonth()`
    var campos = `&fields=created,resolutiondate `
    var dados = await fetch(`${Jira.jiraConfig.baseUrl}${complementoUrl}${filtro}${campos}`, {
        method: "GET",
        headers: {
            "Authorization": `Basic ${Jira.credenciais}`,
            "Accept": "application/json"
        }
    })
    var resposta = await dados.json();
    console.log(resposta.issues)
    return resposta
}

async function distribuicaoPorContribuidor() {
    var complementoUrl = "/search/jql"
    var filtro = `?jql=statusCategory != Done AND (assignee IS NOT EMPTY AND assignee != "atmos")`
    var campos = `&fields=assignee`
    var dados = await fetch(`${Jira.jiraConfig.baseUrl}${complementoUrl}${filtro}${campos}`, {
        method: "GET",
        headers: {
            "Authorization": `Basic ${Jira.credenciais}`,
            "Accept": "application/json"
        }
    })
    var resposta = await dados.json();
    console.log(resposta.issues)
    return resposta
}



module.exports = {
    testeConexao,
    chamadosSemAtribuicao,
    buscarTempoResolucao,
    distribuicaoPorContribuidor
};