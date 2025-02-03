const express = require("express");
const app = express();
const expressSession = require('express-session')
const flash = require('connect-flash')


app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: 'random'
}))

app.use(flash())

app.get('/invalid', (req, res)=>{
    req.flash('error', 'Incorrect Password or Email')
    res.redirect('/error')
})

app.get('/error', (req, res)=>{
    let msg = req.flash('error')
    res.send(msg)
})




// app.get('/create', (req, res)=>{
//     req.session.plus = true
//     res.send('Ho gya')
// })

// app.get('/check', (req, res)=>{
//     console.log(req.session.plus);
    
// })




app.get("/", (req, res) => {
  res.send("Main Page");
});

app.get("/about", (req, res) => {
  res.send("About Page");
});

app.get("/contact", (req, res) => {
  res.send("Contact Page");
});
app.get("*", (req, res) => {
  res.send("OOPS BUDDY, Page not Found");
}); //Always make this at last bcz it matches every condition. If its the first condition to check, then we'll always get redirected here only.

app.listen(3030, () => {
  console.log("Server is running on port $3030");
});
