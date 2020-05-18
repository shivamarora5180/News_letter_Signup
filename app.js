// jshint esversion:6

const express=require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app=express();
app.use(express.static("public"));//all static in one place
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const firstName= req.body.fName;
  const lastName= req.body.lName;
  const email= req.body.email;

  const data={
    members:[
      {
        email_address: email,
        status:"subscribed",
        merge_fields:{
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData= JSON.stringify(data);

  const url="https://us18.api.mailchimp.com/3.0/lists/d2XXXXX";

  const options={
    method:"POST",
    auth: "shivam24:e4xxxxxxxxxxxxxxxxxxxxxx-us18"
  }


  const request=https.request(url,options,function(response){

    if(response.statusCode===200){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

// tryagain button: redirect to Home page
app.post("/failure",function(){
  res.redirect("/")
})

app.listen(process.env.PORT ||3000,function(){//process.....: to host in the real website
  console.log("Server is running at port 3000");
});

