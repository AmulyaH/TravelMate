const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({
   extended:false
}));

//Display the form
app.get('/',(req,res)=>{
    res.status(200);
    res.set({'Content-Type': 'text/html'});
    res.sendFile('index.html');
    res.end();
});

/*
//Post the form on pressing submit
app.post('/submit', (req,res)=>{
    console.log(req.body);
    res.write('Name:'+req.body.Name+'\n');
    res.write('Email:'+ req.body.Email+'\n');
    res.write('Comment:'+req.body.TextArea+'\n');
    res.end();
});
*/

app.listen(port, ()=>{
    console.log(`Server running at http://localhost:${port}`);
});

