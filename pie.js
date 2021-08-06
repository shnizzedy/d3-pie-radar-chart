/* The wedges in the pie */
const wedges = ['Coding', 'Testing', 'Performance', 'Terminology', 'Documentation'];

/** Function to take an object of {label: tier} items and generate a pie radar plot of that object with the wedges as defined above.
 * @param {object} initialData The initial data with {label: tier} items, e.g. {'Coding': 'bronze'}
 * @returns null
 */
function pieRadar(initialData) {
  /* Restructure data for D3 ease */ 
  const data = wedges.map(d => {
    if (Object.keys(initialData).includes(d)) {
      return { 'label': d, 'tier': initialData[d] }
    }
    return { 'label': d }
  });
  /* global d3, getRotateDegree, toDegree, getPercent, rotate, adjustTextAnchor */
  const width = 400
  const height = 400
  const labelSpace = 50
  const pieRadius = Math.min(width, height) / 2
  const maxRadius = pieRadius + labelSpace
  const tiers = {
    gold: {
      color: 'gold',
      wedge: 100
    },
    silver: {
      color: 'silver',
      wedge: 200/3
    },
    bronze: {
      color: '#b08d57',
      wedge: 100/3
    },
    null: {
      color: '#fff',
      wedge: 0
    }
  }
  tiers.undefined = tiers.null;
  const innerRadius = 3.5
  const rotateDuration = 560
  const svgTranslate = [width / 2 + labelSpace * 2, height / 2 + labelSpace * 2]

  let total = 0
  data.forEach((d) => { total += (100 / wedges.length) })

  const svg = d3.select('#piechart')
    .append('svg')
    .attr('width', width + maxRadius)
    .attr('height', height + maxRadius)
    .append('g')
    .attr('transform', `translate(${svgTranslate[0]}, ${svgTranslate[1]})`)

  const arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius((d) => tiers[d.data.tier].wedge * 2)

  const hoverArc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(pieRadius)

  const pie = d3.pie()
    .sort(null)
    .value(100 / wedges.length)

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

  /* draw circumference outlines */
  drawCircle(pieRadius) // gold
  drawCircle(pieRadius / 3 * 2) // silver
  drawCircle(pieRadius / 3) // bronze

  // real pie pieces
  svg.append('g')
    .selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d) => tiers[d.data.tier].color)

  const hoverArcG = svg.selectAll('g.hover-arc-g')
    .data(pie(data))
    .enter()
    .append('g')
    .attr('class', 'hover-arc-g')

  const hoverPath = hoverArcG.append('path')
    .attr('d', hoverArc)
    .attr('fill', 'rgba(0, 0, 0, .06)')
    .attr('class', 'hide hover-layer')

  // hoverArcG.append('circle')
  //   .attr('cx', (d) => hoverArc.centroid(d)[0] * 1.96)
  //   .attr('cy', (d) => hoverArc.centroid(d)[1] * 1.96)
  //   .attr('r', 2.8)
  //   .attr('fill', '#33abd6')

  hoverArcG.append('text')
    .html((d) => d.data.label)
    .attr('class', 'label')
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle')
    .attr('transform', (d) => `translate(${hoverArc.centroid(d)})`)

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
      // adjustTextAnchor(el, pieceDegree, rotateDegree)
    })
  }

  hoverPath.on('click', hoverPathClicked)

  // init state
  hoverPathClicked.bind(d3.select('.hover-layer').node())(d3.select('.hover-layer').data()[0])
}

// Load example pie radar chart with example data
d3.json('./example.json', pieRadar);