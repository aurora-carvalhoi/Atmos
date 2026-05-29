const {
  S3Client,
    GetObjectCommand
} = require("@aws-sdk/client-s3");


console.log("Bucket:", process.env.AWS_BUCKET);


const s3 = new S3Client({
    region:
        process.env.AWS_REGION,

    credentials: {
        accessKeyId:
            process.env.AWS_ACCESS_KEY_ID,

        secretAccessKey:
            process.env.AWS_SECRET_ACCESS_KEY,

        sessionToken:
            process.env.AWS_SESSION_TOKEN
    }
});


async function buscarAnalisePreditiva(req, res) {

    try {

        const empresa =
            req.query.empresa;

        const server =
            req.query.server;


        if (!empresa) {

            return res.status(400).json({

                erro:
                    "Empresa não informada"
            });
        }


        if (!server) {

            return res.status(400).json({

                erro:
                    "Servidor não informado"
            });
        }


        const key =
            `client/${empresa}/${server}.json`;


        console.log(
            "Buscando arquivo:",
            key
        );


        const command =
            new GetObjectCommand({

                Bucket:
                    process.env.AWS_BUCKET,

                Key:
                    key
            });


        const response =
            await s3.send(command);


        const jsonString =
            await response.Body.transformToString();


        const dados =
            JSON.parse(jsonString);


        res.json(dados);

    } catch (erro) {

        console.error(
            "Erro ao buscar análise preditiva:",
            erro
        );


        res.status(500).json({

            erro:
                "Erro ao buscar dados do S3",

            detalhe:
                erro.message
        });
    }
}


module.exports = {
    buscarAnalisePreditiva
};