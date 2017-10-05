var S = require('pull-stream/pull')
var map = require('pull-stream/throughs/map')
var drain = require('pull-stream/sinks/drain')
var Abortable = require('pull-abortable')

function pullWithLatest (predicate, other, stream) {
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
            if (predicate) return predicate(latest, ev)
            return [latest, ev]
        })
    )
}

module.exports = pullWithLatest

