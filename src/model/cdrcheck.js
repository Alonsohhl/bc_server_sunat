var soap = require('soap');
//var WSSecurity2 = require('wssecurity-soap'); 
var url = 'https://e-factura.sunat.gob.pe/ol-it-wsconscpegem/billConsultService?wsdl';
var options = {
    hasNonce: false,
    
 //   actor: 'actor'
  };
var wsSecurity = new soap.WSSecurity('20100189942PANAM006', 'GO89AL84', options)
var xml = wsSecurity.toXML();

var args={
        rucComprobante      : "20100189942",
        tipoComprobante     : "01",
        serieComprobante    : "F001",
        numeroComprobante   : "00004611"
};
var args2;


            var soapHeader = {
                "Username": "foo",
                "Password" : "bar"
              };

            var var_wsdlOptions = {
                attributesKey: 'theAttrs',
                valueKey: 'theVal',
                xmlKey: 'theXml'
              };

//client.setSecurity(wsSecurity);
/*
soap.createClient( url, {wsdl_options: {
    //cert: fs.readFileSync('cert/certificate.pem'),
    //key: fs.readFileSync('cert/certificate.key')
    },
wsdl_headers: {Authorization: auth} }, function(err, client) {


    client.describe();

});
*/




module.exports = {

    
    
    Doc_Info:  function  Get_Cdr (parm_doc,callback) {
        
        console.log("===============================");
 
        setTimeout(function(){
            console.log("Request Documento: "+parm_doc.fac_ser+"-"+ parm_doc.fac_nro);
            args={
                rucComprobante      : parm_doc.fac_ruc,
                tipoComprobante     : parm_doc.fac_tip,
                serieComprobante    : parm_doc.fac_ser,
                numeroComprobante   :   parm_doc.fac_nro,
            };
            
            setTimeout(function(){
                console.log("Esperando Sunat");
                soap.createClient( url,
                    {
                        "envelopeKey": 'soapenv',
                        wsdlOptions:var_wsdlOptions,
                    }
                    ,function(err, client)
                        {               
                            client.setSecurity(wsSecurity);
                            client.addBodyAttribute
                            client.getStatus(
                                    
                                    args
                                    , function(err, result)
                                    {
                                        console.log(result.status); 
                                        callback(result.status);     
                                    }, {
                                        postProcess: function(_xml) {
                                                return  _xml.replace('xmlns:tns="http://service.sunat.gob.pe', 'xmlns:ser="http://service.sunat.gob.pe')
                                                .replace('getStatus', 'ser:getStatus')
                                                .replace('/getStatus', '/ser:getStatus');  
                                            }
                                        }
                            );
    
                    });
            },100);
        }, 200);

            
            
        
    }
   
    


}

