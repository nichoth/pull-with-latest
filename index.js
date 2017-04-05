var S = require('pull-stream/pull')
var map = require('pull-stream/throughs/map')
var drain = require('pull-stream/sinks/drain')
var Abortable = require('pull-abortable')

function pullWithLatest (stream, other) {
    var latest
    var abortable = Abortable()

    S(
        other,
        drain(function onEvent (ev) {
            latest = ev
        }, function onEnd (err) {
            if (err) abortable.abort(err)
        })
    )

    return S(
        stream,
        abortable,
        map(function (ev) {
            return [ev, latest]
        })
    )
}

module.exports = pullWithLatest
