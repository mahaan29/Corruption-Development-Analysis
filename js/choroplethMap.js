class ChoroplethMap {
  constructor(_config, _data, year) {
    this.config = {
      year: year,
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 900,
      containerHeight: _config.containerHeight || 900,
      margin: _config.margin || { top: 0, right: 0, bottom: 0, left: 0 },
      tooltipPadding: 10,
      legendBottom: 50,
      legendLeft: 50,
      legendRectHeight: 12,
      legendRectWidth: 150,
    };
    this.data = _data;
    this.initVis();
  }
  initVis() {
    let vis = this;

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
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

    // Initialize projection and path generator
    vis.projection = d3.geoMercator();
    vis.geoPath = d3.geoPath().projection(vis.projection);

    vis.colorScale = d3
      .scaleLinear()
      .range(["#cfe2f2", "#0d306b"])
      .interpolate(d3.interpolateHcl);

    // Initialize gradient that we will later use for the legend
    vis.linearGradient = vis.svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "legend-gradient");

    // Append legend
    vis.legend = vis.chart
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        `translate(${vis.config.legendLeft},${
          vis.height - vis.config.legendBottom
        })`
      );

    vis.legendRect = vis.legend
      .append("rect")
      .attr("width", vis.config.legendRectWidth)
      .attr("height", vis.config.legendRectHeight);

    vis.legendTitle = vis.legend
      .append("text")
      .attr("class", "legend-title")
      .attr("dy", ".35em")
      .attr("y", -10)
      .text("Corruption Index");

    vis.chart
      .append("text")
      .attr("x", vis.width / 2)
      .attr("y", 13)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("text-decoration", "underline")
      .text("CPI Map");

    vis.updateVis();
  }

  updateVis() {
    let vis = this;

    const CPIScore = d3.extent(
      vis.data.objects.countries.geometries,
      (d) => d.properties[`CPI_${vis.config.year}_Score`]
    );

    // Update color scale
    vis.colorScale.domain(CPIScore);

    // Define begin and end of the color gradient (legend)
    vis.legendStops = [
      { color: "#cfe2f2", value: CPIScore[0], offset: 0 },
      { color: "#0d306b", value: CPIScore[1], offset: 100 },
    ];

    vis.renderVis();
  }

  renderVis() {
    let vis = this;
    // Convert compressed TopoJSON to GeoJSON format
    const countries = topojson.feature(vis.data, vis.data.objects.countries);

    // Defines the scale of the projection so that the geometry fits within the SVG area
    vis.projection.fitSize([vis.width, vis.height], countries);

    // Append world map
    const countryPath = vis.chart
      .selectAll(".country")
      .data(countries.features)
      .join("path")
      .attr("class", "country")
      .attr("d", vis.geoPath)
      .attr("fill", (d) => {
        if (d.properties[`CPI_${vis.config.year}_Score`]) {
          return vis.colorScale(d.properties[`CPI_${vis.config.year}_Score`]);
        } else {
          return "#D3D3D3";
        }
      });

    countryPath
      .on("mousemove", (event, d) => {
        const CPI_Score = d.properties[`CPI_${vis.config.year}_Score`]
          ? `CPI Score: <strong>${d.properties[`CPI_${vis.config.year}_Score`]}</strong> `
          : "No data available";
        d3
          .select("#tooltip")
          .style("display", "block")
          .style("opacity", 1)
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <div class="tooltip-title">${d.properties.name}</div>
              <div>${CPI_Score}</div>
            `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      })
      .on("click", (event, d) => {
        updated_mapClickCountry(d.properties.name);
        updateLine();
        // console.log(d3.selectAll('.country'))
        d3.select("#map")
          .selectAll(".country")
          .attr("opacity", (d) => {
            if (
              mapClickCountry.includes(d.properties.name) ||
              mapClickCountry.length == 0
            ) {
              return 1;
            } else {
              return 0.5;
            }
          })
          .attr("stroke", (d) => {
          if (
              mapClickCountry.includes(d.properties.name) ||
              mapClickCountry.length == 0
          ) {
            return '#000000';
          } else {
            return 0;
          }
        });
        if (mapClickCountry.length == 0) {
          resetButton();
        }
        // console.log(d)
      });

    // Add legend labels
    vis.legend
      .selectAll(".legend-label")
      .data(vis.legendStops)
      .join("text")
      .attr("class", "legend-label")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("y", 20)
      .attr("x", (d, index) => {
        return index == 0 ? 0 : vis.config.legendRectWidth;
      })
      .text((d) => Math.round(d.value * 10) / 10);

    // Update gradient for legend
    vis.linearGradient
      .selectAll("stop")
      .data(vis.legendStops)
      .join("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color);

    vis.legendRect.attr("fill", "url(#legend-gradient)");
  }
}
