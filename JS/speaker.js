const  saymodule  = require('say');
function say(message){
saymodule.speak(`${message}`)  
};
module.exports = {say}
