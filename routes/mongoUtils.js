const MongoClient = require( 'mongodb' ).MongoClient;
const uri = "mongodb+srv://sstokes:Passw0rd@basedemo.zwtlz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var _db;

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( uri,  { useNewUrlParser: true }, function( err, client ) {
      _db  = client.db('sample_mflix');
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  }
};