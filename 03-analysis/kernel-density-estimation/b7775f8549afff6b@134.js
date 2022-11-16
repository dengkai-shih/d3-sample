// https://observablehq.com/@d3/kernel-density-estimation@134
function _1(md){return(
md`# Kernel Density Estimation

[Kernel density estimation](https://en.wikipedia.org/wiki/Kernel_density_estimation), or KDE, estimates the probability distribution of a random variable. The kernel’s *bandwidth* determines the estimate’s smoothness: if the bandwidth is too small, the estimate may include spurious bumps and wiggles; too large, and the estimate reveals little about the underlying distribution.

This example, based on [work by John Firebaugh](https://bl.ocks.org/jfirebaugh/900762), shows times between eruptions of [Old Faithful](https://en.wikipedia.org/wiki/Old_Faithful). See also a [two-dimensional density estimation](/@d3/density-contours) of this data.`
)}

function _bandwidth(Inputs){return(
Inputs.range([1, 20], {value: 7, step: 0.1, label: "Bandwidth"})
)}

function _chart(d3,width,height,bins,x,y,data,density,line,xAxis,yAxis)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  svg.append("g")
      .attr("fill", "#bbb")
    .selectAll("rect")
    .data(bins)
    .join("rect")
      .attr("x", d => x(d.x0) + 1)
      .attr("y", d => y(d.length / data.length))
      .attr("width", d => x(d.x1) - x(d.x0) - 1)
      .attr("height", d => y(0) - y(d.length / data.length));

  svg.append("path")
      .datum(density)
      .attr("fill", "none")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("d", line);

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
}


function _kde(d3){return(
function kde(kernel, thresholds, data) {
  return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
}
)}

function _epanechnikov(){return(
function epanechnikov(bandwidth) {
  return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
}
)}

function _line(d3,x,y){return(
d3.line()
    .curve(d3.curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]))
)}

function _x(d3,data,margin,width){return(
d3.scaleLinear()
    .domain(d3.extent(data)).nice()
    .range([margin.left, width - margin.right])
)}

function _y(d3,bins,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length) / data.length])
    .range([height - margin.bottom, margin.top])
)}

function _xAxis(height,margin,d3,x,width,data){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .call(g => g.append("text")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "end")
        .attr("font-weight", "bold")
        .text(data.title))
)}

function _yAxis(margin,d3,y){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(null, "%"))
    .call(g => g.select(".domain").remove())
)}

function _thresholds(x){return(
x.ticks(40)
)}

function _density(kde,epanechnikov,bandwidth,thresholds,data){return(
kde(epanechnikov(bandwidth), thresholds, data)
)}

function _bins(d3,x,thresholds,data){return(
d3.bin()
    .domain(x.domain())
    .thresholds(thresholds)
  (data)
)}

async function _data(FileAttachment){return(
Object.assign(await FileAttachment("faithful.json").json(), {title: "Time between eruptions (min.)"})
)}

function _height(){return(
500
)}

function _margin(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["faithful.json", {url: new URL("./files/0e03c99b37791436e0cb486d09934b5aa6b6e000947328a81817caba4c5abf1e06276e260f42d089b9067e3e5cdd1a88c441c7193bbadc8b3a07503fd14bd7d7", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof bandwidth")).define("viewof bandwidth", ["Inputs"], _bandwidth);
  main.variable(observer("bandwidth")).define("bandwidth", ["Generators", "viewof bandwidth"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","bins","x","y","data","density","line","xAxis","yAxis"], _chart);
  main.variable(observer("kde")).define("kde", ["d3"], _kde);
  main.variable(observer("epanechnikov")).define("epanechnikov", _epanechnikov);
  main.variable(observer("line")).define("line", ["d3","x","y"], _line);
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], _x);
  main.variable(observer("y")).define("y", ["d3","bins","data","height","margin"], _y);
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width","data"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y"], _yAxis);
  main.variable(observer("thresholds")).define("thresholds", ["x"], _thresholds);
  main.variable(observer("density")).define("density", ["kde","epanechnikov","bandwidth","thresholds","data"], _density);
  main.variable(observer("bins")).define("bins", ["d3","x","thresholds","data"], _bins);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("margin")).define("margin", _margin);
  return main;
}
