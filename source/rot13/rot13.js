function generateDict (shift) {
  var bl = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  var sl = 'abcdefghijklmnopqrstuvwxyz'.split('')
  for (var i = 0; i < shift; i++) {
    bl.push(bl.shift())
    sl.push(sl.shift())
  }
  return bl.join('') + sl.join('')
}

function rot13 (str) {
  var input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  var output = generateDict(13)
  var index = x => input.indexOf(x)
  var translate = x => index(x) > -1 ? output[index(x)] : x
  return str.split('').map(translate).join('')
}
