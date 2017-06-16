const toArray = (pseudoArray) => [].slice.call(pseudoArray)

const getMiddle = (a, b) => {
  var getMiddle
  if (a > b) {
    middle = b + ((a - b) / 2)
  } else {
    middle = a + ((b - a) / 2)
  }
  return Math.trunc(middle)
}

const getCenter = (el) => {
  const { offsetTop, offsetLeft, offsetHeight, offsetWidth } = el
  const top = offsetTop
  const bottom = top + offsetHeight
  const left = offsetLeft
  const right = left + offsetWidth
  const x = getMiddle(left, right)
  const y = getMiddle(top, bottom)
  return { x, y }
}

const square = (num) => Math.pow(num, 2)
const root = (num) => Math.pow(num, 0.5)

const getWidthAndAngle = (a, b) => {
  var angle, width
  const { x: xA, y: yA } = a
  const { x: xB, y: yB } = b

  // Vertical relation
  if (xA === xB) {
    width = Math.abs(yA - yB)
    angle = 90
    return { width, angle }
  }

  const adjacent = Math.abs(xA - xB)
  const opposite = Math.abs(yA - yB)
  const hypotenuse = root(square(adjacent) + square(opposite))
  // acos returns an angle in Radians, thus the conversion
  // https://en.wikipedia.org/wiki/Radian#Conversion_between_radians_and_degrees
  angle = Math.acos(adjacent / hypotenuse) * 180 / Math.PI
  if (xA < xB) angle = -angle
  angle = Math.trunc(angle)
  return { width: hypotenuse, angle }
}

const getPositionData = (subject, object) => {
  const subjectCenter = getCenter(document.getElementById(subject))
  const objectCenter = getCenter(document.getElementById(object))
  const relationCenterX = getMiddle(subjectCenter.x, objectCenter.x)
  const relationCenterY = getMiddle(subjectCenter.y, objectCenter.y)
  const { width, angle } = getWidthAndAngle(subjectCenter, objectCenter)
  return { relationCenterX, relationCenterY, width, angle }
}

const joinStyle = (styleObj) => {
  return Object.keys(styleObj)
  .reduce((style, attribute) => {
    style += `${attribute}: ${styleObj[attribute]};`
    return style
  }, '')
}

const recalculateRelationsPositions = function () {
  toArray(document.getElementsByClassName('relation'))
  .forEach(el => {
    const subject = el.attributes['data-subject'].value
    const property = el.attributes['data-property'].value
    const object = el.attributes['data-object'].value
    const height = 30
    const { relationCenterX, relationCenterY, width, angle } = getPositionData(subject, object)
    const style = {
      top: (relationCenterY - height / 2) + 'px',
      left: (relationCenterX - width / 2) + 'px',
      transform: `rotate(${angle}deg)`,
      height: height + 'px',
      width: width + 'px'
    }
    el.textContent = property
    el.style = joinStyle(style)
  })
}

window.onresize = recalculateRelationsPositions

recalculateRelationsPositions()
