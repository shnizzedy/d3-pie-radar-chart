/* global d3, getRotateDegree, toDegree, getPercent, rotate, adjustTextAnchor */
const width = 400
const height = 400
const labelSpace = 50
const donutRadius = Math.min(width, height) / 2
const maxRadius = donutRadius + labelSpace
const colorScheme = d3.scaleOrdinal().range(['#0CA28F', '#1ce5cb', '#16dcc3', '#16c9b2', '#0cb19c', '#9ACFFF', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'])
const innerRadius = 90
const rotateDuration = 560
const svgTranslate = [width / 2 + labelSpace * 2, height / 2 + labelSpace * 2]

const data = [
  { label: 'Model A', value: 19 },
  { label: 'Model B', value: 31 },
  { label: 'Model C', value: 31 },
  { label: 'Model D', value: 8 },
  { label: 'Model E', value: 10 }
]

let total = 0
data.forEach((d) => { total += d.value })

const svg = d3.select('#donutchart')
  .append('svg')
  .attr('width', width + maxRadius)
  .attr('height', height + maxRadius)
  .append('g')
  .attr('transform', `translate(${svgTranslate[0]}, ${svgTranslate[1]})`)

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(donutRadius)

const borderArc = d3.arc()
  .innerRadius(donutRadius - 6)
  .outerRadius(donutRadius)

const donut = d3.pie()
  .sort(null)
  .value((d) => d.value)

const arcG = svg.selectAll('g.arc-g')
  .data(donut(data))
  .enter()
  .append('g')
  .attr('class', 'arc-g')

arcG.append('path')
  .attr('d', arc)
  .attr('fill', (d) => colorScheme(d.data.label))
  .attr('class', 'piece')

arcG.append('circle')
  .attr('cx', (d) => arc.centroid(d)[0] * 1.375)
  .attr('cy', (d) => arc.centroid(d)[1] * 1.375)
  .attr('r', 2.8)
  .attr('fill', '#077e6f')

arcG.append('text')
  .attr('class', 'label')
  .attr('dy', '.35em')
  .html((d) =>
    `${d.data.label}<tspan class="label-percent"> ${getPercent(d.data.value, total)}%</tspan>`
  )
  .attr('text-anchor', (d) =>
    (d.endAngle + d.startAngle) / 2 > Math.PI ? 'end' : 'strat'
  )
  .attr('transform', (d) => {
    const c = arc.centroid(d)
    const x = c[0] * 1.48
    const y = c[1] * 1.48
    return `translate(${x}, ${y})`
  })

const hoverPath = arcG.append('path')
  .attr('d', arc)
  .attr('fill', 'rgba(0, 0, 0, .1)')
  .attr('class', 'hide hover-layer')

const activeBorder = arcG.append('path')
  .attr('d', borderArc)
  .attr('fill', 'rgba(0, 0, 0, .16)')
  .attr('class', 'hide active-border')

function hoverPathClicked(d) {
  if (!this.classList.contains('hide')) return
  hoverPath.attr('class', 'hide hover-layer')
  activeBorder.attr('class', 'hide active-border')
  this.classList.remove('hide')
  d3.select(this.parentNode).select('.active-border').node().classList.remove('hide')
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
