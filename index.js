const express = require('express');
const validate  = require('./JS/validate');
const databasejs = require('./JS/database');
const app = express()
const fs = require('fs');
const fastcsv = require('fast-csv');
const port = 3000
app.use(express.static(__dirname + '/CSS'));
app.use(express.urlencoded({extended:true}))
app.get('/', (request, response) => {
   databasejs.SetRecords(response,'./views/add-newspaper.ejs')
});

app.get('/download',(request,response)=>{
  databasejs.db.connect(function(err) {if (err) throw err;
    databasejs.db.query('SELECT * FROM defaultdb.phone_numbers', (err, data) => {
      if (err) throw err;
      maindata = [];
      const ws = fs.createWriteStream('phone_numbers.csv');
      data.forEach(element => {
        maindata.push({timestamp: new Date(element.timestamp).toLocaleString(), phone_number: element.phone_number,id : element.id})
      });
      fastcsv
        .write(maindata, { headers: true })
        .pipe(ws)
        .on('finish', () => {
          response.download('phone_numbers.csv', 'phone_numbers.csv', (err) => {
            if (err) throw err;
            console.log('CSV file downloaded successfully');
            fs.unlinkSync('phone_numbers.csv'); 
          });
        });
    });
  });
});
  
app.post('/add-newspaper',(request, response) => {
    validate.validate(request,response);
});
app.post('/date-range',(request, response) => {
 validate.validateadate(request,response) 
})
app.listen(port, () => {
  console.log(`Newspaper app listening on port ${port}`)
});