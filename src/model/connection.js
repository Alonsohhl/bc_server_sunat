
const sql = require('mssql')
var cdr=require('./cdrcheck')
//var async = require("async");

const config = {
  user: 'sa',
  password: 'Panam2014',
  server: 'APOLO', 
  database: 'DB_Docs',

  options: {
      encrypt: false, // Use this if you're on Windows Azure
      tdsVersion: '7_4'
     // tdsVersion: '7_1' sql 2012
  }
}

function pad_with_zeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

async function  udp_status(var_id,status) {

        await new sql.ConnectionPool(config).connect().then(pool => {
            return pool//.input('id', sql.Int, var_id)
            .query(`UPDATE [DB_Docs].[dbo].[Docs] SET Doc_Est =`+status.statusCode+`, Doc_StatusCode=`+status.statusCode+`, Doc_StatusMsg='`+status.statusMessage+`', Date_check=CURRENT_TIMESTAMP WHERE ID=`+var_id)
        }).then(result => {
            
          //  console.log("Actualizado: "+var_id)
            sql.close();
        //    resolve();
        //   callback("OK");
        // callback(result.recordset);
            
        }).catch(err => {
            //reject();
            console.log("Error Actualizando:"+err)
        })

    //});

}


function setDelay(i) {
    setTimeout(function(){
        console.log("i");
    }, 3000);
  }




module.exports = {
    

    doc_conn: function  getdocdata (callback) {

        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.query`SELECT TOP 50 [ID],[Doc_TipDoc],[Doc_SerDoc],[Doc_Ruc],[Doc_Nro],[Doc_Est],[Doc_FecEmi]FROM [DB_Docs].[dbo].[Docs]
                                WHERE   date_check IS NULL and Doc_TipDoc in(01,07,08)
                                        and ([Doc_Est] is null or [Doc_Est] = 0)
                                        
                                ORDER BY    date_check desc`
        }).then(result => {
        //    console.dir(result)
            sql.close()
            callback(result.recordset);
            
        }).catch(err => {
            
        })

    },

    doc_ins: function  check_data (data_docs,callback) {
    
        var data = [];

         Promise.all(data_docs.map( (element) => {

            var args_p = Promise.resolve(args = {
                rucComprobante: element.Doc_Ruc,
                tipoComprobante: pad_with_zeroes(element.Doc_TipDoc, 2),
                serieComprobante: element.Doc_SerDoc,
                numeroComprobante: element.Doc_Nro,
            });

            args_p.then(cdr.stat_check(args,udp_status,element)
                .then(async function(res){

          
                })
                .catch(function(e) {
                    console.log(e); // "oh, no!"
                    })
            ).catch(function(e) {
                console.log("Error Comprobando"+e); // "oh, no!"
                });
                
             
       


      //      const contents = await fs.readFile(file, 'utf8')
      //      console.log(contents)
          }));

/*
        data_docs.forEach(function(element)  {


            setDelay("i");
/*
  
            var args_p = Promise.resolve(args = {
                rucComprobante: element.Doc_Ruc,
                tipoComprobante: pad_with_zeroes(element.Doc_TipDoc, 2),
                serieComprobante: element.Doc_SerDoc,
                numeroComprobante: element.Doc_Nro,
            });

            await args_p.then(cdr.stat_check(args)
                    .then(async function(res){

                        try {
                            console.log("- 2:" );
                            await udp_status(element.ID,res.status.statusCode,()=>{console.log("uhm")})//.then(()=>{console.log("act fin");})
                        } catch (error) {
                            console.log(error.stack);
                        }
                    })
                    .catch(function(e) {
                        console.log(e); // "oh, no!"
                      })
                );
                
             
        });
        
       
*/

   //      });
    }
}
/*

};
sql.on('error', err => {
  console.dir("Error")
  // ... error handler
})
*/
