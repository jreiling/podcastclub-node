const imessage = require('./osa-imessage')
var Pusher = require('pusher-client');
require('custom-env').env()


var socket = new Pusher(process.env.PUSHER_KEY,{
  secret:process.env.PUSHER_SECRET,
  cluster:process.env.PUSHER_CLUSTER

});

var my_channel = socket.subscribe('messages');
socket.bind('messages.send',
  function(data) {
    // add comment into page
    console.log(data);
    imessage.send(data.handle,data.text);
  }
);

console.log(process.env.MESSAGE_URI)


imessage.listen().on('message', (msg) => {
    console.log(msg);
    console.log(`'${msg.text}' from ${msg.handle}`)

    if (msg.group != null ) {

      imessage.getGroupMembers(msg.group).then(groupObject => {
          console.log(groupObject);

          // SEND /handle-group-update
          msg.groupObject = groupObject;
          axios.post(process.env.REMOTE_SERVER + '/api/handle-group-update', msg)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });

      })
    } else {

      // SEND TO /handle-message
      axios.post(process.env.REMOTE_SERVER + '/api/handle-message', msg)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    }

})

console.log('hi?');
imessage.getGroupMembers('chat118940064193888776').then(handle => {
    console.log(handle);
})

console.log('bye');
