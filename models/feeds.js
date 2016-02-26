var rethinkdb = require('rethinkdb');
var db = require('./db');
var pollObject = new db();
module.exports = function(socket) {
  pollObject.connectToDb(function(err,connection) {
  if(err) {
    return callback(true,"Error connecting to database");
  }
  rethinkdb.table('poll').changes().run(connection,function(err,cursor) {
    if(err) {
      console.log(err);
    }
    cursor.each(function(err,row) {
      console.log(JSON.stringify(row));
      if(Object.keys(row).length > 0) {
        socket.broadcast.emit("changeFeed",{"id" : row.new_val.id,"polls" : row.new_val.polls});
      }
    });
  });
  });
};
