'use strict'

var net = require('net')
var test = require('tape')
var rtsp = require('./')

test('no response body', function (t) {
  t.plan(5)

  var server = rtsp.createServer(function (req, res) {
    t.equal(req.method, 'OPTIONS')
    t.equal(req.url, '*')
    t.equal(req.rtspVersion, '1.0')
    t.deepEqual(req.headers, { 'cseq': '42', 'foo': 'bar' })
    res.setHeader('Bar', 'baz')
    res.end()
  })

  server.listen(function () {
    var port = server.address().port
    var buffers = []

    var client = net.connect(port, function () {
      client.write('OPTIONS * RTSP/1.0\r\n')
      client.write('CSeq: 42\r\n')
      client.write('Foo: bar\r\n')
      client.write('\r\n')
    })

    client.on('data', buffers.push.bind(buffers))

    client.on('end', function () {
      var data = Buffer.concat(buffers).toString()
      t.equal(data, 'RTSP/1.0 200 OK\r\nCSeq: 42\r\nBar: baz\r\n\r\n')
    })
  })

  server.unref()
})

test('with response body', function (t) {
  t.plan(5)

  var date
  var server = rtsp.createServer(function (req, res) {
    t.equal(req.method, 'OPTIONS')
    t.equal(req.url, '*')
    t.equal(req.rtspVersion, '1.0')
    t.deepEqual(req.headers, { 'cseq': '42', 'foo': 'bar' })
    res.setHeader('Bar', 'baz')
    res.write('Hello World!')
    res.end()
    date = new Date().toGMTString()
  })

  server.listen(function () {
    var port = server.address().port
    var buffers = []

    var client = net.connect(port, function () {
      client.write('OPTIONS * RTSP/1.0\r\n')
      client.write('CSeq: 42\r\n')
      client.write('Foo: bar\r\n')
      client.write('\r\n')
    })

    client.on('data', buffers.push.bind(buffers))

    client.on('end', function () {
      var data = Buffer.concat(buffers).toString()
      t.equal(data, 'RTSP/1.0 200 OK\r\nCSeq: 42\r\nDate: ' + date + '\r\nBar: baz\r\n\r\nHello World!')
    })
  })

  server.unref()
})
