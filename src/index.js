var express = require('express')
var app = express()
var sys=require('sys')
var cdr=require('./model/cdrcheck')


 
app.get('/', function (req, res,next) {
 
  cdr.Doc_Info("parm",function(result){
    console.log(result)
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

  })
 
app.listen(3000)