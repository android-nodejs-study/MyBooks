var mongoose = require('mongoose');
var mongodb_connstr = "mongodb://localhost:27017/mybooks";
var User = null;

function InitiDb(){
	ConnectToDb();
	InitDbSchema();
	InitDbTestData();
}

function ConnectToDb(){
	mongoose.connect(mongodb_connstr);
}

function InitDbSchema(){
   User = mongoose.model('users',{name:String, password:String, state:String});
}

function InitDbTestData(){
	
}