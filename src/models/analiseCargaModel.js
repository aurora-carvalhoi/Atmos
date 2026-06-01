var database = require("../database/config");

function filtroServidor(servidorId) {
    var id = Number(servidorId);
    return Number.isFinite(id) && id > 0 ? ` WHERE servidor_id = ${id} ` : "";
}

function condicaoServidor(servidorId, alias) {
    var id = Number(servidorId);
    var coluna = alias ? `${alias}.servidor_id` : "servidor_id";
    return Number.isFinite(id) && id > 0 ? ` AND ${coluna} = ${id} ` : "";
}

function buscarResumoBasico(servidorId) {
    var instrucaoSql = `
        SELECT
            MAX(data_hora) AS ultimaAtualizacao,
            AVG(cpu_percentual) AS cpuMedia,
            AVG(requisicoes_minuto) AS mediaRequisicoes,
            AVG(faixa_esperada) AS faixaMedia,
            SUM(CASE WHEN data_hora >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN requisicoes_minuto ELSE 0 END) AS reqUltimas24h,
            SUM(CASE WHEN data_hora >= DATE_SUB(NOW(), INTERVAL 48 HOUR)
                      AND data_hora < DATE_SUB(NOW(), INTERVAL 24 HOUR)
                     THEN requisicoes_minuto ELSE 0 END) AS req24hAnteriores
        FROM analise_carga_climatica
        ${filtroServidor(servidorId)};
    `;
    return database.executar(instrucaoSql);
}

