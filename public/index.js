var socket = io.connect()

function message (from, msg) {
  $('#lines').append($('<p>').append($('<b>').text(from), msg))
  $('#lines').get(0).scrollTop = 10000000
}

socket.on('announcement', function (msg) {
  $('#lines').append($('<p>').append($('<em>').text(msg)))
})
socket.on('reconnect', function () {
  message('System', 'Reconnected to the server')
})
socket.on('reconnecting', function () {
  message('System', 'Attempting to re-connect to the server')
})
socket.on('error', function (e) {
  message('System', e ? e : 'A unknown error occurred')
})
/*
socket.on('nicknames', function (nicknames) {
  $('#nicknames').empty().append($('<span>Online: </span>'))
  for (var i in nicknames) {
    $('#nicknames').append($('<b>').text(nicknames[i]))
  }
})
*/
socket.on('user message', message)

$(function () {

  // https://cmsdk.com/css3/css-100vh-is-too-tall-on-mobile-due-to-browser-ui.html
  window.onresize = function () {

    $('#containedSignIn').height($(window).height())
    $('#blank').height($(window).height() - $('#signin').height())

    $('#containedChat').height($(window).height())
    $('#lines').height($(window).height() - $('#compose').height())
    $('#lines').css('overflow-y', 'scroll')


  }
  window.onresize() // called to initially set the height.

  $('#set-nickname').submit(function () {
    socket.emit('nickname', $('#nick').val(), function (used) {
      if (!used) { // if nickname wasn't already used
        $('#containedSignIn').css('display', 'none')
        $('#containedChat').css('display', 'block')
        window.onresize()
        clear()
      } else { // nickname already used
        $('#nickname-err').css('display', 'block')
        window.onresize()
      }
    })
    return false
  })

  $('#send-message').submit(function () {
    message('me', $('#message').val())
    socket.emit('user message', $('#message').val())
    clear()
    // $('#lines').get(0).scrollTop = 10000000
    return false
  })

  function clear () {
    $('#message').val('').focus()
  }

  $('#nick').val('').focus()

})
