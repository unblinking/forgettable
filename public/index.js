var socket = io.connect()

function message (from, msg) {
  $('#history').append($('<p>').append($('<b>').text(from), msg))
  $('#history').get(0).scrollTop = 10000000
}

socket.on('announcement', function (msg) {
  $('#history').append($('<p>').append($('<em>').text(msg)))
})
socket.on('reconnect', function () {
  message('😌', 'Reconnected to the server')
  resetNickname()

})
socket.on('reconnecting', function () {
  message('😧', 'Attempting to re-connect to the server')
})
socket.on('error', function (e) {
  message('😨', e ? e : 'A unknown error occurred')
})
socket.on('user message', message)

function setNickname () {
  let nickname = $('#nick').val()
  socket.emit('nickname', nickname, function (used) {
    if (!used) { // if nickname wasn't already used
      socket.nickname = nickname
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
}

function resetNickname () {
  socket.emit('nickname', socket.nickname, function (used) {
    if (!used) { // if nickname wasn't already used
      // alert('nickname reset successfully')
    } else { // nickname already used
      // alert('nickname already in use')
      window.location.reload()
    }
  })
  return false
}

$(function () {

  // https://cmsdk.com/css3/css-100vh-is-too-tall-on-mobile-due-to-browser-ui.html
  window.onresize = function () {
    $('#containedSignIn').height($(window).height())
    $('#aboveSignIn').height($(window).height() - $('#signIn').height())
    $('#containedChat').height($(window).height())
    $('#history').height($(window).height() - $('#compose').height())
    $('#history').css('overflow-y', 'scroll')
  }
  window.onresize() // called to initially set the height.

  $('#set-nickname').submit(setNickname)

  $('#send-message').submit(function () {
    message('me', $('#message').val())
    socket.emit('user message', $('#message').val())
    clear()
    return false
  })

  function clear () {
    $('#message').val('').focus()
  }

  $('#nick').val('').focus()

})
