var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

/*
 * Needed for MongoDB Connection
 */
var mongoUtil = require( './mongoUtils' );
console.log("ENV URI:", process.env.URI); 
console.log("ENV DATABASENAME:", process.env.DATABASENAME);
console.log("ENV COLLECTION:", process.env.COLLECTION);
if (process.env.URI) {
  mongoUtil.setUri(process.env.URI);
} else {
  console.log("Using default URI");
  mongoUtil.setUri("mongodb+srv://sstokes:Passw0rd@basedemo.zwtlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
}
if (process.env.DATABASENAME) {
  mongoUtil.setDbName(process.env.DATABASENAME);
} else {
  console.log("Using default DATABASENAME");
  mongoUtil.setDbName("sample_mflix");
}

var collectionName = process.env.COLLECTION || "testdata";

console.log("MongoDB Connecting to:", mongoUtil.getUri(), " using database:", mongoUtil.getDbName());
console.log("Collection Name:", collectionName);
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
  var doc = await db.collection(collectionName).findOne(query);
  console.timeEnd("Calling One");
  res.send(doc);
});


router.get('/randomIds', async(req, res, next) => {
  // res.render('index', { title: 'Express' });
  // res.send({"got":"Document"});
  var id = req.params.id;
  var query = [
    {
      '$sample': {
        'size': 3
      }
    }, {
      '$project': {
        '_id': 1
      }
    }
  ]
  // [
  //   {"$sample": {size: 5}},
  //   {"$project": {"_id": 1}}
  // ]
  if (id) {
    console.log("ID:", id);
    query._id = new ObjectId(id)
  } else {
    console.log("NO PARAMETER");
  }
  var db = mongoUtil.getDb()
  console.time("Calling One");
  var doc = await db.collection(collectionName).aggregate(query).toArray();
  console.timeEnd("Calling One");
  res.send(doc);
});

/* GET a document. */
router.get('/getMany', async(req, res, next) => {
  // res.render('index', { title: 'Express' });
  // res.send({"got":"Document"});
  // var id = req.params.ids;
  console.log("IDs from Request Query:", req.query.ids);
  var count = 1;
  var id_array = JSON.parse(req.query.ids.replace(/\'/g,"\""));
  console.log("id_array object is:", id_array);
  var idlist = []
  id_array.forEach( id => {
    console.log("ID[", count, "]:", id);
    count = count  + 1;
    idlist.push(new ObjectId(id));
  });
  var query = {
    "_id": {"$in": idlist}
  }
  // if (id) {
  //   console.log("ID:", id);
  //   query._id = new ObjectId(id)
  // } else {
  //   console.log("NO PARAMETER");
  // }
  var db = mongoUtil.getDb()
  console.time("Calling getMany");
  var docs = await db.collection(collectionName).find(query).toArray();
  // console.timeEnd("Calling One");
  res.send(docs);
});


module.exports = router;
