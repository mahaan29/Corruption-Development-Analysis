<a name="_eex1shw95zr1"></a><a name="_r2hx0dvam1m8"></a><a name="_l6oonil74mwp"></a>Corruption and Development: A Visual Analysis




Link to Demo Video:

<https://www.youtube.com/watch?v=djhnDV24pp8>













## <a name="_rxjykz4iyafi"></a>Table of Contents




|[Overview](#_42t79chizger)|**2**|
| :- | :- |
|[Data and Data Preprocessing](#_weji9y8drsk8)|**3**|
|[Tasks](#_12xntzgejv60)|**4**|
|[Visualisations](#_eh83rii0zr2t)|**5**|
|[Usage Scenarios](#_edae6o5962wd)|**8**|


# <a name="_42t79chizger"></a>**Overview**

Corruption is a substantial problem in our modern society as it can perpetuate poverty, exacerbate social inequality, and stifle economic growth. As more cases come to light, trust in institutions is undermined and public confidence in the government is eroded.

Corruption has led to the misuse of public funds, the awarding of contracts to unqualified individuals, and the creation of an uneven playing field where only those with connections can succeed. We wanted to understand just how much does corruption affect the economic growth and development of a nation. To investigate this idea, we propose a visualisation that explores the geographical distribution of corruption perceptions and compares that to how wealthy the country is. The intended audience for this project includes policymakers, and anyone interested in understanding the relationship between corruption and development. By presenting the data in a visual format, we hope to encourage discussions about potential solutions to this problem.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.001.png)
# <a name="_weji9y8drsk8"></a>**Data and Data Preprocessing**

We propose to use three datasets for our project:

- “Corruption Perceptions Index” (source: [Kaggle](https://www.kaggle.com/datasets/transparencyint/corruption-index)) that is a dataset representing the perceived level of political corruption for every country in the world.
- “World Development Indicators” (source: [Kaggle](https://www.kaggle.com/datasets/kaggle/world-development-indicators)) dataset, which represents the Income group of countries around the world.
- “World Economic Database'' (source: [IMF](https://www.imf.org/en/Publications/WEO/weo-database/2012/October/download-entire-database)), which displays metrics like unemployment rate of countries for a specified time period.

We performed a number of steps for data preprocessing, including:

- **Data Integration:** Datasets were combined into one based on countries to build the desired visualisations.
- **Data cleaning:** Missing data from both datasets was eliminated.
- **Data reduction:** All datasets had some attributes which were removed since they are redundant for our visualisation goals.
- **Data Addition:** Added Average CPI, Average Unemployment Rate columns for use in our visualisations.

The data pre-processing was performed on Microsoft Excel as well as Python using pandas library.


**Preprocessing Pipeline**

The original datasets contain 248 rows (dataset: World Development Indicators), 176 rows(dataset: Corruption Perceptions Index) and 8856 rows(dataset: World Economic Outlook). We are planning to implement a pre-processing pipeline to exclude irrelevant attributes and remove missing/ invalid data. After preprocessing, our final preprocessed data will contain ~180 items and 11 attributes.

Here is the description of the data:



|**#**|**Attribute**|**Type**|**Cardinality/ Range**|
| :- | :- | :- | :- |
|**1**|Country|Categorical|~100|
|**2**|Country Code|Categorical|~100|
|**3**|Region|Categorical|~7|
|**4**|2016 CPI Rank|Ordinal|~100|
|**5**|Average CPI Score|Quantitative|[0, 100]|
|**6**|CPI 2016 Score|Quantitative|[0, 100]|
|**7**|CPI 2015 Score|Quantitative|[0, 100]|
|**8**|CPI 2014 Score|Quantitative|[0, 100]|
|**9**|CPI 2013 Score|Quantitative|[0, 100]|
|**10**|CPI 2012 Score|Quantitative|[0, 100]|
|**11**|Income Group|Categorical|4|
|**12**|Average Unemployment Rate|Quantitative|[0, 100]|
|**13**|Unemployment Rate 2016|Quantitative|[0, 100]|
|**14**|Unemployment Rate 2015|Quantitative|[0, 100]|
|**15**|Unemployment Rate 2014|Quantitative|[0, 100]|
|**16**|Unemployment Rate 2013|Quantitative|[0, 100]|
|**17**|Unemployment Rate 2012|Quantitative|[0, 100]|
|**17**|Currency Unit|Categorical|~100|
# <a name="_12xntzgejv60"></a>**Tasks**

1. {*Discover,* trends} in corruption by country for a period of 5 years (2012- 2016). This allows the user to see the changes in CPI score over time
1. {*Identifying,* correlation} between corruption and country income level. This allows the user to determine how correlated the 2 indexes are.
1. {*Locate,* features} of countries according to their corruption index. This allows the user to determine which countries have a higher corruption index compared to their neighbours
1. {*Explore,* distribution} of countries grouping them by region comparing corruption index and unemployment rate
# <a name="_eh83rii0zr2t"></a>**Visualisations**

Our visualisation is centred around the choropleth map which allows the users to see through the different saturation the differences in the corruption index. While hovering, the user is shown a tooltip that gives the name of the country and the specific corruption index. The mark is interlocking areas and the channel is colour saturation. In the next iteration, the user will be able to click on countries on the map which will plot them onto the line chart. The user will be able to plot multiple countries to compare them up to a limit of 12. We chose a map because we have data on around 170 countries so a map was the most practical way to browse and display our data.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.002.png)

The scatterplot shows the correlation between unemployment level and corruption for each country. The points are colour coded by region and a legend at the bottom helps to better understand it. On hover, the user is shown a tooltip with the name of the selected country. The mark is point and the channels are ​​vertical position, horizontal position and colour hue. We chose a scatter plot because it is the perfect tool to display correlation between 2 variables.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.003.png)

The line chart plots the change in the corruption index over time. Multiple lines are shown at the same time so the user can quickly and easily compare different countries.

The mark is linked points and the channels are vertical position, horizontal position and colour hue. Once the user selects a country on a map, the chart will clear and the country itself will be plotted. The user will be able to click on the lines themselves to deselect the country which will be also deselected on the map. There will also be a reset button to remove all lines from the chart. We chose a line chart because of its ability to plot multiple distinct lines which can be easily compared.![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.004.png)

The final visualisation is a bar chart which shows the average corruption index score by income groups. The mark is lines and the channel is the length. There will be a slider which will affect the choropleth map and the scatterplot to visualise different years.

We chose a barchart because it is an effective way to compare different categories. In our case, we wanted to investigate the relationship between corruption index and income groups, and a bar chart was a natural choice for this task. The length of the bars provides an intuitive representation of the differences in corruption index across income groups.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.005.png)
# <a name="_edae6o5962wd"></a>**Usage Scenarios**

Sophie is a researcher at an international organisation, she is interested in exploring the relationship between corruption and income levels in different countries and how that is related to unemployment. Sophie wants to use this data to identify which countries are particularly high or low in corruption, and to investigate whether there is a connection between corruption and income levels. As part of her research she is very interested to find all the ways in which corruption can disrupt a country’s economy.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.006.png)

A white question mark appears at the top of the page, and when hovering over it, a brief definition of CPI is provided. This definition clarifies that the scale of the data is contrary to what one might anticipate.

To begin her investigation, Sophie uses our data visualisation tool. She starts by using the choropleth map, which displays all the countries for which data is available. The map allows Sophie to identify countries with the highest or lowest corruption index scores quickly.![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.007.png)

The map can be interacted with by selecting individual countries. The corresponding country is highlighted and it is then plotted on to the line graph. When a country is selected, all other countries are dimmed and a black stroke is added.

Sophie can then deselect a country either by pressing that country on the map or by clicking on its line in the line chart. On hover a tooltip showing the exact CPI is visible.

If she wants to compare a completely new set of countries, she can click on the reset button which will restore both the map and the line chart to their initial state.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.008.png)

The map can be further interacted with via the slider. It is by default set to 2016 and Sophie can quickly get an overview of the change in CPI for the whole world through the years by changing the position of the slider which will change the colour saturation of each country. The slider also affects the scatterplot.

Next, Sophie selects a specific country and examines the line chart showing the change in its corruption index score over time. She uses this chart to explore the trend of corruption levels in that country over the years and identify any patterns or significant changes.![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.009.png)

To ensure the interface does not get too cluttered, if Sophie adds too many countries to the line chart, an alert will pop up and she will have to deselect some countries or reset the chart if she wants to continue.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.010.png)

Sophie then uses the bar chart to explore the correlation between income levels and corruption index scores. The chart shows that there is a strong negative correlation between these two variables, which means that higher-income countries tend to have lower corruption levels. Hovering over a bar will highlight the bar and show the average corruption score for that income group.


Finally, Sophie uses the scatterplot to investigate the relationship between corruption index scores and unemployment levels. The scatterplot is colour-coded by region, which helps her quickly see whether there is a link between these two variables. She is able to interact with the legend to filter the data by region. The scatterplot also has a regression line which further helps to visualise correlation. It also has a tooltip which helps to identify specific countries by name.

![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.011.png)
![](Aspose.Words.8b36a931-f16e-4db6-9105-ad34566e9edb.012.png)