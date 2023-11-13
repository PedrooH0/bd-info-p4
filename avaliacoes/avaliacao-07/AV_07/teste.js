// Criação de um Banco de Dados e de uma tabela

var sqlite3 = require('sqlite3');
 
var db = new sqlite3.Database('BD_SCA.db');
 
db.serialize(function() {

// Create a table
 db.run("CREATE TABLE IF NOT EXISTS TB_CLIENTES (COD_CLI INTEGER PRIMARY KEY AUTOINCREMENT, END_CLI TEXT, NOME_CLI TEXT)");
 
// Insert data into the table
 db.run("INSERT INTO TB_CLIENTES (END_CLI,NOME_CLI) VALUES ('Rua Espiga Doce 18','Jacinto Pinto')");
 
// Query data from the table
 db.each("SELECT TB_ALUNOS, nome FROM TB_ALUNO", function(err, row) {
    console.log(row.id + ": " + row.nome);
  });
});
 
db.close();
