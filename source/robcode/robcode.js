// The MIT License (MIT)

// Copyright (c) 2016 Rob Burrowes

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
var defaultColorArray = ['#007bff', '#6610f2', '#6f42c1', '#e83e8c', '#dc3545', '#fd7e14', '#ffc107', '#28a745', '#20c997', '#17a2b8']
var black_array = ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black']
var svgId = 'outputsvg'

var colorArray = defaultColorArray

function set_table_color () {
  for (var i = 0; i < 8; i++) {
    document.getElementById('table1_cell_color_' + i).value = colorArray[i]
  }
}

function reverse_colors () {
  colorArray = colorArray.reverse()
  set_table_color()
}

function set_color (color_id) {
  var index = parseInt(color_id.id.slice(-1)) // ???
  colorArray[index] = color_id.value
  return true
}

function polarToCartesianCoordinates (centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  }
}

function describeSVGArc (center_x, center_y, inner_radius, outer_radius, startAngle, endAngle) {
  var inner_start = polarToCartesianCoordinates(center_x, center_y, inner_radius, endAngle)
  var inner_end = polarToCartesianCoordinates(center_x, center_y, inner_radius, startAngle)
  var outer_start = polarToCartesianCoordinates(center_x, center_y, outer_radius, endAngle)
  var outer_end = polarToCartesianCoordinates(center_x, center_y, outer_radius, startAngle)
  var arcSweep = endAngle - startAngle <= 180 ? '0' : '1'
  var d = [
    'M', outer_start.x, outer_start.y,
    'A', outer_radius, outer_radius, 0, arcSweep, 0, outer_end.x, outer_end.y,
    'L', inner_end.x, inner_end.y,
    'A', inner_radius, inner_radius, 0, arcSweep, 1, inner_start.x, inner_start.y,
    'L', outer_start.x, outer_start.y
  ].join(' ')
  return d
}

function drawCircleArc (rp, inner_radius, outer_radius, start_angle, end_angle, color) {
  var svg_ = document.getElementById(svgId)
  var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  if (rp.counter_clockwise) {
    t = 360 - start_angle
    start_angle = 360 - end_angle
    end_angle = t
  }
  newPath.setAttribute('d', describeSVGArc(rp.center_x, rp.center_y, inner_radius, outer_radius, start_angle, end_angle)) // Set path's data
  newPath.style.stroke = color // Set stroke color
  newPath.style.fill = color // Set fill color
  newPath.style.strokeWidth = '0.25' // Set stroke width

  svg_.appendChild(newPath)
}

function drawCircleBit (rp, ring, sectors_in_ring, bit_index, color) {
  var radius = rp.ring_width * ring
  var arc_angle = 360 / (rp.bytes_per_sector * sectors_in_ring * rp.bits_per_byte) // ring * ring_increment
  var start_angle = arc_angle * bit_index
  drawCircleArc(rp, radius, radius + rp.ring_width, start_angle, start_angle + arc_angle, color)
}

function drawRectBit (center_x, center_y, ring, rect_width, bit_index, color) {
  var svg_ = document.getElementById(svgId)
  var radius = rect_width * ring
  var newRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  newRect.setAttribute('x', center_x + rect_width / 1.6 * bit_index)
  newRect.setAttribute('y', center_y + radius)
  newRect.setAttribute('width', rect_width / 1.6)
  newRect.setAttribute('height', rect_width)
  newRect.style.fill = color // Set fill color
  newRect.style.stroke = 'black' // Set stroke color
  newRect.style.strokeWidth = '0.25' // Set stroke width
  svg_.appendChild(newRect)
}

function drawCircle (center_x, center_y, radius, stroke_width, color) {
  var svg_ = document.getElementById(svgId)
  var newCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  newCircle.setAttribute('cx', center_x)
  newCircle.setAttribute('cy', center_y)
  newCircle.setAttribute('r', radius)
  if (stroke_width == 0) {
    newCircle.style.fill = color // Set fill color
    newCircle.style.stroke = color // Set stroke color
    newCircle.style.strokeWidth = '0.25' // Set stroke width
  } else {
    newCircle.style.fill = 'none' // Set fill color
    newCircle.style.stroke = color // Set stroke color
    newCircle.style.strokeWidth = stroke_width // Set stroke width
  }
  svg_.appendChild(newCircle)
}

function drawRing (center_x, center_y, outer_radius, stroke_width, color) {
  drawCircle(center_x, center_y, outer_radius, stroke_width, color)
}

