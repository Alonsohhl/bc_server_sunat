
const sql = require('mssql')

const config = {
  user: 'sa',
  password: 'Panam2014',
  server: 'apolo', // You can use 'localhost\\instance' to connect to named instance
  database: 'docs',

  options: {
      encrypt: false, // Use this if you're on Windows Azure
      tdsVersion: '7_1'
  }
}


module.exports = {
    Doc_Info: function  Get_Doc_Info () {

    sql.connect(config).then(pool => {
        // Query
         pool.request()
        .input('input_parameter', sql.VarChar, "F001")
        .query('select [TipDocCod],[VenSer],[VenNroDoc],[VenFec],[VenTip] from ventas where [VenSer]=@input_parameter and [VenNroDoc]=3490')// where Dafijcod = @input_parameter')
        })
        .then(result => {
            console.log(result.recordset[0].VenSer) // first recordset from result.recordsets
            sql.close()
           // return result.recordsets
            return "asd"
            console.dir(result.recordsets)
            //var obj = JSON.parse(result.recordsets);
            var text = '{ "employees" : [' +
            '{ "firstName":"John" , "lastName":"Doe" },' +
            '{ "firstName":"Anna" , "lastName":"Smith" },' +
            '{ "firstName":"Peter" , "lastName":"Jones" } ]}';
            //return JSON.parse(text);
            //return result.recordsets;
          //  return "test";    
        }).catch(err => {
                // ... error checks
                console.dir("Error: " + err)
            })
            
    //res.send({ express: 'Hello From Express' });
    return "asd"
    }
};
sql.on('error', err => {
  console.dir("Error")
  // ... error handler
})

