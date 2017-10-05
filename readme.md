# pull with latest

Take two streams, and return a new stream that emits every value from the first stream with the most recent value from the other stream.

## install 

    npm install pull-with-latest

## example

```js
var test = require('tape')
var withLatest = require('../')
var S = require('pull-stream')

test('pass null for the default predicate', function (t) {
    t.plan(2)
    var predicate = null

    S(
        withLatest.apply(null, [predicate].concat(sources())),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                [2, 'a'],
                [4, 'b'],
                [6, 'c']
            ], 'should combine the streams ok')
        })
    )
})

test('use predicate function', function (t) {
    t.plan(2)
    var predicate = function (a, b) {
        return { a: a, b: b }
    }

    S(
        withLatest.apply(null, [predicate].concat(sources())),
        S.collect(function (err, res) {
            t.error(err)
            t.deepEqual(res, [
                { a:2, b:'a' },
                { a:4, b:'b' },
                { a:6, b:'c' }
            ], 'should combine the streams ok')
        })
    )
})


function sources () {
    var sampler = S(
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

    return [otherStream, sampler]
}
```

