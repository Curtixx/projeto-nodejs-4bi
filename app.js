const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const conexao = mysql.createConnection({host: "localhost", user: "root",
password:"", database: "teste"});
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.json());
let id_user = 0;
let id_sala =0;
let nome_user = "";

app.get("/forms", function(req,res){
    res.sendFile(__dirname + "/login.html");
});
app.post("/verificacao", function(req,res){
    let nome = req.body.txtNome;
    let user = req.body.txtUser;
    let email = req.body.txtEmail;
    let senha = req.body.txtSenha;
    
    let values = [nome, user, email, senha];
    let sql = `insert into login values (default,?,?,?,?);`;
    conexao.query(sql,values);
});
app.get("/cadastro", function(req,res){
    res.sendFile(__dirname + "/cadastro.html");
});
app.post("/verificacaoLogin", function(req,res){
    let userLog = req.body.txtUser;
    let senhaLog = req.body.txtSenha;
    let sqlLog = `select id,user,senha from login where user = '${userLog}'; `;
    conexao.query(sqlLog,function(err,result,fields){
        
        if(result.length != 1){
            res.sendFile(__dirname + "/cadastro.html");
        }
        else if(result != []){
            let sqlT = `select senha from login where user = '${userLog}'; `;
            conexao.query(sqlT,function(err,result,fields){
        
            });
            if (senhaLog != result[0].senha){  
                
                res.sendFile(__dirname + "/login.html");
                
            }
            else if(senhaLog == result[0].senha){
                id_user = result[0].id;
                nome_user = result[0].user;
                res.sendFile(__dirname + "/salas.html");
            } 
                
        }
    });
app.post("/criarSala", function(req,res){
    let nomeSala = req.body.txtNomeSala;
    let descricaoSala = req.body.txtDesc;
    let vaues = [nomeSala, descricaoSala, id_user];
    let sql = "insert into salas values (default, ?,?,?);";
    conexao.query(sql, vaues);
    
    
});

app.get("/sala", function(req,res){

    let sql = `select * from salas_op;`;
    let json = { sucess: '', info: [], erro: '' };
    conexao.query(sql,function(err,result,fields){
        json.sucess = true;
        for(x in result){
            json.info.push({
                id: result[x].id,
                titulo: result[x].sala,
                tema: result[x].tema,
                descript: result[x].desc
            });
        }
        res.json(json);
    });
    
});
app.get("/sala/id:id", function(req,res){
    id_sala = req.params.id;
    res.sendFile(__dirname + "/msg.html");
});
app.get("/menssagens", function(req,res){
    let msg = req.query.txtMsg;
    let values = [msg,id_sala,id_user, nome_user];
    let sql = `insert into mensagem values (default,?,?,?,?)`
    conexao.query(sql,values);
});
app.get("/mostrarMsg", function(req,res){
    let sql = `select textomsg,id_user,nome_user from mensagem where id_sala = ${id_sala}`;
    let json2 = { sucess: '', info: [], erro: '' };
    conexao.query(sql,function(err,result,fields){
        json2.sucess = true;
        for(x in result){
            json2.info.push({
                msg: result[x].textomsg,
                iduser: result[x].id_user,
                user: result[x].nome_user
            });
        }
        res.json(json2);
        
    });
});

});
app.listen(8080);
