const jiraConfig = {
    baseUrl: process.env.JIRA_URL,
    email: process.env.JIRA_EMAIL,
    token: process.env.JIRA_TOKEN,
}

const credenciais = Buffer.from(`${jiraConfig.email}:${jiraConfig.token}`).toString('base64')

module.exports = {
    credenciais,
    jiraConfig
}
