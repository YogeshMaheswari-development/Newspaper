const alert = require('./alert');
const Speaker = require('./speaker');
const databasejs = require('./database'); 
const fs = require('fs');
const fastcsv = require('fast-csv')
const moment = require('moment')
const Regex = /^[7-9]\d{9}$/
function validate(request,response){
    if((request.body.phonenum).toString().length==10){
      if(Regex.test(request.body.phonenum)){
        require('./database').InsertDatatoNewspaper(request.body.phonenum);
            response.redirect('/')
      }
           else{
            alert.sendNotification('Error','Please type Valid Phone number');
      Speaker.say('Please type valid Phone number');
      response.redirect('/');
           }
    }
    else{
      alert.sendNotification('Error','Please type Valid Phone number');
      Speaker.say('Please type valid Phone number');
      response.redirect('/');
    }
}
function validateadate(request,response){
  if(moment(request.body.fromdate)){
    const userdate = new Date(`${request.body.fromdate}`);
    const startDate = `${userdate.getFullYear()}-${("0" + (userdate.getMonth()+1) ).slice(-2)}-${userdate.getDate()}`;
const query = `SELECT * FROM defaultdb.phone_numbers WHERE timestamp BETWEEN ? AND now()`;
databasejs.db.query(query, [startDate], (error, data) => {
  if (error) throw error;
      var maindata = [];
      const ws = fs.createWriteStream('phone_numbers2.csv');
      data.forEach(element => {
        maindata.push({timestamp: new Date(element.timestamp).toLocaleString(), phone_number: element.phone_number,id : element.id})
      });
      fastcsv
        .write(maindata, { headers: true })
        .pipe(ws)
        .on('finish', () => {
          response.download('phone_numbers2.csv', 'phone_numbers2.csv', (err) => {
            if (err) throw err;
            console.log('CSV file downloaded successfully');
            fs.unlinkSync('phone_numbers2.csv'); 
          });
        })
});
      response.redirect('/')
  }
  else{
      alert.sendNotification('Error','Please type Valid Date');
      Speaker.say('Please type valid Date');
      response.redirect('/');
  }
}
module.exports = {validate,validateadate}
