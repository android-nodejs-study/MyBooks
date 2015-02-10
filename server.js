var queryString = require('querystring');
var connect = require("connect");






var app = connect();

app.use('/user',function UserAction(req,res,next){
  console.log(req.url);
  if(req.url == "/login"){
    if(req.method == "POST"){
      var postBody = '';

      req.on('data',function(chunk){
        postBody += chunk;
      });

      req.on('end',function() {
        var parsedBody = queryString.parse(postBody);
        var username = parsedBody['username'];
        var password = parsedBody['password'];
        AuthenticateUser(username,password,res);
      });
    }  
  }
  else if(req.url == "/register"){
    
  }
  else{
    next();
  }
});

app.use('/',function DemoAction(req,res,next){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('Hello, this is a test');
});

app.listen(20000);

function AuthenticateUser(username,password,res){
      mongoose.model('users').find({name:username},function(err,user){
      if(err){
           SendAuthenticationErrorResponse("SERVER_INTERNAL_ERROR",res);
           return;
      }
      if(user.length > 0){
        if(user[0].password == password){
          SendAuthenticationSuccessResponse(user,res);
        }
        else{
          SendAuthenticationErrorResponse("PASSWORD_NOT_CORRECT",res);
        }
      }
      else{
        SendAuthenticationErrorResponse("USER_NOT_EXISTS",res);
      }
    });
}

function SendAuthenticationSuccessResponse(user,res){
  var responseXml = '<?xml version="1.0" encoding="UTF-8" ?>'
                    + '<Login>'
                    + '<ResultCode>LOGIN_SUCCEED</ResultCode>'
                  + '<User><UserName>'+user.name + '</UserName><State>' + user.state + '</State></User>'
                  + '</Login>';
  res.writeHead(200,{'Content-Length':responseXml.length,'Content-Type':'text/xml'});
  res.end(responseXml);
}

function SendAuthenticationErrorResponse(errorCode,res){
    var responseXml = '<?xml version="1.0" encoding = "UTF-8" ?>'
                    + '<Login>'
                    + '<ResultCode>' + errorCode + '</ResultCode>'
                    + '</Login>';
    res.writeHead(200,{'Content-Length':responseXml.length,'Content-Type':'text/xml'});
    res.end(responseXml);
}
