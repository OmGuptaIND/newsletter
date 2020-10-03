const express = require('express');
const bodyParser=require('body-parser');
const request=require('request');
const https = require('https');



const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));


app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');
})

app.post('/',function(req,res){
  var fname=req.body.fname;
  var lname=req.body.lname
  var email=req.body.email;
  console.log(fname,lname,email);
  var data ={
    members:[
      {
        email_address:email,
        status:'subscribed',
        merge_fields:{
          FNAME:fname,
          LNAME:lname,
        }
      }
    ]
  };
  const jsonData=JSON.stringify(data);

  const url="https://us2.api.mailchimp.com/3.0/lists/328a908442";
  const options={
    method:'POST',
    auth:'ragnar_newsletter:a384d0b327ccbc8ae011ca99f9784dc51-us2',
  }

  const request=https.request(url,options,function(response){
    response.on('data',function(data){
      const jsonData=JSON.parse(data);
      if (jsonData.error_count===0){
        res.sendFile(__dirname+'/success.html');
      }else{
        res.sendFile(__dirname+'/fail.html');
      }
    })
  })

  request.write(jsonData);
  request.end();


})

app.post('/fail.html',function(req,res){
  res.sendFile(__dirname+'/index.html')
})






app.listen(process.env.PORT || 3000,function(){
  console.log("Server Started At port");
})



// API KEY:384d0b327ccbc8ae011ca99f9784dc51-us2
// userId:328a908442
