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
    documentoIdetificacao VARCHAR(20),
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
    enderecoIPV6 VARCHAR(100) NOT NULL,
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

INSERT INTO usuario (codigoAcesso, nome, email, dataNascimento, cpf, senha, statusUsuario, tipoUsuario, setor, documentoIdetificacao, fkEmpresa, fkSuperior) VALUES
('A1', 'Carlos Silva', 'carlos@climatech.com', '1980-05-10', '11111111111', '123', 'Ativo', 'Gestor', 'Infraestrutura', 'RG', 1, NULL),
('A2', 'Lucas Mendes', 'lucas@climatech.com', '1995-03-15', '11111111112', '123', 'Ativo', 'Funcionario', 'Infraestrutura', 'RG', 1, 1),
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

INSERT INTO servidor (fkEmpresa, nomeIdentificacao, numeroIdentificacao, sistemaOperacional, enderecoIPV4, enderecoIPV6, statusServidor) VALUES
(1, 'Server-CL-01', 'CL001', 'Linux', '192.168.1.1', '::1', 'Ativo'),
(2, 'Server-MB-01', 'MB001', 'Windows Server', '192.168.2.1', '::2', 'Ativo'),
(3, 'Server-AD-01', 'AD001', 'Linux', '192.168.3.1', '::3', 'Ativo'),
(4, 'Server-SM-01', 'SM001', 'Linux', '192.168.4.1', '::4', 'Ativo');

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