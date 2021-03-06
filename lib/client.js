'use strict';

 /* global $ io Cookies */

$(document).ready(function () {
  var socket = io(); // initialise socket.io connection

  function getName () {
    // prompt for person's name before allowing to post
    var name = Cookies.get('name');

    if (!name || name === 'null') {
      name = window.prompt('What is your name/handle?'); // eslint-disable-line
      Cookies.set('name', name);
    }
    socket.emit('io:name', name);
    $('#m').focus(); // focus cursor on the message input

    return name;
  }

  function leadZero (number) {
    return (number < 10) ? '0' + number : number;
  }

  function getTime (timestamp) {
    var t, h, m, s;

    t = new Date(timestamp);
    h = leadZero(t.getHours());
    m = leadZero(t.getMinutes());
    s = leadZero(t.getSeconds());

    return String(h) + ':' + m + ':' + s;
  }

  /**
   * renders messages to the DOM. nothing fancy. want fancy? ask!
   * @param {String} message - the message (stringified object) to be displayed.
   * @returns {Boolean} false;
   */
  function renderMessage (message) {
    var msg = JSON.parse(message);
    var html = '<li class=\'row\'>';

    html += '<small class=\'time\'>' + getTime(msg.t) + ' </small>';
    html += '<span class=\'name\'>' + msg.n + '</span>';
    html += '<p class=\'msg\'>' + msg.m + '</p>';
    html += '</li>';
    var html1;
    if(Cookies.get('name') == msg.n)
    {
    html1= '<div class="outgoing_msg">';
    html1 += '<div class="sent_msg">';
    html1 +='<p>' + msg.m + '</p>'
    html1 +=  '<span class="time_date"> 11:01 AM    |    June 9</span> </div>'
    html1 += '</div>';
    }
    else
    {
      html1= '<div class="incoming_msg">';
      html1 += '<div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> </div>';
      html1 += '<div class="received_msg">';
      html1 += '<div class="received_withd_msg">'
      html1 += '<p>' + msg.m + '</p>';
      html1 += '<span class="time_date"> 11:01 AM    |    June 9</span></div>';
      html1 += '</div>';
    }
    $('#messages').append(html1);  // append to list
  }

  $('#m').keypress(function (e) {
    if (e.which == 13) {
      $( "#btnSend" ).trigger( "click" );
      return false;    
    }
  });

  $('#btnSend, #iButtonSend').click(function(){
    var msg;

    // if input is empty or white space do not send message
    if ($('#m').val()
      .match(/^[\s]*$/) !== null) {
      $('#m').val('');
      $('#m').attr('placeholder', 'please enter your message here');
    } else if (!Cookies.get('name') || Cookies.get('name').length < 1
      || Cookies.get('name') === 'null') {
      getName();
    } else {
      msg = $('#m').val();
      socket.emit('io:message', msg);
      $('#m').val(''); // clear message form ready for next/new message
      $('#m').attr('placeholder', ''); // clears placeholder once a msg is successfully sent
    }

    return false;
  });

  $('form').submit(function () {
    var msg;

    // if input is empty or white space do not send message
    if ($('#m').val()
      .match(/^[\s]*$/) !== null) {
      $('#m').val('');
      $('#m').attr('placeholder', 'please enter your message here');
    } else if (!Cookies.get('name') || Cookies.get('name').length < 1
      || Cookies.get('name') === 'null') {
      getName();
    } else {
      msg = $('#m').val();
      socket.emit('io:message', msg);
      $('#m').val(''); // clear message form ready for next/new message
      $('#m').attr('placeholder', ''); // clears placeholder once a msg is successfully sent
    }

    return false;
  });

  // keeps latest message at the bottom of the screen
  // http://stackoverflow.com/a/11910887/2870306
  function scrollToBottom () {
    // $(window).scrollTop($('#mesgs').height());
    var $t = $('#messages');
    $t.animate({"scrollTop": $('#messages')[0].scrollHeight}, "slow");
  }

  window.onresize = function () {
    scrollToBottom();
  };

  socket.on('chat:messages:latest', function (msg) {
    // console.log('>> ' + msg);
    renderMessage(msg);
    scrollToBottom();
  });

  socket.on('chat:people:new', function (name) {
    $('#joiners').show();
    $('#joined').text(name);
    $('#joiners').fadeOut(5000);
  });

  getName();

  function loadMessages () {
    $.get('/load', function (data) {
      data.forEach(function (msg) {
        renderMessage(msg);
      });
      scrollToBottom();
    });
  }
  loadMessages();
});
