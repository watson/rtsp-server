'use strict'

var net = require('net')
var rtsp = require('rtsp-stream')
var pkg = require('./package')
var debug = require('debug')(pkg.name)

exports.CLIENT_METHODS = require('./lib/client-methods')
exports.SERVER_METHODS = require('./lib/server-methods')
exports.STATUS_CODES = rtsp.STATUS_CODES
exports.IncomingMessage = rtsp.IncomingMessage
exports.ServerResponse = rtsp.Response

exports.createServer = function (onRequest) {
  var server = net.createServer()

  if (onRequest) server.addListener('request', onRequest)

  server.on('connection', function (socket) {
    debug('new socket connection')

    socket.on('error', function (err) {
      debug('error on socket connection', err.message)
      server.emit('clientError', err, socket)
    })

    socket.on('end', function () {
      debug('socket connection ended')
    })

    socket.on('close', function () {
      debug('socket connection closed')
    })

    var decoder = new rtsp.Decoder()
    var encoder = new rtsp.Encoder()

    decoder.on('request', function (req) {
      debug('%s %s', req.method, req.uri, req.headers)

      var res = encoder.response()
      res.setHeader('CSeq', req.headers['cseq'])
      res.setHeader('Date', new Date().toGMTString())

      req.socket = socket
      res.socket = socket

      server.emit('request', req, res)
    })

    decoder.on('error', function (err) {
      server.emit('error', err)
      socket.destroy()
    })

    socket.pipe(decoder)
    encoder.pipe(socket)
  })

  return server
}
