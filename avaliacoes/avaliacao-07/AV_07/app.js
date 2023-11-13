const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware para analisar o corpo das solicitações como JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conecte-se ao banco de dados SQLite
const db = new sqlite3.Database('SCA.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});


db.run(
    'CREATE TABLE IF NOT EXISTS TB_CLIENTES (ID_CLI INTEGER PRIMARY KEY, NOME_CLI TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_CLIENTES:', err.message);
        } else {
            console.log('Tabela TB_CLIENTES criada com sucesso.');
        }
    }
);


db.run(
    'CREATE TABLE IF NOT EXISTS TB_VENDEDORES (ID_VEND INTEGER PRIMARY KEY, NOME_VEND TEXT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_VENDEDORES:', err.message);
        } else {
            console.log('Tabela TB_VENDEDORES criada com sucesso.');
        }
    }
);


db.run(
    'CREATE TABLE IF NOT EXISTS TB_NOTAS_FISCAIS (ID_NOTAS_FISCAIS INTEGER PRIMARY KEY, VALOR FLOAT, CLI_ID INTEGER, VEND_ID INTEGER, FOREIGN KEY (CLI_ID) REFERENCES TB_CLIENTES (ID_CLI), FOREIGN KEY (VEND_ID) REFERENCES TB_VENDEDORES(ID_VEND))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_NOTAS_FISCAIS criada com sucesso.');
        }
    }
);


db.run(
    'CREATE TABLE IF NOT EXISTS TB_ITENS_NOTAS_FISCAIS (ID_ITENS_NOTAS_FISCAIS INTEGER PRIMARY KEY, QUANTIDADE FLOAT, VALOR_ITEM FLOAT, UNIDADE INT, NOTA_FISCAL_ID INTEGER, PRODUTO_ID INTEGER, FOREIGN KEY (NOTA_FISCAL_ID) REFERENCES TB_NOTAS_FISCAIS(ID_NOTAS_FISCAIS), FOREIGN KEY (PRODUTO_ID) REFERENCES TB_PRODUTOS(ID_PROD))',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_ITENS_NOTAS_FISCAIS:', err.message);
        } else {
            console.log('Tabela TB_ITENS_NOTAS_FISCAIS criada com sucesso.');
        }
    }
);


db.run(
    'CREATE TABLE IF NOT EXISTS TB_PRODUTOS (ID_PROD INTEGER PRIMARY KEY, DESC_PROD TEXT, PRECO_UNITARIO FLOAT)',
    (err) => {
        if (err) {
            console.error('Erro ao criar tabela TB_PRODUTOS:', err.message);
        } else {
            console.log('Tabela TB_PRODUTOS criada com sucesso.');
        }
    }
);

//////////////////////////////////////////////////////////////////

// Rotas para operações CRUD

// Criar um aluno
app.post('/clientes', (req, res) => {
    const { ID_CLI, NOME_CLI } = req.body;
    db.run('INSERT INTO TB_CLIENTES (ID_CLI, NOME_CLI) VALUES (?, ?)', [ID_CLI, NOME_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Cliente criado com sucesso' });
    });
});


app.post('/vendedores', (req, res) => {
    const { ID_VEND, NOME_VEND } = req.body;
    db.run('INSERT INTO TB_VENDEDORES (ID_VEND, NOME_VEND) VALUES (?, ?)', [ID_VEND, NOME_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Vendedor criado com sucesso' });
    });
});


app.post('/notasfiscais', (req, res) => {
    const { ID_NOTAS_FISCAIS, VALOR, CLI_ID, VEND_ID } = req.body;
    db.run('INSERT INTO TB_NOTAS_FISCAIS (ID_NOTAS_FISCAIS, VALOR, CLI_ID, VEND_ID) VALUES (?, ?, ?, ?)', [ID_NOTAS_FISCAIS, VALOR, CLI_ID, VEND_ID], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Nota fiscal criada com sucesso' });
    });
});


