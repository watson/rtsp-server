# rtsp-server

A low level module for creating [RTSP
servers](https://en.wikipedia.org/wiki/Real_Time_Streaming_Protocol).

This project aims for 100% compliance with [RFC
2326](https://tools.ietf.org/html/rfc2326). If you find something
missing, please [open an
issue](https://github.com/watson/rtsp-server/issues).

[![Build status](https://travis-ci.org/watson/rtsp-server.svg?branch=master)](https://travis-ci.org/watson/rtsp-server)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Installation

```
npm install rtsp-server
```

## Usage

```js
var rtsp = require('rtsp-server')

var server = rtsp.createServer(function (req, res) {
  console.log(req.method, req.url)

  switch (req.method) {
    case 'OPTIONS':
      res.setHeader('Public', 'OPTIONS')
      break
    default:
      res.statusCode = 501 // Not implemented
  }

  res.end() // will echo the CSeq header used in the request
})

server.listen(5000, function () {
  var port = server.address().port
  console.log('RTSP server is running on port:', port)
})
```

## Out of scope

This project is not:

- An RTSP client
- A functional RTSP server you can just run out of the box (think of
  this module more like the core `http` module without the client part)
- A discovery service: I.e. no mDNS/Bonjour/Zeroconf technology included

## Todo

- UDP support: Currently only TCP is supported.
- ??? Did I forget to add an item to this to-do list? [Open an
  issue](https://github.com/watson/rtsp-server/issues).

## License

MIT
