
   var alp = ['.', ' ', 'e', 't', 'i', 'a', 'n', 'm', 's', 'u', 'r', 'w', 'd', 'k', 'g', 'o', 'h', 'v', 'f', 'um', 'l', 'am', 'p', 'j', 'b', 'x', 'c', 'y', 'z', 'q', 'om']
   var s = ['.', '-', '/']
   var dot = ['.', '·', '•', '◦', '*']
   var dash = ['-', '–', '—', ',']
   var pause = ['/', '\xa0 ', '\\', '|', '¦', '‖', ';']

   RegExp.quote = function (str) {
     return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
   }

   function encryptMorse (data) {
     data = data.toLowerCase().replace(/\.|\,|\!|\?/g, ' ')

     var code = ''
     for (var i = 0; i < data.length; i++) {
       var sign = data[i]
       for (var j = alp.length - 1; j >= 0; j--) {
         if (alp[j] == data[i]) {
           sign = j.toString(2).substr(1).replace(/0/g, s[0]).replace(/1/g, s[1])
           break
         }
       };
       code += sign + s[2]
     };
     return code
   }

   function decryptMorse (data) {
     var decoded = ''
     var ms = data.split(RegExp.quote(s[2]))

     for (var i = ms.length - 1; i >= 0; i--) {
       var letter
       if (/\.|\-|$^/.test(ms[i])) {
         letter = alp[parseInt(('1' + ms[i].replace(RegExp(RegExp.quote(s[0]), 'g'), '0').replace(RegExp(RegExp.quote(s[1]), 'g'), '1')), 2)]
       } else {
         letter = ms[i]
       };
       console.log(letter)
       decoded = letter + decoded
     };

    // decoded = decoded.replace(/ {2}+/g, '\. ')
     return decoded
   }
