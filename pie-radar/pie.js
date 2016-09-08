/* global d3, getRotateDegree, toDegree, getPercent, rotate, adjustTextAnchor */
const width = 400
const height = 400
const labelSpace = 50
const pieRadius = Math.min(width, height) / 2
const maxRadius = pieRadius + labelSpace
const colorScheme = d3.scaleOrdinal().range(['#497BE0', '#518AF1', '#6699F4', '#77AFFF', '#8ABFFF', '#9ACFFF', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'])
const innerRadius = 3.5
const rotateDuration = 560
const svgTranslate = [width / 2 + labelSpace * 2, height / 2 + labelSpace * 2]

const data = [
  { label: 'JavaScript', value: 20, score: 65 },
  { label: 'Python', value: 35, score: 85 },
  { label: 'PHP', value: 10, score: 70 },
  { label: 'Go', value: 22, score: 90 },
  { label: 'Ruby', value: 6, score: 95 },
  { label: 'Java', value: 10, score: 40 }
]

let total = 0
data.forEach((d) => { total += d.value })

const svg = d3.select('#piechart')
  .append('svg')
  .attr('width', width + maxRadius)
  .attr('height', height + maxRadius)
  .append('g')
  .attr('transform', `translate(${svgTranslate[0]}, ${svgTranslate[1]})`)

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius((d) => d.data.score * 2)

const hoverArc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(pieRadius)

const pie = d3.pie()
  .sort(null)
  .value((d) => d.value)

const strokeWidth = 1

function drawCircle(r) {
  svg.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', r - strokeWidth)
    .attr('stroke', '#bbb')
    .attr('stroke-width', strokeWidth)
    .attr('fill', 'none')
}

drawCircle(pieRadius)
drawCircle(pieRadius / 5 * 4)
drawCircle(pieRadius / 5 * 3)
drawCircle(pieRadius / 5 * 2)
drawCircle(pieRadius / 5)

// real pie pieces
svg.append('g')
  .selectAll('path')
  .data(pie(data))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', (d) => colorScheme(d.data.label))

const hoverArcG = svg.selectAll('g.hover-arc-g')
  .data(pie(data))
  .enter()
  .append('g')
  .attr('class', 'hover-arc-g')

const hoverPath = hoverArcG.append('path')
  .attr('d', hoverArc)
  .attr('fill', 'rgba(0, 0, 0, .1)')
  .attr('class', 'hide hover-layer')

hoverArcG.append('text')
  .html((d) =>
    `${d.data.label}<tspan class="label-percent"> ${getPercent(d.data.value, total)}%</tspan>`
  )
  .attr('class', 'label')
  .attr('text-anchor', (d) =>
    (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'start'
  )
  .attr('transform', (d) => {
    const c = hoverArc.centroid(d)
    const x = c[0] * 2.1
    const y = c[1] * 2.1
    return `translate(${x}, ${y})`
  })

function hoverPathClicked(d) {
  if (!this.classList.contains('hide')) return
  hoverPath.attr('class', 'hide hover-layer')
  this.classList.remove('hide')
  const midAngle = (d.startAngle + d.endAngle) / 2
  const rotateDegree = getRotateDegree(midAngle)
  rotate(svg, rotateDegree, `translate(${svgTranslate[0]}, ${svgTranslate[1]})`)

  d3.selectAll('.label').each(function (e) {
    const el = d3.select(this)
    const orgTransform = el.attr('transform')
    const orgTranslate = orgTransform.substring(orgTransform.indexOf('(') + 1, orgTransform.indexOf(')')).split(',')
    const pieceDegree = toDegree((e.endAngle + e.startAngle) / 2)
    this.classList.add('hide')
    setTimeout(() => this.classList.remove('hide'), rotateDuration)
    rotate(el, rotateDegree * -1, `translate(${orgTranslate[0]}, ${orgTranslate[1]})`)
    adjustTextAnchor(el, pieceDegree, rotateDegree)
  })
}

hoverPath.on('click', hoverPathClicked)

// init state
hoverPathClicked.bind(d3.select('.hover-layer').node())(d3.select('.hover-layer').data()[0])
