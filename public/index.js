var socket = io.connect()

/**
 * Reset the message input field and focus the cursor there.
 */
function clear () {
  $('#message').val('').focus()
}

/**
 * Set the user's nickname.
 */
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

/**
 * Reset the user's nickname, such as upon disconnected/reconnect.
 */
function resetNickname () {
  socket.emit('nickname', socket.nickname, function (used) {
    if (!used) { // if nickname wasn't already used
      message('😎', 'Nickname recovered successfully')
    } else { // nickname already used
      window.location.reload()
    }
  })
  return false
}

/**
 * Append a message to the chat history.
 */
function message (from, msg) {
  $('#history').append($('<p>').append($('<b>').text(from), msg))
  $('#history').get(0).scrollTop = 10000000
}

/**
 * Resize elements properly when the window is resized.
 */
function windowResize () {
  $('#containedSignIn').height($(window).height())
  $('#aboveSignIn').height($(window).height() - $('#signIn').height())
  $('#containedChat').height($(window).height())
  $('#history').height($(window).height() - $('#compose').height())
  $('#history').css('overflow-x', 'hidden')
  $('#history').css('overflow-y', 'scroll')
}

/**
 * Some stuff to run when the page first loads.
 */
$(() => {
  window.onresize = windowResize
  window.onresize()
  $('#set-nickname').submit(setNickname)
  $('#send-message').submit(function () {
    message('me', $('#message').val())
    socket.emit('user message', $('#message').val())
    clear()
    return false
  })
  $('#nick').val('').focus()
})

socket.on('announcement', function (msg) {
  $('#history').append($('<p>').append($('<em>').text(msg)))
})
socket.on('reconnect', function () {
  message('😌', 'Reconnected to the server')
  resetNickname()
})
socket.on('reconnecting', function () {
  message('😧', 'Disconnected. Attempting to reconnect …')
})
socket.on('error', function (e) {
  message('😨', e ? e : 'A unknown error occurred')
})
socket.on('user message', message)
