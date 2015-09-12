'use strict'

var net = require('net')
var test = require('tape')
var rtsp = require('./')

test('server events', function (t) {
  t.plan(3)

  var server = rtsp.createServer()

  server.on('listening', connect)
  server.on('connection', function (c) {
    t.ok(true)
    c.unref()
  })
  server.on('request', function (req, res) {
    t.ok(req instanceof rtsp.IncomingMessage)
    t.ok(res instanceof rtsp.ServerResponse)
    server.unref()
  })
  server.listen()

  function connect () {
    var port = server.address().port
    var client = net.connect(port, function () {
      client.write('OPTIONS * RTSP/1.0\r\n\r\n')
    })
    client.unref()
  }
})

test('request events', function (t) {
  t.plan(3)

  var server = rtsp.createServer(function (req, res) {
    req.on('readable', function () {
      t.ok(true)
    })
    req.on('end', function () {
      t.ok(true)
      server.unref()
    })
    req.on('data', function (chunk) {
      t.equal(chunk.toString(), 'foobar')
    })
  })

  server.on('connection', function (c) {
    c.unref()
  })

  server.listen(function () {
    var port = server.address().port
    var client = net.connect(port, function () {
      client.write('OPTIONS * RTSP/1.0\r\nContent-Length: 6\r\n\r\nfoobar')
    })
    client.unref()
  })
})
