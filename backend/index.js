const express = require("express");
const mysql = require("mysql");
var cors = require('cors');
const app = express();
const {v4 :uuidv4}=require('uuid');
const session=require('express-session');
const bcrypt = require('bcrypt');
const e = require("express");
const saltrounds=10;
app.use(express.json());
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({
    origin:true
}))
app.set('trust proxy', 1)
app.use(
    session({
        path: "/",
        key:"userId",
        secret:"secretcode",
        resave:true,
        httpOnly:false,
        saveUninitialized:true,
        maxAge : 24*60*60*1000
    })
);
let user = null
const db = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"password",
    database:"flipkart"
})
app.post('/register',(req,res)=>{
    const {email:username,password,gender} = req.body;
    db.query('SELECT * FROM user WHERE username=?;',
    [username],
    (err,result)=>{
        if(err) {
            console.log(err);
        }
        if(result[0]){
            res.send({authenticated:false,msg:'User already exists'});
        }
        else{
            bcrypt.hash(password,saltrounds,
                (err,hash)=>{
                if(err)
                    res.status(500).send('internal server error');
                else{
                    db.query('INSERT INTO user (username, password,id,gender,brand) VALUES(?,?,?,?,NULL);',
                    [username,hash,uuidv4(),gender],
                    (err,result)=>{
                        if(err){ 
                            console.log(err)
                            res.send({authenticated:false,msg:'user already registered'});
                        }
                        else if(result){
                            res.send({authenticated:true,msg:'Success'});
                            req.session.user = username;
                        }
                    });
                }   
            })
        }
        
    })
    // res.send({authenticated:false,msg:'wrong params'})

})
app.post('/login',(req,res)=>{
    const{username,password} = req.body;
    db.query('SELECT * FROM user WHERE username=?;',
    [username],

    (err,result)=>{
        if(err) {
            console.log(err);
        }
        if(result[0]){
            bcrypt.compare(password,result[0].password,(error,response)=>{
                if(response){
                    req.session.user = username;
                    user = username
                    res.send({authenticated:true,msg:'Success' , data : {
                        gender : result[0].gender,
                        brand : result[0].brand
                    }});
                    return;
                }
                else{
                    res.send({authenticated:false,msg:'Incorrect username or password'});
                }
            });
        }
        else{
            res.send({authenticated:false,msg:'Incorrect username or password'});
        }
        
    })
})

app.post('/brand' , (req,res) =>{
    const {brand, username} = req.body
    db.query('UPDATE user SET brand = ? where username = ?',
    [brand , username],
    
    (err,result)=>{
        if(err) {
            console.log(err);
        }
        if(result){
            res.send({authenticated : true , msg : 'brand preferences updates'})
        }
        else{
            res.send({authenticated:false,msg:'unable to update data'});
        }
        
    })
})

app.get('/getUser',(req,res)=>{
    if(user){
        db.query('SELECT username,gender,brand from user where username = ?',
        [user],
        (err,result)=>{
            if(err) {
                console.log(err);
            }
            if(result){
                res.send({authenticated : true , user:{
                    email:user,
                    brand:result[0].brand,
                    gender:result[0].gender
                }})
            }
            else{
                res.send({authenticated:false,msg:'unable to update data'});
            }
            
        }) 
    }
    else res.send({loggedIn:false});
    
})

app.post('/logout',(req,res)=>{
    user = null
    res.send({authenticated:true});
})

const port = 4000;
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})