function buscarMaiorPico(servidorId) {
    var instrucaoSql = `
        SELECT
            data_hora,
            requisicoes_minuto,
            faixa_esperada,
            pressao_operacional,
            nivel_risco,
            evento_climatico,
            tipo_evento
        FROM analise_carga_climatica
        ${filtroServidor(servidorId)}
        ORDER BY requisicoes_minuto DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarEventoMaiorPressao(servidorId) {
    var instrucaoSql = `
        SELECT
            evento_climatico,
            tipo_evento,
            ROUND(AVG(((requisicoes_minuto - faixa_esperada) / NULLIF(faixa_esperada, 0)) * 100), 1) AS percentualAcima,
            CASE
                WHEN AVG(requisicoes_minuto) <= AVG(faixa_esperada) THEN 'baixa'
                WHEN AVG(requisicoes_minuto) <= AVG(faixa_esperada) * 1.2 THEN 'moderada'
                WHEN AVG(requisicoes_minuto) <= AVG(faixa_esperada) * 1.5 THEN 'alta'
                ELSE 'critica'
            END AS pressaoOperacional,
            ROUND(AVG(requisicoes_minuto), 0) AS mediaRequisicoes
        FROM analise_carga_climatica
        WHERE tipo_evento <> 'sem evento relevante'
        ${condicaoServidor(servidorId)}
        GROUP BY evento_climatico, tipo_evento
        ORDER BY percentualAcima DESC, mediaRequisicoes DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarHorarioCritico(servidorId) {
    var instrucaoSql = `
        SELECT
            HOUR(data_hora) AS hora,
            COUNT(*) AS ocorrencias
        FROM analise_carga_climatica
        WHERE requisicoes_minuto > faixa_esperada
        ${condicaoServidor(servidorId)}
        GROUP BY HOUR(data_hora)
        ORDER BY ocorrencias DESC, hora
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function buscarTendenciaKpi(servidorId) {
    var where = filtroServidor(servidorId);
    var instrucaoSql = `
        SELECT
            ROUND(
                (
                    (AVG(CASE WHEN data_hora >= DATE_SUB((SELECT MAX(data_hora) FROM analise_carga_climatica ${where}), INTERVAL 7 DAY)
                          THEN requisicoes_minuto END)
                    -
                    AVG(CASE WHEN data_hora < DATE_SUB((SELECT MAX(data_hora) FROM analise_carga_climatica ${where}), INTERVAL 7 DAY)
                          THEN requisicoes_minuto END))
                    /
                    NULLIF(AVG(CASE WHEN data_hora < DATE_SUB((SELECT MAX(data_hora) FROM analise_carga_climatica ${where}), INTERVAL 7 DAY)
                               THEN requisicoes_minuto END), 0)
                ) * 100,
                1
            ) AS tendenciaPercentual
        FROM analise_carga_climatica
        ${where};
    `;
    return database.executar(instrucaoSql);
}

function buscarRequisicoesTempo(servidorId) {
    var where = filtroServidor(servidorId);
    var andServidor = condicaoServidor(servidorId, "pico");
    var instrucaoSql = `
        SELECT
        DATE_FORMAT(dia.dataReferencia, '%d/%m') AS label,
        dia.dataReferencia,
        dia.requisicoes,
        dia.faixaEsperada,
        dia.cpuPercentual,
        pico.evento_climatico AS eventoPico
    FROM (
        SELECT
            DATE(data_hora) AS dataReferencia,
            ROUND(AVG(requisicoes_minuto), 0) AS requisicoes,
            ROUND(AVG(faixa_esperada), 0) AS faixaEsperada,
            ROUND(AVG(cpu_percentual), 1) AS cpuPercentual,
            MAX(requisicoes_minuto) AS maiorRequisicao
        FROM analise_carga_climatica
        WHERE servidor_id = ${servidorId}
        GROUP BY DATE(data_hora)
    ) AS dia
    LEFT JOIN analise_carga_climatica pico
        ON DATE(pico.data_hora) = dia.dataReferencia
        AND pico.requisicoes_minuto = dia.maiorRequisicao
        AND pico.servidor_id = ${servidorId}
    ORDER BY dia.dataReferencia
    LIMIT 30;
    `;
    return database.executar(instrucaoSql);
}

function buscarEventosAcessos(servidorId) {
    var instrucaoSql = `
        SELECT
            tipo_evento,
            ROUND(AVG(requisicoes_minuto), 0) AS mediaRequisicoes,
            COUNT(*) AS totalRegistros
        FROM analise_carga_climatica
        WHERE tipo_evento <> 'sem evento relevante'
        ${condicaoServidor(servidorId)}
        GROUP BY tipo_evento
        ORDER BY mediaRequisicoes DESC;
    `;
    return database.executar(instrucaoSql);
}

function buscarHeatmap(servidorId) {
    var instrucaoSql = `
        SELECT
            WEEKDAY(data_hora) AS diaSemana,
            FLOOR(HOUR(data_hora) / 2) * 2 AS horaBloco,
            ROUND(AVG(requisicoes_minuto), 0) AS requisicoesMedias,
            ROUND(AVG(faixa_esperada), 0) AS faixaEsperada,
            CASE
                WHEN AVG(requisicoes_minuto) <= AVG(faixa_esperada) THEN 1
                WHEN AVG(requisicoes_minuto) <= AVG(faixa_esperada) * 1.2 THEN 2
                WHEN AVG(requisicoes_minuto) <= AVG(faixa_esperada) * 1.5 THEN 4
                ELSE 5
            END AS intensidade
        FROM analise_carga_climatica
        ${filtroServidor(servidorId)}
        GROUP BY WEEKDAY(data_hora), FLOOR(HOUR(data_hora) / 2) * 2
        ORDER BY diaSemana, horaBloco;
    `;
    return database.executar(instrucaoSql);
}

function buscarTendencia(servidorId) {
    var instrucaoSql = `
        SELECT
            CONCAT(
                DATE_FORMAT(DATE_SUB(DATE(data_hora), INTERVAL WEEKDAY(data_hora) DAY), '%d/%m'),
                ' - ',
                DATE_FORMAT(DATE_ADD(DATE_SUB(DATE(data_hora), INTERVAL WEEKDAY(data_hora) DAY), INTERVAL 6 DAY), '%d/%m')
            ) AS semana,
            DATE_SUB(DATE(data_hora), INTERVAL WEEKDAY(data_hora) DAY) AS inicioSemana,
            ROUND(AVG(requisicoes_minuto), 0) AS requisicoesMedias,
            ROUND(AVG(faixa_esperada), 0) AS faixaEsperada,
            ROUND(AVG(cpu_percentual), 1) AS cpuMedio
        FROM analise_carga_climatica
        ${filtroServidor(servidorId)}
        GROUP BY inicioSemana, semana
        ORDER BY inicioSemana
        LIMIT 8;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarResumoBasico,
    buscarMaiorPico,
    buscarEventoMaiorPressao,
    buscarHorarioCritico,
    buscarTendenciaKpi,
    buscarRequisicoesTempo,
    buscarEventosAcessos,
    buscarHeatmap,
    buscarTendencia
};
