/**
 * Forgettable - Another chat.
 * @author {@link https://github.com/jmg1138 jmg1138}
 */

/* eslint-env jquery */
/* global io */

var socket = io.connect()

/**
 * Reset the message input field and focus the cursor there.
 */
function clear () {
  $(`#message`).val(``).focus()
}

/**
 * Set the user nickname.
 */
function setNickname () {
  let nickname = $(`#nick`).val()
  socket.emit(`nickname`, nickname, function (used) {
    if (used) {
      $(`#nickname-err`).css(`display`, `block`)
      window.onresize()
    } else {
      socket.nickname = nickname
      $(`#containedSignIn`).css(`display`, `none`)
      $(`#containedChat`).css(`display`, `block`)
      window.onresize()
      clear()
    }
  })
  return false
}

/**
 * Reset the user nickname, such as upon disconnected/reconnect.
 */
function resetNickname () {
  socket.emit(`nickname`, socket.nickname, function (used) {
    if (used) {
      window.location.reload()
    } else {
      announcement(`😎 Nickname recovered successfully`)
    }
  })
}

/**
 * Appends an announcement to the chat history.
 * @param {string} msg - The announcement text.
 */
function announcement (msg) {
  $(`#history`).append($(`<p>`).text(msg))
  $(`#history`).get(0).scrollTop = 10000000
}

/**
 * Append my own new messages to the chat history.
 */
function myMessage (msg) {
  $(`#history`).append(
    $(`<p class="myLine">`).append(
      $(`<span class="myMessage">`).text(msg)
    )
  )
  $(`#history`).get(0).scrollTop = 10000000
}

/**
 * Append a message to the chat history.
 */
function message (from, msg) {
  $(`#history`).append(
    $(`<p>`).append(
      $(`<span class="badge badge-pill badge-success mr-2">`).text(from),
      msg
    )
  )
  $(`#history`).get(0).scrollTop = 10000000
}

/**
 * Send a user message to the chat server.
 */
function sendMessage () {
  if ($(`#message`).val() !== ``) {
    socket.emit(`user message`, $(`#message`).val())
    myMessage($(`#message`).val())
    clear()
  }
  return false
}

/**
 * Resize elements properly when the window is resized.
 */
function windowResize () {
  $(`#containedSignIn`).height($(window).height())
  $(`#aboveSignIn`).height($(window).height() - $(`#signIn`).height())
  $(`#containedChat`).height($(window).height())
  $(`#history`).height($(window).height() - $(`#compose`).height())
}

/**
 * Some stuff to run when the page first loads.
 */
$(() => {
  window.onresize = windowResize
  window.onresize()
  $(`#nick`).val(``).focus()
  $(`#set-nickname`).submit(setNickname)
  $(`#send-message`).submit(sendMessage)
})

/**
 * Socket.IO event listeners for built in events.
 */
socket.on(`connect`, () => {
  announcement(`😃 Connected to the server`)
})
// socket.on(`connect_error`, err => {
//   announcement(`😱 Connection error: ${err}`)
// })
socket.on(`connect_timeout`, () => {
  announcement(`⌛ Connection timeout`)
})
// socket.on(`error`, e => {
//   announcement(e ? e : `A unknown error occurred`)
// })
socket.on(`disconnect`, reason => {
  announcement(`😱 Disconnected because ${reason}`)
})
socket.on(`reconnect`, attempt => {
  announcement(`😌 Reconnected to the server after ${attempt} attempts`)
  resetNickname()
})
// socket.on(`reconnect_attempt`, () => {
//   announcement(`📡 Reconnection attempt`)
// })
socket.on(`reconnecting`, attempt => {
  announcement(`😧 Disconnected, but reconnecting: ${attempt}`)
})
// socket.on(`reconnect_error`, err => {
//   announcement(`😱 Reconnection error: ${err}`)
// })
socket.on(`reconnect_failed`, reconnectionAttempts => {
  announcement(`😱 Reconnect failed. Could not reconnect in less than ${reconnectionAttempts} attempts.`)
})
// socket.on(`ping`, () => {
//   announcement(`🏓 ping`)
// })
// socket.on(`pong`, ms => {
//   announcement(`🏓 pong in ${ms}ms`)
// })

/**
 * Socket.IO event listeners for custom events.
 */
socket.on(`announcement`, announcement)
socket.on(`user message`, message)
