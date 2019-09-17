const express = require('express');
const app = express();
app.use(express.static(__dirname + "./static"));
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
var path = require('path');

var session = require('express-session');
app.use(session({
    secret: 'keyboardkitty',
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:6000}
}))
const flash = require('express-flash');
app.use(flash());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/message_mongoose');
mongoose.Promise = global.Promise;

const CommentSchema = new mongoose.Schema({
    name:{type:String},
    comment: {type: String}

},{timestamps:true});

const PostSchema = new mongoose.Schema({
    name:{type:String},
    message: {type: String},
    comments:[]
},{timestamps:true});


const Post = mongoose.model('Post', PostSchema);
const Comment = mongoose.model('Comment', CommentSchema);

app.get('/', function(req, res){
    Post.find({}, function(err, messages){
        if(err){
            console.log("what is the err:", err);
            res.render('index');
        }else{
            res.render('index', {messages: messages});
            console.log("this is message",messages);
        }
    })
   
})

app.post('/processMessage', function(req, res){
    var post = new Post({name: req.body.name, message:req.body.message});
    post.save(function(err){
        if(err){
            res.redirect('/');
        }else{
            res.redirect('/');
        }
    })
    
})


app.post('/processComment/:id', function(req, res){
    var comment = new Comment({name: req.body.name, comment: req.body.comment});
    comment.save(function(err, comments){
        console.log("this is the comment:", comments);
        if(err){
            res.redirect('/');
        }else{
            Post.findOneAndUpdate({_id: req.params.id}, {$push: {comments:comment}},function(err, comments){
                if(err){
                    console.log(err);
                }
                else{
                    res.redirect('/');
                }
            })
        }
    })
    //  .then((result) => {
    //      Post.findOneAndUpdate({_id:req.body.post_id},(err, datas) =>{
    //          if(datas){
    //              console.log("this is for data:", datas)
    //              Post.comments.push(comment);
    //              Post.save();
    //             //  res.json({message: 'comments has been created!'});
    //              res.redirect('/index',{datas: datas});
    //          }
    //      });
    //  }) 
    //  .catch((error) =>{
    //     res.status(500).json({ error });
    //  }); 
})


app.listen(5000, function(err){
    console.log("listenting to the port 5000")
})