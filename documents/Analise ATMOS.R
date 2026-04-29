#Os gráficos gerados a partir dos dados reais evidenciam variações constantes no
#uso de CPU, memória e disco, incluindo picos que ultrapassam limites operacionais.
#A visualização desses comportamentos demonstra que, sem dashboards, essas variações 
#não seriam facilmente identificadas, reforçando a necessidade de monitoramento 
#contínuo e definição de alertas


dados <- rbind(Atmos_dadosMonitorados)

dados$tempo <- as.POSIXct(dados$datahora)

# CPU
plot(dados$tempo, dados$cpu_.,
     main="Uso de CPU", xlab="Tempo", ylab="CPU (%)")

abline(h=80, lty=2 , col = "darkorange3", lwd=2)  # alerta
abline(h=90, lty=2, col ="red4", lwd= 2)  # crítico
abline(h=10, lty=2, col ="orange", lwd =2)

legend("topright",
       legend=c("Alerta", "Crítico", "Alerta(Baixo)"),
       col=c("darkorange3", "red4", "orange"),
       lty=1,
       lwd=2)

#MEMORIA RAM
plot(dados$tempo, dados$ram_.,
     main="Uso de Memória", xlab="Tempo", ylab="Memória (%)")

abline(h=75, lty=2 , col = "darkorange3", lwd= 2)  # alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=30, lty=2, col ="orange", lwd= 2)


legend("topright",
       legend=c("Alerta", "Crítico"),
       col=c("darkorange3", "red4"),
       lty=1,
       lwd=2)

# DISCO
plot(dados$tempo, dados$disco_.,
     main="Uso de Disco", xlab="Tempo", ylab="Disco (%)")

abline(h=85, lty=2 , col = "darkorange3", lwd= 2)  # alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=40, lty=2, col ="orange", lwd = 2)


legend("topright",
       legend=c("Alerta", "Crítico"),
       col=c("darkorange3", "red4"),
       lty=1,
       lwd=2)

#PROCESSOS(CPU)
plot(dados$tempo, dados$processos_cpu_.,
     main="Processos (CPU)", xlab="Tempo", ylab="Uso (%)")

abline(h=70, lty=2 , col = "darkorange3", lwd = 2)  # alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=20, lty=2, col ="orange", lwd = 2)


legend("topright",
       legend=c("Alerta", "Crítico", "Alerta(Baixo)"),
       col=c("darkorange3", "red4","orange"),
       lty=1,
       lwd=2)

# PROCESSOS(RAM)
plot(dados$tempo, dados$processos_ram_.,
     main="Processos (RAM)", xlab="Tempo", ylab="Uso (%)")

abline(h=75, lty=2 , col = "darkorange3", lwd = 2)  # alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=30, lty=2, col ="orange", lwd = 2)

legend("topright",
       legend=c("Alerta", "Crítico", "Alerta(Baixo)"),
       col=c("darkorange3", "red4", "orange"),
       lty=1,
       lwd=2)

# REDE (UPLOAD E DOWNLOAD)
plot(dados$tempo, dados$rede_upload_.,
     main="Rede (Upload)", xlab="Tempo", ylab="Uso (%)")

abline(h=80, lty=2 , col = "darkorange3", lwd = 2)  # alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=20, lty=2, col ="orange", lwd = 2)


legend("topright",
       legend="Alerta(Baixo)",
       col="orange",
       lty=1,
       lwd=2)


plot(dados$tempo, dados$rede_download_.,
     main="Rede (Download)", xlab="Tempo", ylab="Uso (%)")

abline(h=80, lty=2 , col = "darkorange3", lwd = 2)  # alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=20, lty=2, col ="orange", lwd = 2)


legend("topright",
       legend="Alerta(Baixo)",
       col="orange",
       lty=1,
       lwd=2)


#CONEXÕES SIMULTÂNEAS
plot(dados$tempo, dados$conexoes_.,
     main="Conexões Simultâneas", xlab="Tempo", ylab="Uso (%)")

abline(h=70, lty=2 , col = "darkorange3", lwd = 2)# alerta
abline(h=90, lty=2, col ="red4", lwd = 2)  # crítico
abline(h=20, lty=2, col ="orange", lwd = 2)


legend("topright",
       legend="Alerta(Baixo)",
       col="orange",
       lty=1,
       lwd=2)

