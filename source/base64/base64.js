var app = new Vue({
  el: '#tool',
  delimiters: ['{$', '$}'],
  data: {
    inputtext: '',
    reverse: false,
    mode: 'encode',
    re: /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/g
  },
  computed: {
    action: function () {
      return this.mode != 'encode' ? v => atob(v) : v => btoa(v)
    },
    outputtext: function () {
      return this.action(this.inputtext ? this.inputtext : document.getElementById('inputtext').placeholder)
    },
    isBase64: function () {
      return this.inputtext.match(this.re) != null
    }
  },
  methods: {
    switchSides: function () {
      this.inputtext = this.outputtext
      this.mode = this.isBase64 ? 'decode' : 'encode'
    }
  }
})
