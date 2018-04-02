
   var alp = ['.', ' ', 'e', 't', 'i', 'a', 'n', 'm', 's', 'u', 'r', 'w', 'd', 'k', 'g', 'o', 'h', 'v', 'f', 'um', 'l', 'am', 'p', 'j', 'b', 'x', 'c', 'y', 'z', 'q', 'om']
   var s = ['.', '-', '/']
   var dot = ['.', '·', '•', '◦', '*']
   var dash = ['-', '–', '—', ',']
   var pause = ['/', '\xa0 ', '\\', '|', '¦', '‖', ';']

   // init

   function load_options (selectID, array) {
     var selectBox = document.getElementById(selectID)

     for (var i = 0, l = array.length; i < l; i++) {
       var option = array[i]
       selectBox.options.add(new Option(option, option))
     }
   }

   load_options('dots', dot)
   load_options('dashes', dash)
   load_options('pauses', pause)

   RegExp.quote = function (str) {
     return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
   }

   function setSigns (argument) {
    // var e = document.getElementById('dots');
    // s[0] = e.options[e.selectedIndex].text
    // var e = document.getElementById('dashes');
    // s[1] = e.options[e.selectedIndex].text
    // var e = document.getElementById('pauses');
    // s[2] = e.options[e.selectedIndex].text
   }

   function encrypt (data) {
     data = data.toLowerCase().replace(/\.|\,|\!|\?/g, ' ')

     setSigns()

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

   function decrypt (data) {
     setSigns()

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

  // setup before functions
   var typingTimer                // timer identifier
   var doneTypingInterval = 750  // time in ms, 5 second for example
   var $input = $('#input')
   var $output = $('#output')

// on keyup, start the countdown
   $input.on('keyup', function () {
     clearTimeout(typingTimer)
     typingTimer = setTimeout(doneTyping, doneTypingInterval)
   })

// on keydown, clear the countdown
   $input.on('keydown', function () {
     clearTimeout(typingTimer)
     $output.addClass('busy')
   })

// user is "finished typing," do something
   function doneTyping () {
     buttonCrypt()
   }

   function buttonCrypt () {
     $output.addClass('busy')
     if (!document.getElementById('mode').checked) {
       $output.val(encrypt($input.val()))
     } else {
       $output.val(decrypt($input.val()))
     }
     $output.removeClass('busy')
   }

   function modeCrypt () {
     if (!document.getElementById('mode').checked) {
       $('#buttonCrypt').html('Encrypt')
     } else {
       $('#buttonCrypt').html('Decrypt')
     }
   }
