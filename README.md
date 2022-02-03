# D3 Pie Radar Chart

This repository is an example of what I had in mind when suggesting a "Trivial Pursuit piece"-style badge, visualizing [:octocat:nmind/coding-standards-certification checklists](https://github.com/nmind/coding-standards-certification/tree/master/checklists)

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

* [D3](https://d3js.org) v4 — The upstream project was written in v4, and this repository is just an illustration. I'd want to rewrite into v7 syntax if we were going to use this example for real.
