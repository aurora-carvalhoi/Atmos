CREATE DATABASE atmos;
USE atmos;

/* ESTRUTURA
 - empresa
    - usuario (auto relacionamento)
    - contato
    - endereco
    - servidor
        - componenteServidor
 - componente
*/

CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nomeResponsavel VARCHAR(50) NOT NULL,
    razaoSocial VARCHAR(50) DEFAULT NULL,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    senha VARCHAR(205) NOT NULL,
    dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    statusEmpresa VARCHAR(20)
);

CREATE TABLE slaEmpresa(
	idSla INT PRIMARY KEY AUTO_INCREMENT,
    tmrHoras INT,
	tmrMinutos INT,
    qtdIncidentes INT,
	fkEmpresa INT NOT NULL,
	CONSTRAINT fkEmpresaSla FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    codigoAcesso VARCHAR(45),
    nome VARCHAR(50),
    email VARCHAR(100) NOT NULL UNIQUE,
    dataNascimento DATE NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(20),
    statusUsuario VARCHAR(25),
    dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipoUsuario CHAR(25),
    setor VARCHAR(50),
    documentoIdentificacao VARCHAR(20),
    fkEmpresa INT NOT NULL,
    fkSuperior INT,
    CONSTRAINT chkStatusUsuario CHECK (statusUsuario IN ('Ativo', 'Inativo')),
    CONSTRAINT chkTipoUsuario CHECK (tipoUsuario IN ('Gestor', 'Funcionario')),
    CONSTRAINT fkCadastroEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    CONSTRAINT fkUsuarioSuperior FOREIGN KEY (fkSuperior) REFERENCES usuario(idUsuario)
);

