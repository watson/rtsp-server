'use strict'

var net = require('net')
var pump = require('pump')
var debug = require('debug')('rtsp-server')

exports.CLIENT_METHODS = require('./lib/client-methods')
exports.SERVER_METHODS = require('./lib/server-methods')
exports.STATUS_CODES = require('./lib/status-codes')

var IncomingMessage = exports.IncomingMessage = require('./lib/incoming-message')
var ServerResponse = exports.ServerResponse = require('./lib/server-response')

exports.createServer = function (onRequest) {
  var server = net.createServer()

  if (onRequest) server.addListener('request', onRequest)

  server.on('connection', function (socket) {
    debug('new socket connection')

    var req = new IncomingMessage(socket)

    req.on('request', function () {
      debug('%s request (CSeq: %s)', req.method, req.headers['cseq'])
      var res = new ServerResponse(socket)
      res.setHeader('CSeq', req.headers['cseq'])
      server.emit('request', req, res)
    })

    pump(socket, req, function (err) {
      if (err) {
        debug('socket connection ended with error:', err.message)
        server.emit('error', err)
      } else {
        debug('socket connection ended')
      }
    })
  })

  return server
}
