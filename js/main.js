//when map Click ,push Country_Code to this,when reset button click ,this arr is clear,this array maxlength 12
let mapClickCountry = [];
let countryDatas = [];
let LineChart;
let scatterplot;
let barchart;
let scatdata;
let data;
/**
 * Load data from CSV file asynchronously and render scatter plot
 */
d3.csv("data/data.csv")
    .then((_data) => {
        data = _data;
        // Convert strings to numbers
        data.forEach((d) => {
            d.CPI_2016_Score = +d.CPI_2016_Score;
            d.CPI_2015_Score = +d.CPI_2015_Score;
            d.CPI_2014_Score = +d.CPI_2014_Score;
            d.CPI_2013_Score = +d.CPI_2013_Score;
            d.CPI_2012_Score = +d.CPI_2012_Score;
            d.Average_CPI_Score = +d.Average_CPI_Score;
            d.Unemployment_Rate_2016 = +d.Unemployment_Rate_2016;
            d.Average_Unemployment_Rate = +d.Average_Unemployment_Rate;
        });
        scatdata = data;

        // Initialize charts
        scatterplot = new Scatterplot({ parentElement: "#scatterplot" }, scatdata, globalApplicationState);
        barchart = new Barchart({ parentElement: "#barchart" }, data, globalApplicationState);

        // Show charts
        scatterplot.updateVis();
        barchart.updateVis();

    })
    .catch((error) => console.error(error));


d3.csv("data/cpi_r.csv")
    .then((_data) => {
        data = _data;
        // Convert strings to numbers
        data.forEach((d) => {
            d.CPI_2016_Score = +d.CPI_2016_Score;
            d.CPI_2015_Score = +d.CPI_2015_Score;
            d.CPI_2014_Score = +d.CPI_2014_Score;
            d.CPI_2013_Score = +d.CPI_2013_Score;
            d.CPI_2012_Score = +d.CPI_2012_Score;
        });
        countryDatas = data;

        // Initialize charts
        const lineplot = new LinePlot({ parentElement: "#linechart" }, []);
        LineChart = lineplot;

        globalApplicationState.bar = barchart;
        globalApplicationState.scatter = scatterplot;

        // Show charts
        lineplot.updateVis();
        lineplot.data = LineDataForRige(data);
        lineplot.config.textWidth = 70;
        lineplot.updateVis();

    })
    .catch((error) => console.error(error));


d3.selectAll(".legend-e").on("click", function () {
    // Toggle 'inactive' class
    d3.select(this).classed("inactive", !d3.select(this).classed("inactive"));

    // Check which categories are active
    let selectedRegion = [];
    d3.selectAll(".legend-e:not(.inactive)").each(function () {
        selectedRegion.push(d3.select(this).attr("data-region"));
    });

    // Filter data accordingly and update vis
    scatterplot.data = data.filter((d) => selectedRegion.includes(d.Region));
    scatterplot.updateVis();
    console.log(scatterplot.data, "scatdata");
});
d3.selectAll(".legend-e").on("click", function () {
    // Check if the clicked legend item is already active
    if (d3.select(this).classed("active")) {
        // Remove 'active' class from the clicked legend item
        d3.select(this).classed("active", false);

        // Filter data for all regions and update vis
        scatterplot.data = data;
        scatterplot.updateVis();
        console.log(scatterplot.data, "scatdata");
    } else {
        // Remove 'active' class from all legend items
        d3.selectAll(".legend-e").classed("active", false);

        // Add 'active' class to the clicked legend item
        d3.select(this).classed("active", true);

        // Get the selected region
        let selectedRegion = d3.select(this).attr("data-region");

        // Filter data for the selected region and update vis
        scatterplot.data = data.filter((d) => d.Region === selectedRegion);
        scatterplot.updateVis();
        console.log(scatterplot.data, "scatdata");
    }
});

