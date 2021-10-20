var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'db_user',
	password:'password',
	database:'tldb'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;