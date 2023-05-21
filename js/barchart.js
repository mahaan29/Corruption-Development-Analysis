class Barchart {
  /**
   * Class constructor with basic chart configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config, _data, _globalApplicationState) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 400,
      margin: _config.margin || { top: 15, right: 5, bottom: 20, left: 50 },
    };

    this.globalApplicationState = _globalApplicationState;
    this.data = _data;
    this.initVis();
  }

  /**
   * This function contains all the code that gets excecuted only once at the beginning.
   * (can be also part of the class constructor)
   * We initialize scales/axes and append static elements, such as axis titles.
   * If we want to implement a responsive visualization, we would move the size
   * specifications to the updateVis() function.
   */
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
    vis.xScale = d3.scaleLinear().range([0, vis.width]);

    vis.yScale = d3
        .scaleBand()
        .range([0, vis.height])
        .paddingInner(0.5)
        .paddingOuter(0.2);


    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0);

    vis.yAxis = d3.axisLeft(vis.yScale).tickSizeOuter(0).tickSizeInner(0);

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

    vis.chart
      .append("text")
      .attr("x", vis.width / 2)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text(" Avg. Corruption index score by income groups");


    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(80,${vis.height})`)

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(80, 0)");
  }

  /**
   * This function contains all the code to prepare the data before we render it.
   * In some cases, you may not need this function but when you create more complex visualizations
   * you will probably want to organize your code in multiple functions.
   */
  updateVis() {
    let vis = this;
    console.log(globalApplicationState.selectedYear)

    // Specify x- and y-accessor functions
    vis.xValue = (d) => d.Income_Group;
    vis.yValue = (d) =>
      d3.mean(
        vis.data.filter((e) => e.Income_Group === d.Income_Group),
        (d) => d.Average_CPI_Score
      );
    // Set the scale input domains
    vis.xScale.domain([0, 100]);
    vis.yScale.domain(vis.data.map(vis.xValue));

    vis.renderVis();
  }

  /**
   * This function contains the D3 code for binding data to visual elements.
   * We call this function every time the data or configurations change
   * (i.e., user selects a different year)
   */
  renderVis() {
    let vis = this;

    // Add rectangles
    vis.chart
      .selectAll(".bar")
      .data(vis.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", 80) // set x to 0
      .attr("y", (d) => vis.yScale(vis.xValue(d)))
      .attr("width", (d) => vis.xScale(vis.yValue(d)))
      .attr("height", vis.yScale.bandwidth())
        .on("mouseover", function (event, d) {
          d3.select(this)
              .style("fill", "orange");
          d3.select(this)
              .select("title")
              .style("visibility", "visible");
        })
        .on("mouseout", function (event, d) {
          d3.select(this)
              .style("fill", "steelblue");
          d3.select(this)
              .select("title")
              .style("visibility", "hidden");
        })
        .append("title")
        .text((d) => `Income Group: ${d.Income_Group}\nCorruption Score: ${d3.format(".2f")(vis.yValue(d))}`)
    ;


    // Update the axes because the underlying scales might have changed
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
