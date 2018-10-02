var soap = require('soap');
var url = 'https://e-factura.sunat.gob.pe/ol-it-wsconscpegem/billConsultService?wsdl';
var options = {
    hasNonce: false,

    //   actor: 'actor'
};
var wsSecurity = new soap.WSSecurity('20100189942PANAM006', 'GO89AL84', options)
var xml = wsSecurity.toXML();

var args = {
    rucComprobante: "20100189942",
    tipoComprobante: "01",
    serieComprobante: "F001",
    numeroComprobante: "00004611"
};
var args2;


var soapHeader = {
    "Username": "foo",
    "Password": "bar"
};

var var_wsdlOptions = {
    attributesKey: 'theAttrs',
    valueKey: 'theVal',
    xmlKey: 'theXml'
};

function status_check(args, callback) {
    
    soap.createClient(url,
        {
            "envelopeKey": 'soapenv',
            wsdlOptions: var_wsdlOptions,
        }
        , function (err, client) {
            try {

                client.setSecurity(wsSecurity);
                client.addBodyAttribute
                client.getStatus(

                    args
                    , function (err, result) {
                        console.log(result.status.statusMessage);
                        callback(result.status);
                    }, {
                        postProcess: function (_xml) {
                            return _xml.replace('xmlns:tns="http://service.sunat.gob.pe', 'xmlns:ser="http://service.sunat.gob.pe')
                                .replace('getStatus', 'ser:getStatus')
                                .replace('/getStatus', '/ser:getStatus');
                        }
                    }
                );
            } catch (err) {
                console.log(err);
            }


        });
}
function fill_array(parm_doc, callback) {
    console.log("Request Documento: " + parm_doc.fac_ser + "-" + parm_doc.fac_nro);
    args = {
        rucComprobante: parm_doc.fac_ruc,
        tipoComprobante: parm_doc.fac_tip,
        serieComprobante: parm_doc.fac_ser,
        numeroComprobante: parm_doc.fac_nro,
    };
    callback(args);
}
module.exports = {



    Doc_Info: function Get_Cdr(parm_doc, callback) {

        console.log("===============================");
/*
        setTimeout(parm_doc, function () {
            console.log("Request Documento: " + parm_doc.fac_ser + "-" + parm_doc.fac_nro);
            args = {
                rucComprobante: parm_doc.fac_ruc,
                tipoComprobante: parm_doc.fac_tip,
                serieComprobante: parm_doc.fac_ser,
                numeroComprobante: parm_doc.fac_nro,
            };

            setTimeout(function () {
                console.log("Conectando con Sunat...");
                soap.createClient(url,
                    {
                        "envelopeKey": 'soapenv',
                        wsdlOptions: var_wsdlOptions,
                    }
                    , function (err, client) {
                        try {

                            client.setSecurity(wsSecurity);
                            client.addBodyAttribute
                            client.getStatus(

                                args
                                , function (err, result) {
                                    console.log(result.status.statusMessage);
                                    callback(result.status);
                                }, {
                                    postProcess: function (_xml) {
                                        return _xml.replace('xmlns:tns="http://service.sunat.gob.pe', 'xmlns:ser="http://service.sunat.gob.pe')
                                            .replace('getStatus', 'ser:getStatus')
                                            .replace('/getStatus', '/ser:getStatus');
                                    }
                                }
                            );
                        } catch (err) {
                            console.log(err);
                        }


                    });
            }, 100);
        }, 200);


*/

    },

    Doc_check: function check_cdr(parm_doc, callback) { //funcion

        console.log("===============================");

        var promise = new Promise(function (resolve, reject) {
            console.log("Request Doc: " + parm_doc.fac_ser + "-" + parm_doc.fac_nro);
            resolve(args = {
                rucComprobante: parm_doc.fac_ruc,
                tipoComprobante: parm_doc.fac_tip,
                serieComprobante: parm_doc.fac_ser,
                numeroComprobante: parm_doc.fac_nro,
            });
        });

        promise.then(function (doc) {
            console.log("Request Doc: " + doc.fac_ser + "-" + doc.fac_nro);
            status_check(doc, rex => {
                console.log(rex);
            });
        })



    },
    stat_check:  function status_check(args,udp_status,element) {//revisa el status de la consulta con sunat

        return new Promise(function (resolve, reject) {
            soap.createClientAsync(url).then((client) => {
                client.setSecurity(wsSecurity);
                client.addBodyAttribute
                return client.getStatus(
                    args
                    , async function (err, result) { 
                        console.log("Doc Nro: \t"+args.tipoComprobante+"-"+args.serieComprobante+"-"+args.numeroComprobante+"\t Respuesta Sunat:" + result.status.statusMessage)
                        await udp_status(element.ID,result.status);
                       // falta el reject
                      // conn.udp_status(11909);
                        resolve(result);
                    }, {
                        postProcess: function (_xml) {
                            return _xml.replace('xmlns:tns="http://service.sunat.gob.pe', 'xmlns:ser="http://service.sunat.gob.pe')
                                .replace('getStatus', 'ser:getStatus')
                                .replace('/getStatus', '/ser:getStatus');
                        }
                    }
                )


            }).catch((error)=>console.log("Error Conectando con sunat:\t"+"Doc Nro: \t"+args.tipoComprobante+"-"+args.serieComprobante+"-"+args.numeroComprobante))
            
            ;
            
        })
    }




}

