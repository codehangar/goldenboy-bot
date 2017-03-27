const r = require('rethinkdb');
const bot = require('./bot');
const rethinkHost  = process.env.RETHINK_HOST.toString();
const rethinkPort = process.env.RETHINK_PORT;
var connection = null;


function createRethinkUser(username){
    r.connect( {host: rethinkHost , port: rethinkPort, db: 'goldenboy_db'}, function(err, conn) {
        if (err) throw err;
        r.table("users").insert({
            username: username,
            swear_count: 0
            }).run(conn, function(){console.log("checked for " + username)})

        conn.close(function(err) { if (err) throw err; })
    })


}

function incrementUserSwearCount(username, added_swears){
    r.connect( {host: rethinkHost , port: rethinkPort, db: 'goldenboy_db'}, function(err, conn) {
        if (err) throw err;

        r.table("users").filter({username : username}).update({
            swear_count : r.row("swear_count").add(added_swears)
        }).run(conn, function(){ console.log("incremented " + username)})

        conn.close(function(err) { if (err) throw err; })
    })


}

function getUserSwearCount(message, username){
   var swears = 0;
   r.connect( {host: rethinkHost , port: rethinkPort, db: 'goldenboy_db'}, function(err, conn) {
    if (err) throw err;

    r.table("users").filter({username : username}).run(conn, function(){ console.log("ostensibly got user swears for " + username)}).then(function(result){
        result.each(function(err, row){
            uname = row['username']
            //console.log(uname)
            swears = row['swear_count'];
            //console.log('returning swears');
            //console.log(swears);
            bot.sendMessage(message.channel, username + " has sworn " + swears.toString() + " times! Yikes!");
    
        //return swears; 
        })
    }, function(err) {
        console.log(err);
    })

    conn.close(function(err) { if (err) throw err; })
})  
   
   //return swears; /// implement 'when done ' promise


}

module.exports={
    createRethinkUser,
    incrementUserSwearCount,
    getUserSwearCount
}