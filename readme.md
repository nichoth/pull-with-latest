# pull with latest

Take two streams, and return a new stream that emits every value from the first stream with the most recent value from the other stream.

## example

```js
var withLatest = require('pull-with-latest')
var S = require('pull-stream')

var stream = S(
    S.values(['a','b','c']),
    S.asyncMap(function (ev, cb) {
        setTimeout(function () {
            cb(null, ev)
        }, 210)
    })
)

// this is twice as fast as `stream`, but only the most recent
// value gets sent to the sink
var other = S(
    S.values([1,2,3,4,5,6]),
    S.asyncMap(function (ev, cb) {
        setTimeout(function () {
            cb(null, ev)
        }, 100)
    })
)

S(
    withLatest(other, stream),
    S.log()
    //   ['a', 2],
    //   ['b', 4],
    //   ['c', 6]
)
```
