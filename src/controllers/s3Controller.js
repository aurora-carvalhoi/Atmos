require("dotenv").config();

const csv = require("csv-parser");

const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN
  }
});

let cacheJSON = null;

async function carregarCSV() {
  try {
    console.log("Buscando CSV");
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: "dados_csv/trusted_empresaX (3).csv"
    });
    const response = await s3.send(command);
    const resultados = [];

    return new Promise((resolve, reject) => {
      response.Body
        .pipe(csv())
        .on("data", (data) => {
          resultados.push(data);
        })
        .on("end", () => {
          const hostsMap = {};
          resultados.forEach(registro => {
            const hostId = registro.host_id;
            if (!hostsMap[hostId]) {
              hostsMap[hostId] = {
                host_id: registro.host_id,
                hostname: registro.hostname,
                empresa: registro.empresa,
                metricas: {
                  datahora: [],
                  cpu_percent: [],
                  cpu_percentil_maquina: 0,
                  ram_perc: [],
                  ram_percentil_maquina: 0,
                  disco_porcentagem: [],
                  disco_usado: [],
                  disco_total: [],
                  processos: [],
                  rede_conexoes: []
                }
              };
            }

            const host = hostsMap[hostId];
            host.metricas.datahora.push(
              registro.timestamp
            );
            host.metricas.cpu_percent.push(
              Number(registro.cpu_percent)
            );
            host.metricas.ram_perc.push(
              Number(registro.ram_percent)
            );
            host.metricas.disco_porcentagem.push(
              Number(registro.disco_percent)
            );
            host.metricas.disco_usado.push(
              Number(registro.disco_usado_gb)
            );
            host.metricas.disco_total.push(
              Number(registro.disco_total_gb)
            );
            host.metricas.processos.push(
              Number(registro.processos)
            );
            host.metricas.rede_conexoes.push(
              Number(registro.rede_conexoes)
            );
          });

          const hosts = Object.values(hostsMap);

          hosts.forEach(host => {
            host.metricas.cpu_percentil_maquina =
              host.metricas.cpu_percent[
                host.metricas.cpu_percent.length - 1
              ];
            host.metricas.ram_percentil_maquina =
              host.metricas.ram_perc[
                host.metricas.ram_perc.length - 1
              ];
          });

          cacheJSON = {
            resumo: {
              total_registros: resultados.length,
              hosts_ativos: hosts.length
            },
            hosts
          };

          console.log(
            `CSV Encontrado. ${resultados.length} registros`
          );
          resolve();
        })

        .on("error", (erro) => {
          console.log("Erro ao ler CSV:", erro);
          reject(erro);
        });
    });
  } catch (erro) {
    console.log("Erro ao carregar CSV:", erro);
  }
}

async function buscarCSV(req, res) {
  if (!cacheJSON) {
    return res.status(503).json({
      erro: "Buscando..."
    });
  }
  res.json(cacheJSON);
}

carregarCSV();
setInterval(() => {
  carregarCSV();
}, 1000 * 60 * 20);

module.exports = {
  buscarCSV
};