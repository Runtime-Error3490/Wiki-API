const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Define the Article model
const articleSchema = {
  title: String,
  content: String
};
const Article = mongoose.model("Article", articleSchema);

// Your /articles route handler
app.route('/articles')
  .get( async function (req, res) {
  try {
    const articles = await Article.find({});
    // Send the articles as a JSON response
   res.send(articles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
})
  .post(async function (req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
  
    try {
      await newArticle.save();
      res.send("Successfully added a new article.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  })
  .delete(async function(req,res){
    try{
      await Article.deleteMany({});
      res.send("Successfully deleted the corresponding article.");
    }  
    catch(err){
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  });
  app.route('/articles/:articleTitle')
  .get(async function(req,res){
    try{
      const foundArticle=await Article.findOne({title:req.params.articleTitle});
      res.send(foundArticle);
    }catch(err)
    {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  })
  .put(async function(req,res)
  {
    try{
      await Article.findOneAndUpdate(
        {
          title:req.params.articleTitle
        },
        {
          title:req.body.title,content:req.body.content
        },
        {
         new:true
        }
      );
      res.send("Successfully updated the article.");
    }
    catch(err){
      console.log(err);
      res.status(500).send("Internal server error");
    }
  })
  .patch(async function(req,res){
    try{
      await Article.findOneAndUpdate(
        {
          title:req.params.articleTitle
        },
        {
          $set:req.body//it will automatically see ki kya kya send kiya hai
        }
        )
        res.send(req.body);
    }
    catch(err)
    {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  })
  .delete(async function(req,res){
    try{
      await Article.deleteOne({title:req.params.articleTitle});
      res.send("Successfully deleted the corresponding Item.")
    }
    catch(err)
    {
      console.log(err);
      res.status(500).send("Internal server error");
    }
  });
app.use(express.static("public"));
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
