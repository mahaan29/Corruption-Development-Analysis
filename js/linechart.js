class LinePlot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 900,
      containerHeight: _config.containerHeight || 380,
      margin: _config.margin || { top: 35, right: 40, bottom: 40, left: 40 },
      tooltipPadding: _config.tooltipPadding || 15,
      textWidth: _config.textWidth || 70,
    };
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
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    vis.xScale = d3.scaleBand().range([0, vis.width]);

    vis.xAxis = d3
        .axisBottom(vis.xScale)
        .tickSize(-vis.height)
        .tickPadding(0);
    vis.colors = [
      "#8dd3c7",
      "#fdfd01",
      "#bebada",
      "#fb8072",
      "#80b1d3",
      "#fdb462",
      "#b3de69",
      "#fccde5",
      "#d9d9d9",
      "#bc80bd",
      "#ccebc5",
      "#ffed6f",
    ];

    vis.yAxis = d3
        .axisLeft(vis.yScale)
        .ticks(10)
        .tickSize(-vis.width)
        .tickPadding(10);
    // .tickSize(-vis.width);
    vis.svg = d3
        .select(vis.config.parentElement)
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight);

    vis.chart = vis.svg
        .append("g")
        .attr(
            "transform",
            `translate(${vis.config.margin.left},${vis.config.margin.top})`
        );

    vis.chart
        .append("text")
        .attr("x", vis.width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Change in corruption index over time");

    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisG = vis.chart
        .append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${vis.height})`);

    // Append y-axis group
    vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");
    vis.svg
        .append("g")
        .append("text")
        .attr(
            "transform",
            `translate(${vis.config.margin.left},${vis.config.margin.top})`
        )
        .attr("x", vis.width)
        .attr("y", vis.height)
        .text("year");
    vis.svg
        .append("g")
        .append("text")
        // .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`)
        .attr("x", vis.config.margin.left / 4)
        .attr("y", 20)
        .text("CPI");

    vis.updateVis();
  }
  updateVis() {
    let vis = this;
    console.log(vis.data, "1122");
    vis.data.sort((a, b) => {
      return a.year - b.year;
    });
    let countryGroup = d3.groups(vis.data, (d) => d.country);
    //console.log(countryGroup)
    if (countryGroup.length > 12) {
      alert("Only a maximum of 12 countries can be selected at the same time");
      return;
    }
    console.log(countryGroup);
    // debugger
    vis.countryGroup = countryGroup;
    let xdomain = [];
    let yearGroup = d3.groups(vis.data, (d) => d.year);
    yearGroup.forEach((item) => {
      xdomain.push(item[0]);
    });
    xdomain.sort((a, b) => {
      return a - b;
    });
    vis.xScale.domain(xdomain);
    vis.yScale.domain([
      d3.min(vis.data, (d) => d.CPI) - 1,
      d3.max(vis.data, (d) => d.CPI),
    ]);
    vis.line = d3
        .line()
        .x((d) => {
          return vis.xScale(d.year) + vis.xScale.bandwidth() / 2;
        })
        .y((d) => vis.yScale(d.CPI));
    vis.renderVis();
  }
  renderVis() {
    let vis = this;
    // let lineG = vis.append('g').attr('class','lines')
    console.log(vis.countryGroup, "rend");
    vis.chart
        .selectAll(".line")
        .data(vis.countryGroup)
        .join("path")
        .attr("class", "line")
        .attr("stroke-width", 2)
        .attr("d", (d) => {
          //console.log(vis.line(d[1]))
          return vis.line(d[1]);
        })
        .attr("stroke", (d, i) => {
          return vis.colors[i];
        })
        .attr("fill", "none")
        .on("click", (event, line) => {
          // debugger
          if (mapClickCountry.length) {
            mapClickCountry = mapClickCountry.filter((d) => {
              return d != line[0];
            });
            if (mapClickCountry.length) {
              updateLine();
            } else {
              resetButton();
            }
            d3.select("#map")
                .selectAll(".country")
                .attr("opacity", (d) => {
                  // console.log(d)
                  if (
                      mapClickCountry.includes(d.properties.name) ||
                      mapClickCountry.length == 0
                  ) {
                    return 1;
                  } else {
                    return 0.5;
                  }
                });
          }
        });
    vis.chart
        .selectAll(".points")
        .data(vis.countryGroup)
        .join("g")
        .attr("class", "points")
        .attr("fill", (d, i) => {
          return vis.colors[i];
        })
        .selectAll(".point")
        .data((d) => d[1])
        .join("circle")
        .attr("class", "point")
        .attr("cx", (d) => {
          return vis.xScale(d.year) + vis.xScale.bandwidth() / 2;
        })
        .attr("cy", (d) => vis.yScale(d.CPI))
        .attr("r", 5)
        .on("mouseover", (e, d) => {
          d3.select("#tooltip")
              .style("opacity", 1)
              .style("display", "block")
              .style("left", e.pageX + vis.config.tooltipPadding + "px")
              .style("top", e.pageY + vis.config.tooltipPadding + "px")
              .html(
                  `<div class="tooltip-title">${d.country}</div><div>${d.CPI}</div>`
              );
        })
        .on("mouseout", () => {
          d3.select("#tooltip").style("display", "none");
        });
    vis.chart
        .selectAll(".lend")
        .data(vis.countryGroup)
        .join("circle")
        .attr("class", "lend")
        .attr("cx", (d, i) => {
          return 20 + i * vis.config.textWidth;
        })
        .attr("cy", vis.height+15)
        .attr("r", 4)
        .attr("fill", (d, i) => {
          return vis.colors[i];
        });

    vis.chart
        .selectAll(".country")
        .data(vis.countryGroup)
        .join("text")
        .attr("class", "country")
        .attr("x", (d, i) => {
          return 30 + i * vis.config.textWidth;
        })
        .attr("y", vis.height+20)
        .attr("font-size", "10")
        .text((d, i) => {
          return d[0];
        });
    vis.xAxisG.call(vis.xAxis);
    vis.yAxisG.call(vis.yAxis);
  }
}
