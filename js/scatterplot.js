class Scatterplot {
  /**
   * Class constructor with basic chart configuration
   * @param _config
   * @param _data
   */
  constructor(_config, _data, _globalApplicationState) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 45, right: 20, bottom: 20, left: 35 },
      tooltipPadding: _config.tooltipPadding || 15,
    };

    this.globalApplicationState = _globalApplicationState;
    this.data = _data;

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Initialize scales
    vis.colorScale = d3
      .scaleOrdinal()
      .range(["red", "purple", "green", "blue", "yellow", "pink", "orange"])
      .domain([
        "East Asia & Pacific",
        "Latin America & Caribbean",
        "Europe & Central Asia",
        "Middle East & North Africa",
        "Sub-Saharan Africa",
        "North America",
        "South Asia",
      ]);

    vis.xScale = d3.scaleLinear().range([0, vis.width]);

    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    // Initialize axes
    vis.xAxis = d3
      .axisBottom(vis.xScale)
      .ticks(6)
      .tickSize(-vis.height - 10)
      .tickPadding(10);

    vis.yAxis = d3
      .axisLeft(vis.yScale)
      .ticks(6)
      .tickSize(-vis.width - 10)
      .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");

    vis.chart
      .append("text")
      .attr("x", vis.width / 2 + 10)
      .attr("y", -18)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("Unemployment rate v. CPI Score by Countries");

    // Append both axis titles
    vis.chart
      .append("text")
      .attr("class", "axis-title")
      .attr("y", vis.height - 15)
      .attr("x", vis.width + 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Unemployment Rate");

    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", 0)
      .attr("y", +10)
      .attr("dy", ".71em")
      .text("Corruption Perception");
  }

  updateVis() {
    let vis = this;
    const yearSelected = globalApplicationState.selectedYear;

    // Specificy accessor functions
    vis.colorValue = (d) => d.Region;
    vis.xValue = (d) => d.Average_Unemployment_Rate;
    vis.yValue = (d) => d[`CPI_${yearSelected}_Score`];

    // Set the scale input domains
    vis.xScale.domain([0, d3.max(vis.data, vis.xValue)]);
    vis.yScale.domain([0, d3.max(vis.data, vis.yValue)]);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;
    const yearSelected = globalApplicationState.selectedYear;

    // Add circles
    let circles = vis.chart
      .selectAll(".point")
      .data(vis.data, (d) => d.Country)
      .join("circle")
      .attr("class", "point")
      .attr("r", 5)
      .attr("opacity", 0.5)
      .attr("cy", (d) => vis.yScale(vis.yValue(d)))
      .attr("cx", (d) => vis.xScale(vis.xValue(d)))
      .attr("fill", (d) => vis.colorScale(vis.colorValue(d)));

    let xScale = d3
      .scaleLinear()
      .domain([0, d3.max(vis.data, vis.xValue)])
      .range([0, vis.width]);
    let yScale = d3
      .scaleLinear()
      .domain([0, d3.max(vis.data, vis.yValue)])
      .range([vis.height, 0]);
    // Define the line function
    // Perform the linear regression
    let regression = d3r
      .regressionLinear()
      .x((d) => d.Average_Unemployment_Rate)
      .y((d) => d[`CPI_${yearSelected}_Score`])
      .domain([0, 100])(vis.data);

    // Define the line function
    let line = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]));

    vis.chart.selectAll(".line").remove();
    //vis.chart.selectAll("text").remove();

    // Draw the regression line
    // Add the regression line
    vis.chart
      .selectAll(".line")
      .data([regression])
      .join("path")
      .attr("class", "line")
      .attr("d", (d) => line(d))
      .attr("stroke", "black");

    // let rsquared = regression.rSquared.toFixed(3);
    // console.log(rsquared);
    //
    // vis.chart.append("text")
    //     .attr("class", "r-squared")
    //     .attr("x", vis.width - 150)
    //     .attr("y", yScale(regression.predict(80)) + 15)
    //     .text(`R-squared: ${rsquared}`);

    // Tooltip event listeners
    circles
      .on("mouseover", (event, d) => {
        d3.select("#tooltip")
          .style("opacity", 1)
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px")
          .html(`<div class="tooltip-title">${d.Country}</div>`);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      });

    // Update the axes/gridlines
    vis.xAxisG.call(vis.xAxis);

    vis.yAxisG.call(vis.yAxis);
  }
}