CREATE TABLE contato (
    idContato INT NOT NULL,
    fkEmpresa INT NOT NULL,
    DDI CHAR(3),
    DDD CHAR(3),
    telefoneFixo CHAR(11),
    telefoneCelular CHAR(11),
    email VARCHAR(100) NOT NULL UNIQUE,
    CONSTRAINT pkContato PRIMARY KEY (idContato, fkEmpresa),
    CONSTRAINT fkContatoEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE endereco (
    idEndereco INT PRIMARY KEY AUTO_INCREMENT,
    cep VARCHAR(14) NOT NULL,
    logradouro VARCHAR(40) NOT NULL,
    numero INT NOT NULL,
    complemento VARCHAR(40),
    bairro VARCHAR(40) NOT NULL,
    cidade VARCHAR(40) NOT NULL,
    uf CHAR(2) NOT NULL,
    fkEmpresa INT NOT NULL UNIQUE,
    CONSTRAINT fkEnderecoEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE servidor (
    idServidor INT NOT NULL AUTO_INCREMENT,
    fkEmpresa INT NOT NULL,
    nomeIdentificacao VARCHAR(45),
    numeroIdentificacao VARCHAR(45),
    sistemaOperacional VARCHAR(45),
    enderecoIPV4 VARCHAR(100) NOT NULL,
    statusServidor VARCHAR(100),
    CONSTRAINT chkStatusServidor CHECK (statusServidor IN ('Ativo', 'Inativo')),
    CONSTRAINT pkServidor PRIMARY KEY (idServidor, fkEmpresa),
    CONSTRAINT fkServidorEmpresa FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

CREATE TABLE componentes (
    idComponente INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45),
    tipo VARCHAR(45),
    medida VARCHAR(45) NOT NULL,
    biblioteca VARCHAR(45) NOT NULL,
    parametro VARCHAR(45)
);

CREATE TABLE servidorComponente (
    fkServidor INT NOT NULL,
    fkEmpresa INT NOT NULL,
    fkComponente INT NOT NULL,
    limiteMin INT,
    limiteMax INT,
    CONSTRAINT pkServidorComponente PRIMARY KEY (fkServidor, fkEmpresa, fkComponente),
    CONSTRAINT fkServidor_servidorComponente FOREIGN KEY (fkServidor) REFERENCES servidor(idServidor),
    CONSTRAINT fkEmpresa_servidorComponente FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    CONSTRAINT fkComponente_servidorComponente FOREIGN KEY (fkComponente) REFERENCES componentes(idComponente)
);

CREATE TABLE funcionarioAtmos (
    idFuncionario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL DEFAULT 'Colaborador',
    statusFuncionario VARCHAR(10) NOT NULL DEFAULT 'Ativo',
    dataCadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chkStatusFuncionario CHECK (statusFuncionario IN ('Ativo', 'Inativo'))
);



-- INSERTS

INSERT INTO funcionarioAtmos (nome, email, senha, cargo) VALUES
('Admin Atmos', 'admin@atmos.io', 'atmos2026', 'Administrador'),
('Suporte Atmos', 'suporte@atmos.io', 'suporte123', 'Suporte');

INSERT INTO empresa (nomeResponsavel, razaoSocial, cnpj, senha, statusEmpresa) VALUES
('Carlos Silva', 'ClimaTech LTDA', '11111111000101', '123456', 'Ativo'),
('Ana Souza', 'MeteoBrasil SA', '22222222000102', '123456', 'Ativo'),
('João Pereira', 'AtmosData LTDA', '33333333000103', '123456', 'Ativo'),
('Fernanda Lima', 'SkyMonitor SA', '44444444000104', '123456', 'Ativo');

INSERT INTO slaEmpresa (tmrHoras, tmrMinutos, qtdIncidentes, fkEmpresa) VALUES
(12, 0, 600, 1),
(8, 0, 120, 2),
(4, 30, 80, 3),
(2, 0, 50, 4);

INSERT INTO usuario (codigoAcesso, nome, email, dataNascimento, cpf, senha, statusUsuario, tipoUsuario, setor, documentoIdentificacao, fkEmpresa, fkSuperior) VALUES
('A1', 'Carlos Silva', 'carlos@climatech.com', '1980-05-10', '11111111111', '12345678', 'Ativo', 'Gestor', 'Infraestrutura', 'RG', 1, NULL),
('A2', 'Lucas Mendes', 'lucas@climatech.com', '1995-03-15', '11111111112', '12345678', 'Ativo', 'Funcionario', 'Infraestrutura', 'RG', 1, 1),
('A3', 'Roberto Dias', 'roberto@climatech.com', '1983-02-12', '11111111113', '123', 'Ativo', 'Gestor', 'Dados', 'RG9', 1, NULL),
('A4', 'Juliana Freitas', 'juliana@climatech.com', '1997-06-22', '11111111114', '123', 'Ativo', 'Funcionario', 'Dados', 'RG10', 1, 1),

('B1', 'Ana Souza', 'ana@meteobrasil.com', '1985-07-20', '22222222221', '123', 'Ativo', 'Gestor', 'Dados', 'RG', 2, NULL),
('B2', 'Marina Costa', 'marina@meteobrasil.com', '1998-09-10', '22222222222', '123', 'Ativo', 'Funcionario', 'Dados', 'RG', 2, 5),

('C1', 'João Pereira', 'joao@atmosdata.com', '1978-01-25', '33333333331', '123', 'Ativo', 'Gestor', 'Infraestrutura', 'RG', 3, NULL),
('C2', 'Pedro Alves', 'pedro@atmosdata.com', '1992-11-05', '33333333332', '123', 'Ativo', 'Funcionario', 'Infraestrutura', 'RG', 3, 7),
('C3', 'Eduardo Martins', 'eduardo@atmosdata.com', '1987-03-03', '33333333333', '123', 'Ativo', 'Gestor', 'Dados', 'RG13', 3, NULL),
('C4', 'Larissa Gomes', 'larissa@atmosdata.com', '2000-10-19', '33333333334', '123', 'Ativo', 'Funcionario', 'Dados', 'RG14', 3, 9),

('D1', 'Fernanda Lima', 'fernanda@skymonitor.com', '1982-04-18', '44444444441', '123', 'Ativo', 'Gestor', 'TI', 'RG', 4, NULL),
('D2', 'Bruno Rocha', 'bruno@skymonitor.com', '1996-12-30', '44444444442', '123', 'Ativo', 'Funcionario', 'TI', 'RG', 4, 11);

INSERT INTO contato (idContato, fkEmpresa, DDI, DDD, telefoneFixo, telefoneCelular, email) VALUES
(1, 1, '+55', '11', '1111111111', '911111111', 'contato@climatech.com'),
(1, 2, '+55', '21', '2222222222', '922222222', 'contato@meteobrasil.com'),
(1, 3, '+55', '31', '3333333333', '933333333', 'contato@atmosdata.com'),
(1, 4, '+55', '41', '4444444444', '944444444', 'contato@skymonitor.com');

INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, uf, fkEmpresa) VALUES
('01001000', 'Rua A', 100, NULL, 'Centro', 'São Paulo', 'SP', 1),
('20040030', 'Av B', 200, 'Sala 2', 'Centro', 'Rio de Janeiro', 'RJ', 2),
('30140071', 'Rua C', 300, NULL, 'Savassi', 'Belo Horizonte', 'MG', 3),
('80010000', 'Av D', 400, 'Andar 4', 'Centro', 'Curitiba', 'PR', 4);

INSERT INTO servidor (fkEmpresa, nomeIdentificacao, numeroIdentificacao, sistemaOperacional, enderecoIPV4, statusServidor) VALUES
(1, 'Server-CL-01', 'CL001', 'Linux', '192.168.1.1', 'Ativo'),
(2, 'Server-MB-01', 'MB001', 'Windows Server', '192.168.2.1', 'Ativo'),
(3, 'Server-AD-01', 'AD001', 'Linux', '192.168.3.1', 'Ativo'),
(4, 'Server-SM-01', 'SM001', 'Linux', '192.168.4.1', 'Ativo');

INSERT INTO componentes (nome, tipo, medida, biblioteca, parametro) VALUES
('cpu', 'processador', 'GHZ', 'psutil', '.cpu'),
('ram', 'armazenamento', 'GB', 'psutil', '.memory'),
('disco', 'armazenamento', 'TB', 'psutil', '.disk');

INSERT INTO servidorComponente (fkServidor, fkEmpresa, fkComponente, limiteMin, limiteMax) VALUES
(1, 1, 1, 10, 90),
(1, 1, 2, 20, 80),
(1, 1, 3, 30, 85),
(2, 2, 1, 10, 90),
(2, 2, 2, 20, 80),
(2, 2, 3, 30, 85),
(3, 3, 1, 10, 90),
(3, 3, 2, 20, 80),
(3, 3, 3, 30, 85),
(4, 4, 1, 10, 90),
(4, 4, 2, 20, 80),
(4, 4, 3, 30, 85);

-- SELECT ALL
SELECT * FROM empresa;
SELECT * FROM usuario;
SELECT * FROM contato;
SELECT * FROM endereco;
SELECT * FROM servidor;
SELECT * FROM componentes;
SELECT * FROM servidorComponente;


/*
      PROJETO
*/
-- INSERTs
/*
INSERT INTO empresa (nomeResponsavel, razaoSocial, cnpj, senha, statusEmpresa) VALUES ();
INSERT INTO usuario (codigoAcesso, nome, email, dataNascimento, cpf, senha, statusUsuario, tipoUsuario, setor, documentoIdetificacao, fkEmpresa, fkSuperior) VALUES ();
INSERT INTO contato (idContato, fkEmpresa, DDI, DDD, telefoneFixo, telefoneCelular, email) VALUES (COALESCE(MAX(idContato), 0) + 1, );
INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, uf, fkEmpresa) VALUES ();
INSERT INTO servidor (fkEmpresa, nomeIdentificacao, numeroIdentificacao, sistemaOperacional, enderecoIPV4, enderecoIPV6, statusServidor) VALUES ();
INSERT INTO componentes (nome, tipo, medida, biblioteca, parametro) VALUES ();
INSERT INTO servidorComponente (fkServidor, fkEmpresa, fkCOmponente, limiteMin, limiteMax) VALUES ();
*/

-- SELECT PROJETO
/*
SELECT nome, email, tipoUsuario, statusUsuario FROM usuario
      ORDER BY idUsuario DESC;
    
SELECT idEmpresa, razaoSocial, nomeResponsavel, 
      cnpj, telefoneFixo, email, statusEmpresa
      FROM empresa LEFT JOIN contato ON idEmpresa = fkEmpresa
            ORDER BY idEmpresa DESC;

SELECT idServidor, nomeIdentificacao, enderecoIPV4, enderecoIPV6, sistemaOperacional, razaoSocial
      FROM servidor LEFT JOIN empresa ON idEmpresa = fkEmpresa
      ORDER BY idServidor DESC;
*/
/*
-- UPDATES SISTEMA


*/

-- AS COISAS QUE EU FIZ DAQUI PRA BAIXO - ANDERSON
 
-- Tabela da dashboard individual: Analise de Carga sob Eventos Climaticos.

CREATE TABLE IF NOT EXISTS analise_carga_climatica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_hora DATETIME NOT NULL,
    servidor_id INT NOT NULL,
    requisicoes_minuto INT NOT NULL,
    cpu_percentual DECIMAL(5,2) NOT NULL,
    evento_climatico VARCHAR(80) NOT NULL,
    tipo_evento VARCHAR(40) NOT NULL,
    temperatura_externa DECIMAL(5,2) NOT NULL,
    precipitacao DECIMAL(7,2) NOT NULL,
    faixa_esperada INT NOT NULL DEFAULT 8000,
    pressao_operacional VARCHAR(20) NOT NULL DEFAULT 'baixa',
    nivel_risco VARCHAR(20) NOT NULL DEFAULT 'baixo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_analise_data_hora (data_hora),
    INDEX idx_analise_servidor (servidor_id),
    INDEX idx_analise_tipo_evento (tipo_evento)
);

