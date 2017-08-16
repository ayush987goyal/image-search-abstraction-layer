var express = require('express');
var app = express();
var myMongo = require('./myMongo');
const GoogleImages = require('google-images');
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/latest/imagesearch", (req, res) => {
  myMongo.getTerms((err, data) => {
    if(err) throw err;
    
    res.send(data);
  })
})

app.get("/imagesearch/:term" ,(req, res) => {
  var term = req.params.term;
  var offset = req.query.offset;
  var date = new Date();
  var termObj = {
    term: term,
    when: date
  };
  
  myMongo.addTerm(termObj, (err, data) => {
    if(err) throw err;
    
    console.log(data);
  });
  
  client.search(term, {page : offset}).then(images => {
    var result = [];
    for(let img of images){
      var obj = {};
      obj["url"] = img["url"];
      obj["snippet"] = img["description"];
      obj["thumbnail"] = img["thumbnail"]["url"];
      obj["context"] = img["parentPage"];
      
      result.push(obj);
    }
    res.send(result);
  })
  // res.end("Done!");
})

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