app.post('/itensnotasfiscais', (req, res) => {
    const { ID_ITENS_NOTAS_FISCAIS, QUANTIDADE, VALOR_ITEM, UNIDADE, NOTA_FISCAL_ID , PRODUTO_ID } = req.body;
    db.run('INSERT INTO TB_ITENS_NOTAS_FISCAIS (ID_ITENS_NOTAS_FISCAIS, QUANTIDADE, VALOR_ITEM, UNIDADE, NOTA_FISCAL_ID , PRODUTO_ID) VALUES (?, ?, ?, ?, ?, ?)', [ID_ITENS_NOTAS_FISCAIS, QUANTIDADE, VALOR_ITEM, UNIDADE, NOTA_FISCAL_ID , PRODUTO_ID], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Item da nota fiscal criada com sucesso' });
    });
});


app.post('/produtos', (req, res) => {
    const { ID_PROD, DESC_PROD, PRECO_UNITARIO } = req.body;
    db.run('INSERT INTO TB_PRODUTOS (ID_PROD, DESC_PROD, PRECO_UNITARIO) VALUES (?, ?, ?)', [ID_PROD, DESC_PROD, PRECO_UNITARIO], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Produto criado com sucesso' });
    });
});
//////////////////////////////////////////////////////////////////

// Obter todos os alunos
app.get('/clientes', (req, res) => {
    db.all('SELECT * FROM TB_CLIENTES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ clientes: rows });
    });
});


app.get('/vendedores', (req, res) => {
    db.all('SELECT * FROM TB_VENDEDORES', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ vendedores: rows });
    });
});


app.get('/notasfiscais', (req, res) => {
    db.all('SELECT * FROM TB_NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ notasfiscais: rows });
    });
});


app.get('/itensnotasfiscais', (req, res) => {
    db.all('SELECT * FROM TB_ITENS_NOTAS_FISCAIS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ itensnotasfiscais: rows });
    });
});


app.get('/produtos', (req, res) => {
    db.all('SELECT * FROM TB_PRODUTOS', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ produtos: rows });
    });
});
//////////////////////////////////////////////////////////////////

// Obter um aluno por ID
app.get('/clientes/:ID_CLI', (req, res) => {
    const { ID_CLI } = req.params;
    db.get('SELECT * FROM TB_CLIENTES WHERE ID_CLI = ?', [ID_CLI], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Cliente não encontrado' });
            return;
        }
        res.json({ clientes: row });
    });
});


app.get('/vendedores/:ID_VEND', (req, res) => {
    const { ID_CLI } = req.params;
    db.get('SELECT * FROM TB_VENDEDORES WHERE ID_VEND = ?', [ID_VEND], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Vendedor não encontrado' });
            return;
        }
        res.json({ vendedores: row });
    });
});


app.get('/notasfiscais/:ID_NOTAS_FISCAIS', (req, res) => {
    const { ID_NOTAS_FISCAIS } = req.params;
    db.get('SELECT * FROM TB_NOTAS_FISCAIS WHERE ID_NOTAS_FISCAIS = ?', [ID_NOTAS_FISCAIS], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Nota fiscal não encontrada' });
            return;
        }
        res.json({ notasfiscais: row });
    });
});


app.get('/itensnotasfiscais/:ID_ITENS_NOTAS_FISCAIS', (req, res) => {
    const { ID_ITENS_NOTAS_FISCAIS } = req.params;
    db.get('SELECT * FROM TB_ITENS_NOTAS_FISCAIS WHERE ID_ITENS_NOTAS_FISCAIS = ?', [ID_ITENS_NOTAS_FISCAIS], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Item da nota fiscal não encontrado' });
            return;
        }
        res.json({ itensnotasfiscais: row });
    });
});


app.get('/produtos/:ID_PROD', (req, res) => {
    const { ID_PROD } = req.params;
    db.get('SELECT * FROM TB_PRODUTOS WHERE ID_PROD = ?', [ID_PROD], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ message: 'Produto não encontrado' });
            return;
        }
        res.json({ produtos: row });
    });
});
//////////////////////////////////////////////////////////////////

