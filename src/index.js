//generar zip0> git archive -o latest.zip HEAD
var express = require('express')
var app = express()
var sys=require('sys')
var cdr=require('./model/cdrcheck')
var schedule = require('node-schedule');
var check_sunat = require('./model/connection');
 

let startTime = new Date(Date.now() + 5000);
let endTime = new Date(startTime.getTime() + 5000);

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [new schedule.Range(0, 6)];
rule.hour = [new schedule.Range(16, 17)];
rule.minute = [new schedule.Range(0, 59)];

//var j = schedule.scheduleJob({ start:{hour: 16, minute: 51, dayOfWeek: 3}, end: {hour: 16, minute: 53, dayOfWeek: 3}, rule: '*/1 * * * *' }, function(){
var j = schedule.scheduleJob(rule , function(){
   
  var currentdate = new Date(); 
  var datetime = "Hora : " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  console.log('============> '+ datetime);
    check_sunat.doc_conn(function(result){//obtiene los registros que seran actualizados
    check_sunat.doc_ins(result)//envia esos registros y los consulta con sunat
    
    
  });
});


app.get('/', function (req, res,next) {
 
  cdr.Doc_Info("parm",function(result){
    console.log(result)
    res.send(result);
  });
});

app.get('/sunat',function(req,res,next){
  check_sunat.doc_conn(function(result){//obtiene los registros que seran actualizados
    check_sunat.doc_ins(result)//envia esos registros y los consulta con sunat
    res.send(result);
    
  });
});

app.get('/checkdoc/:fac_ruc/:fac_tip/:fac_ser/:fac_nro', function (req, res,next) {

  var json_doc =  { "fac_ruc":req.params.fac_ruc,
                    "fac_tip":req.params.fac_tip,
                    "fac_ser":req.params.fac_ser,
                    "fac_nro":req.params.fac_nro }                  

  cdr.Doc_Info(json_doc,function(result){
    console.log("Terminado")
    console.log(result);
    res.send(result);
  });
});


app.get('/test', function (req, res,next) {
    res.send(JSON.stringify({ a: 1 ,b:10}, null, 3));

  });
 
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});