function drawDoubleCircle (center_x, center_y, ring_width, color) {
  drawCircle(center_x, center_y, ring_width / 2, 0, color)
  drawRing(center_x, center_y, ring_width * 0.7, ring_width * 0.15, color)
}

function encode_string_to_bits (the_string) {
  var array_of_bytes = []
  for (var i = 0; i < the_string.length; i++) {
    array_of_bytes[i] = the_string.charCodeAt(i) & 0xFF
  }
  return array_of_bytes
}

function first_sector_for_ring (ring, ring_increment, exponential) { // base = rp.ring_increment for log
  if (ring <= 0) return 0
  if (ring_increment == 0) return ring
  ring -= 1 // As we need to calculate the capacity up to this ring.
  if (exponential) {
    return ring_increment == 1 ? ring : ((1 - Math.pow(ring_increment, ring)) / (1 - ring_increment)) * ring_increment + 1
  }
  return ring_increment / 2.0 * (ring * ring + ring) + 1
}

function bit_index (sector_in_ring, bytes_per_sector, byte_in_sector, bits_per_byte, bit_in_byte) {
  return (sector_in_ring * bytes_per_sector + byte_in_sector) * bits_per_byte + bit_in_byte
}

function render_a_byte (the_byte, rp, ring, sectors_in_ring, sector_in_ring, byte_in_sector) {
  var parity = rp.which_parity == 'even' ? 0 : 1 // even or odd, ignore none
  var mask
  var lsb
  if (rp.bit_order == 'lsb') {
    mask = 1
    lsb = true
  } else {
    mask = 0x80
    lsb = false
  }

  for (var j = 0; j < 8; j++) {
    bit_i = bit_index(sector_in_ring, rp.bytes_per_sector, byte_in_sector, rp.bits_per_byte, j)
    if ((the_byte & mask) == mask) {
      parity ^= 1
      if (rp.unrolled) {
        drawRectBit(0, 0, ring, rp.ring_width, bit_i, rp.color_array[j])
      } else {
        drawCircleBit(rp, ring, sectors_in_ring, bit_i, rp.color_array[j])
      }
    } else if (rp.unrolled) {
      drawRectBit(0, 0, ring, rp.ring_width, bit_i, 'white')
    }
    if (lsb) the_byte >>>= 1
    else mask >>>= 1
  }

  if (rp.which_parity != 'none') {
    if (rp.which_parity == 'space') parity = 0
    else if (rp.which_parity == 'mark') parity = 1
    bit_i = bit_index(sector_in_ring, rp.bytes_per_sector, byte_in_sector, rp.bits_per_byte, 8)
    if (parity == 1 && ring != null) {
      if (rp.unrolled) {
        drawRectBit(0, 0, ring, rp.ring_width, bit_i, rp.color_array[8])
      } else {
        drawCircleBit(rp, ring, sectors_in_ring, bit_i, rp.color_array[8])
      }
    } else if (rp.unrolled) {
      drawRectBit(0, 0, ring, rp.ring_width, bit_i, 'white')
    }
  }
}

function sectors_in_a_ring (ring, rp) {
  if (rp.ring_increment == 0) return 1
  if (ring == 0) return 1
  return rp.exponential ? Math.pow(rp.ring_increment, ring) : (rp.ring_increment * ring)
}

function render_bytes (array_of_bytes, rp) {
  var byte_in_sector = 0
  var sector_in_ring = 0
  var ring = rp.start_ring
  var sectors_in_this_ring = sectors_in_a_ring(ring, rp)

  for (var i = 0; i < array_of_bytes.length; i++) { // each character
    var v = array_of_bytes[i] ^ rp.xor_value // every second bit in byte, to remove runs of 0's
    render_a_byte(v, rp, ring, sectors_in_this_ring, sector_in_ring, byte_in_sector)

    byte_in_sector += 1
    if (byte_in_sector == rp.bytes_per_sector) { /* Move to next ring */
      sector_in_ring += 1
      if (sector_in_ring == sectors_in_this_ring) {
        ring += 1
        sectors_in_this_ring = sectors_in_a_ring(ring, rp)
        sector_in_ring = 0
      }
      byte_in_sector = 0
    }
  }
  var new_ring = (byte_in_sector == 0 && sector_in_ring == 0)
  if (rp.xor_value != 0 && !new_ring) {
    while (byte_in_sector < rp.bytes_per_sector) { // fill the last sector
      render_a_byte(rp.xor_value, rp, ring, sectors_in_this_ring, sector_in_ring, byte_in_sector)
      byte_in_sector += 1
    }
    sector_in_ring += 1 // move to next sector
    while (sector_in_ring < sectors_in_this_ring) { // remainder of sectors in this ring
      byte_in_sector = 0
      while (byte_in_sector < rp.bytes_per_sector) {
        render_a_byte(rp.xor_value, rp, ring, sectors_in_this_ring, sector_in_ring, byte_in_sector)
        byte_in_sector += 1
      }
      sector_in_ring += 1 // move to next sector
    }
  }

  if (rp.bounding_circle) {
    if (new_ring) ring -= 1
    drawRing(rp.center_x, rp.center_y, rp.ring_width * (ring + 1.2), rp.ring_width * 0.2, 'black') // bounding circle
  }
}

