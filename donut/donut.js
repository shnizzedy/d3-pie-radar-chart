/* global d3 */
const width = 400
const height = 400
const labelSpace = 50
const donutRadius = Math.min(width, height) / 2
const maxRadius = donutRadius + labelSpace
const colorScheme = d3.scaleOrdinal().range(['#099e8b', '#1ce5cb', '#16dcc3', '#16c9b2', '#0cb19c', '#9ACFFF', '#dd4477', '#66aa00', '#b82e2e', '#316395', '#994499', '#22aa99', '#aaaa11', '#6633cc', '#e67300', '#8b0707', '#651067', '#329262', '#5574a6', '#3b3eac'])
const innerRadius = 90

const data = [
  { label: 'Model A', value: 19 },
  { label: 'Model B', value: 31 },
  { label: 'Model C', value: 31 },
  { label: 'Model D', value: 8 },
  { label: 'Model E', value: 10 }
]

const svg = d3.select('#donutchart')
  .append('svg')
  .attr('width', width + maxRadius)
  .attr('height', height + maxRadius)
  .append('g')
  .attr('transform', `translate(${width / 2 + labelSpace * 2}, ${height / 2 + labelSpace * 2})`)

const arc = d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(donutRadius)

const donut = d3.pie()
  .sort(null)
  .value((d) => d.value)

const arcG = svg.selectAll('g.arc-g')
  .data(donut(data))
  .enter()
  .append('g')
  .attr('class', 'arc-g')

const path = arcG.append('path')
  .attr('d', arc)
  .attr('fill', (d) => colorScheme(d.data.label))
  .attr('class', 'piece')

