var analiseCargaModel = require("../models/analiseCargaModel");

function valorPadrao(valor, fallback) {
    return valor == null || valor == undefined ? fallback : valor;
}

function formatarDataHora(data) {
    if (!data) {
        return "Sem dados";
    }

    return new Date(data).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function normalizarNivel(valor) {
    var texto = String(valor || "sem-dados").toLowerCase();
    if (texto === "baixo" || texto === "baixa") {
        return "baixo";
    }
    if (texto === "medio" || texto === "médio" || texto === "média" || texto === "media" || texto === "moderada") {
        return "moderado";
    }
    if (texto === "alta") {
        return "alto";
    }
    if (texto === "critica" || texto === "crítica") {
        return "critico";
    }
    return texto;
}

function nivelPorPressao(requisicoes, faixaEsperada) {
    var req = Number(valorPadrao(requisicoes, 0));
    var faixa = Number(valorPadrao(faixaEsperada, 0));

    if (!faixa) {
        return "sem-dados";
    }
    if (req <= faixa) {
        return "baixo";
    }
    if (req <= faixa * 1.2) {
        return "moderado";
    }
    if (req <= faixa * 1.5) {
        return "alto";
    }
    return "critico";
}

function nivelTendencia(percentual) {
    var valor = Number(valorPadrao(percentual, 0));
    if (valor <= 0) {
        return "baixo";
    }
    if (valor <= 20) {
        return "moderado";
    }
    return "alto";
}

function obterServidorId(req, res) {
    var servidorId = Number(req.query.servidorId);
    if (!Number.isFinite(servidorId) || servidorId <= 0) {
        res.status(400).json({
            erro: "Servidor nao informado. Selecione um servidor real da tabela servidor."
        });
        return null;
    }
    return servidorId;
}

function buscarKpis(req, res) {
    var servidorId = obterServidorId(req, res);
    if (servidorId == null) {
        return;
    }

    Promise.all([
        analiseCargaModel.buscarResumoBasico(servidorId),
        analiseCargaModel.buscarMaiorPico(servidorId),
        analiseCargaModel.buscarEventoMaiorPressao(servidorId),
        analiseCargaModel.buscarHorarioCritico(servidorId),
        analiseCargaModel.buscarTendenciaKpi(servidorId)
    ]).then(function (resultados) {
        var resumo = resultados[0][0] || {};
        var pico = resultados[1][0] || {};
        var evento = resultados[2][0] || {};
        var horario = resultados[3][0] || {};
        var tendencia = resultados[4][0] || {};

        var requisicoesMedia = Number(valorPadrao(resumo.mediaRequisicoes, 0));
        var faixaMedia = Number(valorPadrao(resumo.faixaMedia, 0));
        var reqUltimas24h = Number(valorPadrao(resumo.reqUltimas24h, 0));
        var req24hAnteriores = Number(valorPadrao(resumo.req24hAnteriores, 0));
        var crescimento24h = req24hAnteriores > 0
            ? ((reqUltimas24h - req24hAnteriores) / req24hAnteriores) * 100
            : 0;

        var riscoAtual = "Baixo";
        var riscoAtualNivel = "baixo";
        if (!resumo.ultimaAtualizacao) {
            riscoAtual = "Sem dados";
            riscoAtualNivel = "sem-dados";
        } else if (faixaMedia > 0 && requisicoesMedia > faixaMedia * 1.5) {
            riscoAtual = "Crítico";
            riscoAtualNivel = "critico";
        } else if (faixaMedia > 0 && requisicoesMedia > faixaMedia * 1.2) {
            riscoAtual = "Alto";
            riscoAtualNivel = "alto";
        } else if (faixaMedia > 0 && requisicoesMedia > faixaMedia) {
            riscoAtual = "Moderado";
            riscoAtualNivel = "moderado";
        }

        var tendenciaPercentual = Number(valorPadrao(tendencia.tendenciaPercentual, 0));

        var horaCritica = horario.hora != undefined
            ? `${String(horario.hora).padStart(2, "0")}h - ${String(Number(horario.hora) + 2).padStart(2, "0")}h`
            : "--";

        res.status(200).json({
            ultimaAtualizacao: formatarDataHora(resumo.ultimaAtualizacao),
            riscoOperacionalAtual: riscoAtual,
            riscoOperacionalNivel: riscoAtualNivel,
            crescimento24h: Number(crescimento24h.toFixed(1)),
            maiorPicoRequisicoes: Number(valorPadrao(pico.requisicoes_minuto, 0)),
            maiorPicoNivel: normalizarNivel(pico.nivel_risco) !== "sem-dados"
                ? normalizarNivel(pico.nivel_risco)
                : nivelPorPressao(pico.requisicoes_minuto, pico.faixa_esperada),
            maiorPicoDetalhe: pico.data_hora
                ? `${valorPadrao(pico.evento_climatico, "Evento")} - ${formatarDataHora(pico.data_hora)}`
                : "Sem dados",
            eventoMaiorPressao: valorPadrao(evento.evento_climatico, "Sem dados"),
            eventoMaiorPressaoPercentual: Number(valorPadrao(evento.percentualAcima, 0)),
            eventoMaiorPressaoNivel: normalizarNivel(evento.pressaoOperacional),
            horarioCritico: horaCritica,
            tendenciaOperacional: tendenciaPercentual,
            tendenciaNivel: nivelTendencia(tendenciaPercentual),
            cpuMedia: Number(Number(valorPadrao(resumo.cpuMedia, 0)).toFixed(1))
        });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage || erro);
    });
}