function render_centre_byte (rp, the_byte) {
  var parity = rp.which_parity == 'even' ? 0 : 1 // even or odd, ignore none
  var mask
  var lsb
  if (rp.bit_order == 'lsb') {
    mask = 1
    lsb = true
  } else {
    mask = 0x80
    lsb = false
  }
  for (var j = 0; j < 8; j++) {
    if ((the_byte & mask) == mask) {
      parity ^= 1
      drawCircleArc(rp, 0, rp.ring_width, 360 / rp.bits_per_byte * j, 360 / rp.bits_per_byte * (j + 1), rp.color_array[j])
    }
    if (lsb) the_byte >>>= 1
    else mask >>>= 1
  }
  if (parity == 1) {
    drawCircleArc(rp, 0, rp.ring_width, 360 / rp.bits_per_byte * 8, 360, rp.color_array[8])
  }
}

function parseInt_local (s) {
  if (s.substring(0, 2) == '0b') { return parseInt(s.substring(2), 2) } // 0b doesn't work in my browser.
  if (s.substring(0, 2) == '0a') { return s.substring(2, 3).charCodeAt(0) & 0xFF } // hack to indicate ascii
  return parseInt(s) // assume int10, 0x or 0
}

function draw_center (rp) {
  if (!rp.unrolled) {
    switch (the_form.center.value) {
      case 'double_circle':
        drawDoubleCircle(rp.center_x, rp.center_y, rp.ring_width, 'black')
        break
      case 'center_circle':
        drawCircle(rp.center_x, rp.center_y, rp.ring_width, 0, 'black')
        break
      case 'ring':
        drawRing(rp.center_x, rp.center_y, rp.ring_width * 0.9, rp.ring_width * 0.2, 'black')
        break
      case 'center_byte':
        render_centre_byte(rp, parseInt_local(the_form.center_byte_text.value))
        break
    }
  }
}

function encode_text (the_form) {
  var _svg = document.getElementById(svgId)
  while (_svg.lastChild) {
    _svg.removeChild(_svg.lastChild)
  }
  var start_ring = parseInt(the_form.start_ring.value)
  var ring_increment = parseInt(the_form.step_size.value)

  var ring_params = {
    center_x: 0,
    center_y: 0,
    start_ring: start_ring,
    bytes_per_sector: parseInt(the_form.bytes_per_sector.value),
    ring_increment: ring_increment,
    first_ring_offset: first_sector_for_ring(start_ring, ring_increment, the_form.exponential.checked),
    ring_width: parseInt(the_form.ring_width.value),

    counter_clockwise: the_form.counter_clockwise.checked,
    bit_order: the_form.bit_order.value,
    which_parity: the_form.parity.value,
    bits_per_byte: the_form.parity.value == 'none' ? 8 : 9,
    xor_value: the_form.xor.checked ? parseInt_local(the_form.xor_text.value) : 0,
    exponential: the_form.exponential.checked,

    color_array: the_form.color.checked ? colorArray : black_array,
    unrolled: the_form.unroll.checked,
    bounding_circle: the_form.bounding_circle.checked && !the_form.unroll.checked
  }

  var inputtext = the_form.inputtext.value
  if (inputtext == '') {
    inputtext = the_form.inputtext.placeholder
  }
  // console.log(inputtext)
  var radius = 100 + inputtext.length * 5
  var viewBox = [-radius, -radius, radius * 2, radius * 2]
  if (ring_params.unrolled) {
    viewBox = [0, 0, radius * 5, radius]
  }
  _svg.setAttribute('viewBox', viewBox.join(' '))

  draw_center(ring_params)
  render_bytes(encode_string_to_bits(inputtext), ring_params)
}

function init () {
  var the_form = document.getElementById('tool-form')
  set_table_color()
  encode_text(the_form)
}
