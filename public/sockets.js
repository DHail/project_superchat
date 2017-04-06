const socket = io.connect('http://localhost:3000');

$(document).ready( () => {

  $('#create-room').click( () => {
    $('#new-room').show();
  });

  $('#room-list').on('click', '.room', event => {
  	const roomName = $(event.target).attr("room-name");
  	$('#current-room-messages').attr("room-name", roomName);
  	socket.emit('click room', roomName);
  });

  $('#new-room-form input').keydown(event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      const roomName = $('input[name=name]').val();
      const userName = $.cookie("username");
      socket.emit('submit new room', roomName, userName);
      $('input[name=name]').val("");
    }
  });

  $('#new-message-form input').keydown(event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      let roomName = $('#current-room-messages').attr("room-name");
      let author = $.cookie("username");
      let text = $('input[name=text]').val();
      socket.emit('new message', roomName, author, text);
      $('input[name=text]').val("");
    }
  });

  socket.on('open room', messages => {
    $("#current-room-messages").children().remove();
    messages.forEach(msg => _appendMessageToRoom(msg.author, msg.text));
    $('#new-room').hide();
    $('#new-message').show();
  });

  socket.on('created message', (room, author, message, newMember) => {
    if ($('#current-room-messages').attr('room-name') === room) {
      _appendMessageToRoom(author, message);
    }
    if (newMember) {
      let $membersDiv = $('#room-list').find(`.members[room-name="${room}"]`);
      const currMembers = $membersDiv.text().match(/\d/)[0];
      $membersDiv.text(`${Number(currMembers) + 1} members`);
    }
  });

  socket.on('add new room', roomName => {
    var $newListItem = $('<li>').addClass('room').attr('room-name', roomName);
    var $navRoomName = $('<div>').addClass('room-name').attr('room-name', roomName);
    var $navMember = $('<div>').addClass('members').attr('room-name',roomName);
    $navRoomName.text(roomName);
    $navMember.text('1 member');
    $newListItem.append($navRoomName).append($navMember);
    $('#room-list').prepend($newListItem);
  });
});

function _appendMessageToRoom(author, message) {
  let outerDiv = $('<div>').addClass('message');
  outerDiv.append($('<div>').addClass('author').text(author));
  outerDiv.append($('<div>').addClass('msg-text').text(message));
  $('#current-room-messages').append(outerDiv);
}