// Atualizar um aluno por ID
app.put('/clientes/:ID_CLI', (req, res) => {
    const { ID_CLI } = req.params;
    const { NOME_CLI } = req.body;
    db.run('UPDATE TB_CLIENTES SET NOME_CLI = ? WHERE ID_CLI = ?', [NOME_CLI, ID_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
});


app.put('/vendedores/:ID_VEND', (req, res) => {
    const { ID_VEND } = req.params;
    const { NOME_VEND } = req.body;
    db.run('UPDATE TB_VENDEDORES SET NOME_VEND = ? WHERE ID_VEND = ?', [NOME_VEND, ID_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor atualizado com sucesso' });
    });
});


app.put('/notasfiscais/:ID', (req, res) => {
    const { ID_NOTAS_FISCAIS } = req.params;
    const { VALOR } = req.body;
    db.run('UPDATE TB_NOTAS_FISCAIS SET VALOR = ? WHERE ID_NOTAS_FISCAIS = ?', [VALOR, ID_NOTAS_FISCAIS], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota fiscal atualizada com sucesso' });
    });
});


app.put('/itensnotasfiscais/:ID_ITENS_NOTAS_FISCAIS', (req, res) => {
    const { ID_ITENS_NOTAS_FISCAIS } = req.params;
    const { QUANTIDADE, VALOR_ITEM, UNIDADE } = req.body;
    db.run('UPDATE TB_ITENS_NOTAS_FISCAIS SET QUANTIDADE = ?, VALOR_ITEM = ?, UNIDADE = ? WHERE ID_ITENS_NOTAS_FISCAIS = ?', [QUANTIDADE, VALOR_ITEM, UNIDADE, ID_ITENS_NOTAS_FISCAIS], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item da nota fiscal atualizado com sucesso' });
    });
});


app.put('/produtos/:ID_PROD', (req, res) => {
    const { ID_PROD } = req.params;
    const { DESC_PROD, PRECO_UNITARIO } = req.body;
    db.run('UPDATE TB_PRODUTOS SET DESC_PROD = ?, PRECO_UNITARIO = ? WHERE ID_PROD = ?', [DESC_PROD, PRECO_UNITARIO, ID_PROD], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    });
});
//////////////////////////////////////////////////////////////////

// Excluir um aluno por ID
app.delete('/clientes/:ID_CLI', (req, res) => {
    const { ID_CLI } = req.params;
    db.run('DELETE FROM TB_CLIENTES WHERE ID_CLI = ?', [ID_CLI], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente excluído com sucesso' });
    });
});


app.delete('/vendedores/:ID_VEND', (req, res) => {
    const { ID_VEND } = req.params;
    db.run('DELETE FROM TB_VENDEDORES WHERE ID_VEND = ?', [ID_VEND], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Vendedor excluído com sucesso' });
    });
});


app.delete('/notasfiscais/:ID', (req, res) => {
    const { ID_NOTAS_FISCAIS } = req.params;
    db.run('DELETE FROM TB_NOTAS_FISCAIS WHERE ID_NOTAS_FISCAIS = ?', [ID_NOTAS_FISCAIS], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Nota fiscal excluída com sucesso' });
    });
});


app.delete('/itensnotasfiscais/:ID_ITENS_NOTAS_FISCAIS', (req, res) => {
    const { ID_ITENS_NOTAS_FISCAIS } = req.params;
    db.run('DELETE FROM TB_ITENS_NOTAS_FISCAIS WHERE ID_ITENS_NOTAS_FISCAIS = ?', [ID_ITENS_NOTAS_FISCAIS], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Item da nota fiscal excluído com sucesso' });
    });
});


app.delete('/produtos/:ID_PROD', (req, res) => {
    const { ID_PROD } = req.params;
    db.run('DELETE FROM TB_PRODUTOS WHERE ID_PROD = ?', [ID_PROD], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto excluído com sucesso' });
    });
});
//////////////////////////////////////////////////////////////////

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});

