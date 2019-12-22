
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/build'));

app.use(bodyParser.json({type:'application/json'}));
app.use(bodyParser.urlencoded({extended:true}));
var con = mysql.createConnection({

    host:'localhost',
    port:'3306',
    user:'root',
    password:'root', //empty for window
    database: 'chat_db'

});

const messages = []; // {userId, text, date, type(message, info), id}

const users = {}; // { online, user }

server.listen(8080, function(){
  var host = server.address().address
   var port = server.address().port
    console.log("start");
}
);

con.connect(function(error){
  if(error) console.log(error);
  else console.log("connected");
});

app.get('*', (req, res) => {
  console.log("load");
  res.sendFile(__dirname + '/build/index.html');

});

function getOnlineUsers() {
  const arr = [];
  console.log("users 1 : ", arr);
  for (let id in users) {
    if (users[id].online) arr.push(users[id]);
  }
  console.log("users 2 : ", arr);
  return arr;

//  function returnOnline() {
//    return getOnlineUsers()
//  }

}


function getMessages(count = messages.length) {
  console.log("load messages " );
  if (messages.length <= count) return messages.slice();
console.log("messages 1: ", messages);
  return messages.slice(messages.length - count, messages.length);
  console.log("messages 2: ", messages);
}

function addMessage(socket, msg) {
  msg.user = socket.user;
  msg.date = new Date();
  msg.id = messages.length;
console.log("messages 11ss: ", messages);
con.query("SELECT * FROM messages_pool;")
.on('result', function(msg){
  messages.push(msg);
})
  //messages.push(msg);
//console.log("messages 12: ", msg);
.on('end', function(){
  socket.broadcast.emit('message', buildMessage(msg));
  console.log("messages 12: ", msg);
});
  function returnMessages() {
    return buildMessage(msg)
  }

  var values = returnMessages()

    function returnOnline() {
     return getOnlineUsers()
    }

    var online = returnOnline();

function select(){
//  var qer = con.query("SELECT * FROM messages_pool;", function (err, result, qer) {
      //        if (err) throw err;
      //        console.log("Result: " + JSON.stringify(result));
      //    });
  //  console.log("____sssss+++ss__________________", qer);
  return;
}
//console.log("____sssssAAAAAAAAAAAAAAAAAsssss__________________", select());
function selectReturn(){
  return select();
}

var sqlsql = selectReturn();
//console.log("______________________JSON____________________________________", sqlsql)
  //  console.log("messages 13_________________________________________: ", online[0].user);

  //  console.log("messages 13----------: ", values.text);

con.query('INSERT INTO messages_pool (userId, text, type, user, date, message_id) VALUES (?, ?, ?, ?, ?, ?)', [values.userId, values.text, values.type, values.user, values.date, values.id]);

//  console.log("messages 13: ", msg.userId);
//  console.log("messages 14: ", buildMessage(msg));

}
//  console.log("messages xxx: ", addMessage(socket, msg));
// {User, UserId, Text, Type, Date, id}

//console.log("returnOnline ", returnOnline() );


function buildMessage(msg) {
  return {
    ...msg,
    user: users[msg.userId] ? users[msg.userId].user : 'Аноним',
  };
}

io.on('connection', socket => {
  socket.emit('user:updatecount',  getOnlineUsers().length);
  socket.emit('user:list',getOnlineUsers());
  socket.on('user:connect', data => {onUserConnect(socket, data); });
  socket.on('disconnect', () => onUserDisconnect(socket));
  socket.on('user:disconnect', () => onUserDisconnect(socket));
  socket.on('message', msg => onReceiveMessage(socket, msg));
});

function onUserConnect(socket, data, error) {
  const user = data.user;
  const userId = socket.id;

  users[userId] = {
    online: true,
    user,
  };


  //console.log("___________________________", users);
//  addUsersList(socket, users);
//  console.log("___________________________", addUsersList(socket, users));
//  io.emit('user:list', users => { users; console.log("__________USERS LOGGGING____________________________", users);});
  io.emit('user:updatecount', getOnlineUsers().length);

  addMessage(socket, {
    userId: userId,
    text: `Пользователь ${user} подключился`,
    type: 'info',
  });

  socket.emit('user:connect', getMessages(100).map(buildMessage));

  if(error) console.log(error);
  else console.log(data);
}
//console.log("___________________________", onUserConnect().users);
function onReceiveMessage(socket, msg) {
  console.log("recieve 1", msg);
  addMessage(socket, {
    ...msg,
    type: 'message',
    userId: socket.id,

  });
console.log("recieve 2", msg);
}

function onUserDisconnect(socket) {
  const userId = socket.id;
  if (!users[userId] || users[userId].online === false) return;

  users[userId].online = false;

  io.emit('user:updatecount', getOnlineUsers().length);

  addMessage(socket, {
    userId: userId,
    text: `Пользователь ${users[userId].user} вышел`,
    type: 'info',
  });
}
