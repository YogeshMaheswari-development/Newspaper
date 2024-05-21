const mysql = require('mysql2');
const moment = require('moment');
require('dotenv').config()
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.My_SQL_PORT
});
function InsertDatatoNewspaper(phone_number){
    db.connect(function(err) {
        if (err) throw err;
        db.query(`
        INSERT INTO defaultdb.phone_numbers(timestamp,phone_number)VALUES(NOW(),'${phone_number}');
        `)
      });
}
function SetRecords(response,path){
  db.connect(function(err) {if (err) throw err;
    db.query(`SELECT COUNT(*) AS total FROM defaultdb.phone_numbers;`,function(err, results){
      if (err) throw err;
 var count = results[0].total;
 db.query('select phone_number FROM defaultdb.phone_numbers',function(err,results){
   if (err) throw err;
   var phone_numberset = new Set();
   results.forEach(function(results){
    var phone_number = results.phone_number
    phone_numberset.add(phone_number);
   })
   db.query(`SELECT * FROM defaultdb.phone_numbers ORDER BY id DESC LIMIT 10;`,function(err,results){
    var LastRecords = [];
    if (err) throw err;
    results.forEach(function(res){
      LastRecords.push({Phone_Number: res.phone_number,Time: moment(res.timestamp).format("DD/MM/YYYY HH:MM")})
    })
    response.render('../views/add-newspaper.ejs',{Total: count,Unique: phone_numberset.size,LastRecords: LastRecords})
  })
 })
    })
  }
);
}
function getPhonenumberstable(){
  db.connect(function(err) {if (err) throw err;
    db.query('SELECT * FROM defaultdb.phone_numbers'
      ,function(err,results){
        if (err){ throw err;}
        var data = results
        const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(obj => Object.values(obj).join(',') + '\n');
    return header + rows.join('');

      }
      
    )
    }
    )
}
module.exports = {InsertDatatoNewspaper,SetRecords,getPhonenumberstable,db}
