const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const { stringify } = require('querystring');
const { title } = require('process');

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
mongoose.connect('mongodb://127.0.0.1/WikiDB',()=>{
    console.log('connected');
});
// mongodb database
const articleSchema = {
    title:String,
    content:String
}
const article = mongoose.model('article',articleSchema);

//routing chain
app.route('/articles')
.get((req,res)=>{
    article.find((err,articlefound)=>{
        if(!err){
            res.send(articlefound);
        }
        else{
            res.send(err);
        }
    })
})
.post((req,res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const newArticle = new article({
        title:title,
        content:content
    })
    newArticle.save((err)=>{
        if(!err){
            res.send('record saved');
        }
        
        else{
            res.send(err);
        }
    })
})
.delete((req,res)=>{
    article.deleteMany((err)=>{
        if(!err){
            res.send('deleted all article');
        }
        else{
            res.send(err);
        }
    })
})

// for a specific article rest apis
app.route('/articles/:articleTitle')
.get((req,res)=>{
    article.findOne({title:req.params.articleTitle},(err,foundArticles)=>{
       if(!err){
          res.send(foundArticles);
       }
       else{
          res.send(err);
       }
    })
})
.put((req,res)=>{
    const title = req.body.title;
    const content = req.body.content;
    article.updateOne({title:req.params.articleTitle},{
        title:title,
        content:content
    },{overwrite:true},(err)=>{
        if(!err){
            res.send('updated successfully');
        }
        else{
            res.send(err);
        }
    })
})
.patch((req,res)=>{
    article.updateOne({title:req.params.articleTitle},{$set:req.body},(err)=>{
        if(!err){
            res.send('successfully updated article');
        }
        else{
            res.send(err);
        }
    })
})
.delete((req,res)=>{
    article.deleteOne({title:req.params.articleTitle},(err)=>{
        if(!err){
            res.send('deleted the article')
        }
        else{
            res.send(err)
        }
    })
})
app.listen(3000,()=>{
    console.log('server started on port 3000');
})

