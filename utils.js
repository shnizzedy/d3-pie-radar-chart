/* eslint-disable no-unused-vars */

const offDegree = 35

function toDegree(rad) {
  return rad * (180 / Math.PI)
}

function getPercent(value, total) {
  return Math.round(value / total * 100)
}

function getRotateDegree(angle) {
  return 360 - toDegree(angle) + offDegree
}

function rotate(el, degree, orgTransform = '', rotateDuration = 560) {
  el.transition()
    .duration(rotateDuration)
    .attr('transform', () => `${orgTransform} rotate(${degree})`)
}

function adjustTextAnchor(el, pieceDegree, rotateDegree) {
  let finalDegree = pieceDegree + rotateDegree
  if (finalDegree > 360) {
    finalDegree -= 360
  }
  if (finalDegree < 180) {
    el.attr('text-anchor', 'start')
  } else {
    el.attr('text-anchor', 'end')
  }
}
