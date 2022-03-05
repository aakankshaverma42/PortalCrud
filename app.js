require('dotenv').config();
const express= require("express");
const app=express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer  = require('multer');
const ejs= require('ejs');
app.set('view engine','ejs');
const PORT = process.env.PORT || 7000;
app.use (express.urlencoded ({extended:true}));
var port=7000;
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "images");
    },
    filename: (req, file, cb) => {
      cb(null, new Date().getTime() + "-" + file.originalname);
    },
  });
  
  const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
mongoose.connect("mongodb://localhost:27017/crud");
const db = mongoose.connection;
db.on('error',function(error){
    console.log('error is :',error);
});
db.once('open',function(){
    console.log('connected to mongodb')
});
//for parsering JSON to js object
app.use(express.json());
app.use(express.static("uploads"));

// Storage

// const uploads = multer({
//     storage : Storage
// }).single('image')



const Schema = new mongoose.Schema({
    Name:String,
    Roll_No:Number,
    Branch:String,
    Hobbies:String,
    image:{
          type: String;
    } 
});
//COLLECTION CREATION
//Here,User is a name of collection,should be of capital letter bcz it acts as a class->k/a pascal convention
const User = new mongoose.model("User",Schema);



app.get("/",function(req,res){
    res.render("home");
})

app.get("/getdetails",function(req,res){
    User.find({},function (err, allDetails){
        if(err){
            console.log(err);
        }else {
            console.log(allDetails);
            res.render("index", { details:allDetails});
        }
    })
});



app.get("/login",(req,res)=>{
    res.sendFile(__dirname + "/form.html");
});

app.post("/",multer({ storage: fileStorage, fileFilter: fileFilter }).single("image"),(req,res) => {
    let nUser = new User({
        Name:req.body.name,
        Roll_No:req.body.number,
        Branch:req.body.branch,
        Hobbies:req.body.hobbies,
        image:req.file.path
            
             
        
    });
    nUser.save();
    res.send("Saved");
});
app.post("/del",function(req,res){
    console.log(req.body)
    User.deleteOne({_id : req.body.submit},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/index")
        }
    })
});

 
app.listen(port,()=>{
    console.log("server listening on port" + port);

});
