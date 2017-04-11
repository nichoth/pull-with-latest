var test = require('tape')
var withLatest = require('../')
var S = require('pull-stream')

test('with latest', function (t) {
    t.plan(2)

    var stream = S(
        S.values(['a','b','c']),
        S.asyncMap(function (ev, cb) {
            setTimeout(function () {
                cb(null, ev)
            }, 210)
        })
    )

    var otherStream = S(
        S.values([1,2,3,4,5,6]),
        S.asyncMap(function (ev, cb) {
            setTimeout(function () {
                cb(null, ev)
            }, 100)
        })
    )

    S(
        withLatest(otherStream, stream),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                ['a', 2],
                ['b', 4],
                ['c', 6]
            ], 'should combine the streams ok')
        })
    )
})

