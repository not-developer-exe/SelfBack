const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  fs.readdir(`./hisab`, (err, files) => {
    if (err) return res.status(500).send("Something went Wrong!!");
    res.render("index", { files: files });
  });
});

app.get("/create", (req, res) => {
  res.render("create");
});

app.post('/update/:filename', (req, res)=>{
    fs.writeFile(`./hisab/${req.params.filename}`, req.body.content, (err)=>{
    if (err) return res.status(500).send("Something went Wrong!!");
    res.redirect('/')
    })
})

app.post("/createhisab", (req, res) => {
  var date = new Date();
  var current = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`;

  fs.writeFile(`./hisab/${current}.txt`, req.body.content, (err) => {
    if (err) return res.status(500).render("error");
    res.redirect("/");
  });
});



app.get('/edit/:filename', (req, res)=>{
    fs.readFile(`./hisab/${req.params.filename}`, 'utf-8', (err, filedata)=>{
    if (err) return res.status(500).render("error");
    res.render("edit", {filedata, filename: req.params.filename})
    
    })
})

app.get('/hisab/:filename', (req, res)=>{
    fs.readFile(`./hisab/${req.params.filename}`,'utf-8', (err, filedata)=>{
    if (err) return res.status(500).render('error');
    res.render('hisab', {filedata, filename: req.params.filename})
    })
})

app.get('/delete/:filename', (req,res)=>{
    fs.unlink(`./hisab/${req.params.filename}`, (err)=>{
        if (err) return res.status(500).render('error');
        res.redirect('/')
    })
})
 
app.get("/error", (req, res) => {
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
