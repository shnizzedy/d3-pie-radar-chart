# D3 Pie Radar Chart

This repository is an example of what I had in mind when suggesting a "Trivial Pursuit piece"-style badge.

Adapted from [D3 Chart Samples](https://github.com/CodinCat/d3-chart-samples) by **[@CodinCat](https://github.com/CodinCat)**

## Usage

With a data object like [example.json](./example.json), simply pass that data object to `pieRadar`.

### Examples

```JS
const data = {
  "Coding": "bronze",
  "Documentation": "bronze"
};
pieRadar(data);
```

```JS
d3.json('./example.json', pieRadar);
```

[Live Demo](https://shnizzedy.github.io/d3-pie-radar-chart/)

## Dependencies

* [D3](https://d3js.org) v4+