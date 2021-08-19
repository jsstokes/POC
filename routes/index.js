var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

/*
 * Needed for MongoDB Connection
 */
var mongoUtil = require( './mongoUtils' );
if (process.env.URI) {
  mongoUtil.setUri(process.env.URI);
} else {
  mongoUtil.setUri("mongodb+srv://sstokes:Passw0rd@basedemo.zwtlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
}
if (process.env.DATABASENAME) {
  mongoUtil.setDbName(process.env.DATABASENAME);
} else {
  mongoUtil.setDbName("sample_mflix");
}
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
router.get('/getOne/:id?', async(req, res, next) => {
  // res.render('index', { title: 'Express' });
  // res.send({"got":"Document"});
  var id = req.params.id;
  var query = {}
  if (id) {
    console.log("ID:", id);
    query._id = new ObjectId(id)
  } else {
    console.log("NO PARAMETER");
  }
  var db = mongoUtil.getDb()
  console.time("Calling One");
  var doc = await db.collection("movies").findOne(query);
  console.timeEnd("Calling One");
  res.send(doc);
});



module.exports = router;
