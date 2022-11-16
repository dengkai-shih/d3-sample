// https://observablehq.com/@d3/bollinger-bands@542
import define1 from "./7a9e12f9fb3d8e06@459.js";

function _1(md){return(
md`# Line Chart, Bollinger Bands

This time series [line chart](/@d3/line-chart) includes [Bollinger bands](https://en.wikipedia.org/wiki/Bollinger_Bands): simple, lagging [moving averages](https://en.wikipedia.org/wiki/Moving_average) for characterizing volatility. Try dragging the sliders below to get a sense of the parameters. Data: [Yahoo Finance](https://finance.yahoo.com/lookup)`
)}

function _N(Inputs){return(
Inputs.range([2, 100], {value: 20, step: 1, label: "Periods (N)"})
)}

function _K(Inputs){return(
Inputs.range([0, 10], {value: 2, step: 0.1, label: "Deviations (K)"})
)}

function _chart(BollingerChart,aapl,N,K,width){return(
BollingerChart(aapl, {
  x: d => d.date,
  y: d => d.close,
  N, // number of periods, per input above
  K, // number of standard deviations, per input above
  yLabel: "↑ Daily close ($)",
  width,
  height: 600
})
)}

function _aapl(FileAttachment){return(
FileAttachment("aapl.csv").csv({typed: true})
)}

function _6(howto){return(
howto("BollingerChart")
)}

function _7(altplot){return(
altplot(`Plot.plot({
  y: {
    grid: true,
    label: "↑ close ($)"
  },
  marks: [
    Plot.lineY(aapl, {x: "date", y: "close", stroke: "#eee"}),
    Plot.lineY(aapl, Plot.windowY({x: "date", y: "close", k: 20, anchor: "end", stroke: "green", reduce: V => d3.mean(V) - 2 * d3.deviation(V)})),
    Plot.lineY(aapl, Plot.windowY({x: "date", y: "close", k: 20, anchor: "end", stroke: "blue"})),
    Plot.lineY(aapl, Plot.windowY({x: "date", y: "close", k: 20, anchor: "end", stroke: "red", reduce: V => d3.mean(V) + 2 * d3.deviation(V)}))
  ]
})`)
)}

function _BollingerChart(d3){return(
function BollingerChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  N = 20, // number of periods for rolling mean
  K = 2, // number of standard deviations to offset each band
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  colors = ["#aaa", "green", "blue", "red"], // color of the 4 lines
  strokeWidth = 1.5, // width of lines, in pixels
  strokeLinecap = "round", // stroke line cap of lines
  strokeLinejoin = "round" // stroke line join of lines
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = d3.scaleUtc(xDomain, xRange);
  const yScale = d3.scaleLinear(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(null, yFormat);

  // Construct a line generator.
  const line = d3.line()
      .defined((y, i) => !isNaN(X[i]) && !isNaN(y))
      .curve(curve)
      .x((y, i) => xScale(X[i]))
      .y((y, i) => yScale(y));

  function bollinger(N, K) {
    return values => {
      let i = 0;
      let sum = 0;
      let sum2 = 0;
      const Y = new Float64Array(values.length).fill(NaN);
      for (let n = Math.min(N - 1, values.length); i < n; ++i) {
        const value = values[i];
        sum += value, sum2 += value ** 2;
      }
      for (let n = values.length; i < n; ++i) {
        const value = values[i];
        sum += value, sum2 += value ** 2;
        const mean = sum / N;
        const deviation = Math.sqrt((sum2 - sum ** 2 / N) / (N - 1));
        Y[i] = mean + deviation * K;
        const value0 = values[i - N + 1];
        sum -= value0, sum2 -= value0 ** 2;
      }
      return Y;
    };
  }

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic; overflow: visible;");

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", strokeWidth)
      .attr("stroke-linejoin", strokeLinejoin)
      .attr("stroke-linecap", strokeLinecap)
    .selectAll()
    .data([Y, ...[-K, 0, +K].map(K => bollinger(N, K)(Y))])
    .join("path")
      .attr("stroke", (d, i) => colors[i])
      .attr("d", line);

  return svg.node();
}
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["aapl.csv", {url: new URL("./files/de259092d525c13bd10926eaf7add45b15f2771a8b39bc541a5bba1e0206add4880eb1d876be8df469328a85243b7d813a91feb8cc4966de582dc02e5f8609b7", import.meta.url), mimeType: null, toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("viewof N")).define("viewof N", ["Inputs"], _N);
  main.variable(observer("N")).define("N", ["Generators", "viewof N"], (G, _) => G.input(_));
  main.variable(observer("viewof K")).define("viewof K", ["Inputs"], _K);
  main.variable(observer("K")).define("K", ["Generators", "viewof K"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["BollingerChart","aapl","N","K","width"], _chart);
  main.variable(observer("aapl")).define("aapl", ["FileAttachment"], _aapl);
  main.variable(observer()).define(["howto"], _6);
  main.variable(observer()).define(["altplot"], _7);
  main.variable(observer("BollingerChart")).define("BollingerChart", ["d3"], _BollingerChart);
  const child1 = runtime.module(define1);
  main.import("howto", child1);
  main.import("altplot", child1);
  return main;
}