-- Massa inicial para demonstracao da dashboard sem depender da captura continua.

INSERT INTO analise_carga_climatica (
    data_hora,
    servidor_id,
    requisicoes_minuto,
    cpu_percentual,
    evento_climatico,
    tipo_evento,
    temperatura_externa,
    precipitacao,
    faixa_esperada,
    pressao_operacional,
    nivel_risco
)
VALUES
('2026-05-01 08:00:00',1,5200,31.4,'Sem evento relevante','sem evento relevante',22.1,0.0,8000,'baixa','baixo'),
('2026-05-02 10:00:00',1,8700,44.2,'Chuva intensa','chuva intensa',20.3,8.4,8000,'moderada','medio'),
('2026-05-03 14:00:00',1,9100,48.5,'Chuva intensa','chuva intensa',19.8,10.2,8000,'moderada','medio'),
('2026-05-04 16:00:00',1,13800,67.1,'Frente fria','frente fria',13.4,2.1,8000,'critica','critico'),
('2026-05-05 18:00:00',1,7600,39.0,'Sem evento relevante','sem evento relevante',21.7,0.0,8000,'baixa','baixo'),
('2026-05-06 12:00:00',1,5100,30.2,'Sem evento relevante','sem evento relevante',23.0,0.0,8000,'baixa','baixo'),
('2026-05-07 14:00:00',1,6800,35.7,'Chuva moderada','chuva intensa',20.8,6.5,8000,'baixa','baixo'),
('2026-05-08 10:00:00',1,14200,71.8,'Tempestade','tempestade',18.2,18.0,8000,'critica','critico'),
('2026-05-09 16:00:00',1,6500,36.8,'Sem evento relevante','sem evento relevante',22.5,0.0,8000,'baixa','baixo'),
('2026-05-10 18:00:00',1,4100,25.3,'Sem evento relevante','sem evento relevante',24.0,0.0,8000,'baixa','baixo'),
('2026-05-11 14:00:00',1,13900,69.4,'Chuva intensa','chuva intensa',19.6,13.7,8000,'critica','critico'),
('2026-05-12 16:00:00',1,12100,61.5,'Chuva intensa','chuva intensa',20.1,11.8,8000,'alta','alto'),
('2026-05-13 12:00:00',1,9300,50.1,'Onda de calor','onda de calor',34.8,0.0,8000,'moderada','medio'),
('2026-05-14 18:00:00',1,5600,33.0,'Sem evento relevante','sem evento relevante',25.4,0.0,8000,'baixa','baixo'),
('2026-05-15 12:00:00',1,9400,49.5,'Onda de calor','onda de calor',35.2,0.0,8000,'moderada','medio'),
('2026-05-16 14:00:00',1,12800,64.4,'Tempestade','tempestade',18.9,21.0,8000,'critica','critico'),
('2026-05-17 16:00:00',1,16467,82.7,'Tempestade','tempestade',18.4,24.8,8000,'critica','critico');

SELECT *
FROM analise_carga_climatica
ORDER BY id DESC;

select * from slaEmpresa;