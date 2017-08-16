var mongodb = require('mongodb');
var exports = module.exports = {};

var MongoClient = mongodb.MongoClient;
var dbUrl = process.env.MONGOLAB_URI;

exports.addTerm = function(termObj, callback){
  MongoClient.connect(dbUrl, (err, db) => {
    if(err) throw err;
    
    db.collection('searchTerms').insert(termObj, (err, data) => {
      if(err) throw err;
      
      db.close();
      callback(null, "inserted!");
    })
  })
}

exports.getTerms = function(callback){
  MongoClient.connect(dbUrl, (err, db) => {
    if(err) throw err;
    
    db.collection('searchTerms').find({
      
    },{
      _id: 0,
      term: 1,
      when: 1
    }).sort({when: -1}).toArray((err, data) => {
      if(err) throw err;
      
      db.close();
      callback(null, data);
    })
  })
}