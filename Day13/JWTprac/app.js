const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/token', (req, res)=>{
    let token = jwt.sign({name:'rakshu'}, 'secretkey');

    res.send(token);
})

app.get('/verify', (req, res)=>{
    let decoded = jwt.decode('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicmFrc2h1IiwiaWF0IjoxNzQwMDQ5OTk5fQ.VhCcshWUxn5Gr1ihuSfwTaEXcu_dgl3ZO7jL-1vvuPQ', 'secretkey');

    res.send(decoded);
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})