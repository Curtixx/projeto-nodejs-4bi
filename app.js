const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
const conexao = mysql.createConnection({host: "localhost", user: "root",
password:"", database: "teste"});
const Filter = require('bad-words');
const filter = new Filter();
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

    let sql = `select * from salas;`;
    let json = { sucess: '', info: [], erro: '' };
    conexao.query(sql,function(err,result,fields){
        json.sucess = true;
        for(x in result){
            json.info.push({
                idsala: result[x].idsalas,
                nome: result[x].nomesalas,
                desc: result[x].descricaosalas,
                id_user: result[x].id_user
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
    let data = new Date();
    let dia = data.getDate().toString().padStart(2,'0');
    let mes = (data.getMonth()+1).toString().padStart(2,'0');
    let ano = data.getFullYear();
    let dia_atual = `${dia}/${mes}/${ano}`
    msg = msg.replace("buceta", "*").replace("merda", "*").replace("porra","*").replace("caralho","*").replace("crl","*").replace("krl","*").replace("filha da puta","*").replace("filho da puta","*").replace("puta","*").replace("arrombado", "*").replace("cuzao", "*").replace("cuzão", "*");
    let values = [msg,id_sala,id_user, nome_user,dia_atual,0];
    let sql = `insert into mensagem values (default,?,?,?,?,?,?)`
    conexao.query(sql,values);
});
app.get("/mostrarMsg", function(req,res){
    let sql = `select textomsg,id_user,nome_user,data,idmensagem from mensagem where id_sala = ${id_sala}`;
    let json2 = { sucess: '', info: [], erro: '' };
    conexao.query(sql,function(err,result,fields){
        json2.sucess = true;
        for(x in result){
            json2.info.push({
                msg: result[x].textomsg,
                iduser: result[x].id_user,
                user: result[x].nome_user,
                data: result[x].data,
                id_msg: result[x].idmensagem
            });
        }
        res.json(json2);
        
    });
});

});
app.post("/pesquisarSala", function(req,res){
    let nome_sala = req.body.txtsala;
    let sql = `select idsalas from salas where nomesalas = '${nome_sala}'`;
    let json = { sucess: '', info: [], erro: '' };
    conexao.query(sql,function(err,result,fields){
        json.sucess = true;
        for(x in result){
            json.info.push({
                id: result[x].idsalas
            });
        }
        res.redirect("/sala/id"+result[0].idsalas);
    });

});
app.get("/curtidas/:idmsg",function(req,res){
    let id_msg = req.params.idmsg;

    let sql = `update mensagem set likes = likes+1 where idmensagem = ${id_msg}`;
    conexao.query(sql,function(err,result,fields){
        
    });

});
app.get("/maiscurtidas", function(req,res){
    let sql = `select * from mensagem order by likes desc`
    let json = { sucess: '', info: [], erro: '' };
    conexao.query(sql,function(err,result,fields){
        json.sucess = true;
        for(x in result){
            json.info.push({
                likes: result[x].likes,
                msg: result[x].textomsg,
                user: result[x].nome_user,
                data: result[x].data
            });
        }
        res.json(json);
        
    });
});
app.get("/ranque",function(req,res){
    res.sendFile(__dirname + "/maislikes.html");
});
app.listen(8080);
