const MongoClient = require( 'mongodb' ).MongoClient;
// var uri = "mongodb+srv://sstokes:Passw0rd@basedemo.zwtlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var uri = "mongodb://127.0.0.1:27017?retryWrites=true&w=majority";

var dbName = "test";
var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( this.getUri(),  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db(dbName);
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },

  setDbName: function(newName) {
    dbName = newName;
  },

  getDbName: function() {
    return dbName;
  },
   setUri: function(newUri) {
     uri = newUri;
   }, 
  getUri: function() {
    return uri;
  }
};