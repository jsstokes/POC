var express = require('express');
var router = express.Router();

/*
 * Needed for MongoDB Connection
 */
var mongoUtil = require( './mongoUtils' );
mongoUtil.setUri("mongodb+srv://sstokes:Passw0rd@basedemo.zwtlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
mongoUtil.setDbName("sample_mflix");
console.log("MongoDB Connecting to:", mongoUtil.getUri(), " using database:", mongoUtil.getDbName());

mongoUtil.connectToServer( function( err, client ) {
  if (err) console.log(err);
  // start the rest of your app here
} ); 

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send({"hello":"World"});
});

/* GET a document. */
router.get('/getOne', async(req, res, next) => {
  // res.render('index', { title: 'Express' });
  // res.send({"got":"Document"});
  var db = mongoUtil.getDb()
  console.time("Calling One");
  var doc = await db.collection("movies").findOne({});
  console.timeEnd("Calling One");
  res.send(doc);
});



module.exports = router;
