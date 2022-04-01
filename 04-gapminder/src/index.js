import * as d3 from 'd3'

// Pour importer les données
// import file from '../data/data.csv'

import population from '../data/population_total.csv'
import gdp from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import lifeExpectancy from '../data/life_expectancy_years.csv'

console.log(population)
console.log(lifeExpectancy)
console.log(gdp)


const popTransformed = population.map(d => {
    // Trouver le format SI (M, B, k)
    let SI = typeof d["2021"] === 'string' || d["2021"] instanceof String ? d["2021"].slice(-1) : d["2021"];
    
    // Extraire la partie numérique
    let number = typeof d["2021"] === 'string' || d["2021"] instanceof String ? parseFloat(d["2021"].slice(0,-1)) : d["2021"];
    
   // Selon la valeur SI, multiplier par la puissance
    switch (SI) {
        case 'M': {
            return { "country": d.country, "pop": Math.pow(10, 6) * number};
            break;
        }
        case 'B': {
            return { "country": d.country, "pop": Math.pow(10, 9) * number};
            break;
        }
        case 'k': {
            return { "country": d.country, "pop": Math.pow(10, 3) * number};
            break;
        }
        default: {
            return { "country": d.country, "pop": number};
            break;
        }
    }
})

console.log(popTransformed)

// set the dimensions and margins of the graph
const margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 12000])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  // Add Y axis
  const y = d3.scaleLinear()
    .domain([35, 90])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Add a scale for bubble size
  const z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([ 4, 40]);

    const groups = popTransformed.map(d=> (d.pop))
    const subgroups = ['country']
    console.log(groups)

  // Add a scale for bubble color
  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(d3.schemeSet2);

    const stackedData = d3.stack()
    .keys(subgroups)
    (popTransformed)

  // Add dots
  svg.append('g')
    .selectAll("dot")
    .data(stackedData)
    .join("circle")
      .attr("cx", d => x(d.lifeExpectancy))
      .attr("cy", d => y(d.gdp))
      .attr("r", d => z(d.groups))
      .style("fill", d => color(d.key))
      .style("opacity", "0.7")
      .attr("stroke", "white")
      .style("stroke-width", "2px")

  