function buscarRequisicoesTempo(req, res) {
    var servidorId = obterServidorId(req, res);
    if (servidorId == null) {
        return;
    }

    analiseCargaModel.buscarRequisicoesTempo(servidorId).then(function (resultado) {
        res.status(200).json({
            labels: resultado.map((linha) => linha.label),
            requisicoes: resultado.map((linha) => Number(linha.requisicoes)),
            faixaEsperada: resultado.map((linha) => Number(linha.faixaEsperada)),
            cpuPercentual: resultado.map((linha) => Number(linha.cpuPercentual)),
            eventosPico: resultado.map((linha) => linha.eventoPico || "Sem evento relevante")
        });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage || erro);
    });
}

function buscarEventosAcessos(req, res) {
    var servidorId = obterServidorId(req, res);
    if (servidorId == null) {
        return;
    }

    analiseCargaModel.buscarEventosAcessos(servidorId).then(function (resultado) {
        res.status(200).json({
            labels: resultado.map((linha) => linha.tipo_evento),
            valores: resultado.map((linha) => Number(linha.mediaRequisicoes)),
            totais: resultado.map((linha) => Number(linha.totalRegistros))
        });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage || erro);
    });
}

function buscarHeatmap(req, res) {
    var servidorId = obterServidorId(req, res);
    if (servidorId == null) {
        return;
    }

    analiseCargaModel.buscarHeatmap(servidorId).then(function (resultado) {
        res.status(200).json(resultado.map(function (linha) {
            return {
                diaSemana: Number(linha.diaSemana),
                horaBloco: Number(linha.horaBloco),
                requisicoesMedias: Number(linha.requisicoesMedias),
                faixaEsperada: Number(linha.faixaEsperada),
                intensidade: Number(linha.intensidade),
                classe: `n${Number(linha.intensidade)}`
            };
        }));
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage || erro);
    });
}

function buscarTendencia(req, res) {
    var servidorId = obterServidorId(req, res);
    if (servidorId == null) {
        return;
    }

    analiseCargaModel.buscarTendencia(servidorId).then(function (resultado) {
        res.status(200).json({
            labels: resultado.map((linha) => linha.semana),
            requisicoesMedias: resultado.map((linha) => Number(linha.requisicoesMedias)),
            faixaEsperada: resultado.map((linha) => Number(linha.faixaEsperada)),
            cpuMedio: resultado.map((linha) => Number(linha.cpuMedio))
        });
    }).catch(function (erro) {
        console.log(erro);
        res.status(500).json(erro.sqlMessage || erro);
    });
}

module.exports = {
    buscarKpis,
    buscarRequisicoesTempo,
    buscarEventosAcessos,
    buscarHeatmap,
    buscarTendencia
};