Promise.all([d3.json("data/countries-110m.json"), d3.csv("data/cpi_r.csv")])
    .then((data) => {
        const geoData = data[0];
        const countryData = data[1];

        d3.select("#radius-slider").on("input", function () {
            // Update label
            d3.select("#radius-value").text(this.value);
            globalApplicationState.selectedYear = d3.select(this).property('value')
            barchart.updateVis()
            scatterplot.updateVis()
            updateMap(globalApplicationState.selectedYear)
        });



        function updateMap(yearSelected) {
            // Modify the data.csv file to include the CPI score for the selected year
            geoData.objects.countries.geometries.forEach((d) => {
                for (let i = 0; i < countryData.length; i++) {
                    if (d.properties.name == countryData[i].Country) {
                        d.properties[`CPI_${yearSelected}_Score`] = +countryData[i][`CPI_${yearSelected}_Score`];
                    }
                }
            });

            console.log(geoData.objects.countries.geometries);
            // Combine both datasets by adding the CPI score to the GeoJSON file
            const choroplethMap = new ChoroplethMap(
                {
                    parentElement: "#map",
                },
                geoData, yearSelected
            );

            choroplethMap.updateVis();
        }
        updateMap("2016");
    })
    .catch((error) => console.error(error));

function LineDataTool(data) {
    let result = [];
    data.forEach((d) => {
        let _2016 = d.CPI_2016_Score;
        let _2015 = d.CPI_2015_Score;
        let _2014 = d.CPI_2014_Score;
        let _2013 = d.CPI_2013_Score;
        let _2012 = d.CPI_2012_Score;
        result.push({ year: 2012, country: d.Country, CPI: _2012 });
        result.push({ year: 2013, country: d.Country, CPI: _2013 });
        result.push({ year: 2014, country: d.Country, CPI: _2014 });
        result.push({ year: 2015, country: d.Country, CPI: _2015 });
        result.push({ year: 2016, country: d.Country, CPI: _2016 });
    });
    return result;
}
function LineDataForRige(data) {
    // debugger
    let regionGroup = d3.groups(data, (d) => d.Region);
    let result = [];
    regionGroup.forEach((d) => {
        let _2012Group = d3.groups(d[1], (d) => d.CPI_2012_Score);
        let _2013Group = d3.groups(d[1], (d) => d.CPI_2013_Score);
        let _2014Group = d3.groups(d[1], (d) => d.CPI_2014_Score);
        let _2015Group = d3.groups(d[1], (d) => d.CPI_2015_Score);
        let _2016Group = d3.groups(d[1], (d) => d.CPI_2016_Score);
        let _2012mean = d3.mean(_2012Group, (d) => d[0]);
        let _2013mean = d3.mean(_2013Group, (d) => d[0]);
        let _2014mean = d3.mean(_2014Group, (d) => d[0]);
        let _2015mean = d3.mean(_2015Group, (d) => d[0]);
        let _2016mean = d3.mean(_2016Group, (d) => d[0]);
        result.push({ year: 2012, country: d[0], CPI: _2012mean.toFixed(2) });
        result.push({ year: 2013, country: d[0], CPI: _2013mean.toFixed(2) });
        result.push({ year: 2014, country: d[0], CPI: _2014mean.toFixed(2) });
        result.push({ year: 2015, country: d[0], CPI: _2015mean.toFixed(2) });
        result.push({ year: 2016, country: d[0], CPI: _2016mean.toFixed(2) });
        // console.log( mean.toFixed(2),12)
        // console.log(2012,_2012Group)
    });
    // console.log(regionGroup)
    return result;
}
function updated_mapClickCountry(Country) {
    if (mapClickCountry.includes(Country)) {
        // console.log(mapClickCountry.filter())
        let result = [];
        mapClickCountry.forEach((d) => {
            if (d != Country) {
                result.push(d);
            }
        });
        mapClickCountry = result;
        return;
    }
    mapClickCountry.push(Country);
}
//data is all data/data.csv data
function updateLine() {
    let result = [];
    countryDatas.forEach((d) => {
        if (mapClickCountry.includes(d.Country)) {
            result.push(d);
        }
    });
    LineChart.data = LineDataTool(result);
    LineChart.config.textWidth = 70;
    LineChart.updateVis();
}
function resetButton() {
    // debugger
    let len = mapClickCountry.length;
    while (len > 0) {
        mapClickCountry.pop();
        len--;
    }
    LineChart.data = LineDataForRige(countryDatas);
    LineChart.config.textWidth = 70;
    LineChart.updateVis();
    d3.select("#map").selectAll(".country").attr("opacity", 1);
    d3.select("#map").selectAll(".country").attr("stroke", 0);
}

const globalApplicationState = {
    bar:null,
    scatter:null,
    selectedYear : '2016'
};

