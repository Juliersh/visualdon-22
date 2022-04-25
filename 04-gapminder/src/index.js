import * as d3 from 'd3'

// Pour importer les données
// import file from '../data/data.csv'

import populationData from '../data/population_total.csv'
import incomeData from '../data/income_per_person_gdppercapita_ppp_inflation_adjusted.csv'
import lifeData from '../data/life_expectancy_years.csv'

import dataCountry from '../custom.geo (1).json'


// Récupère toutes les années
const annees = Object.keys(populationData[0])
//console.log(annees)

let converterSI = (array, variable, variableName) => {

  let convertedVariable = array.map(d => {
    // Trouver le format SI (M, B, k)
    let SI = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? d[variable.toString()].slice(-1) : d[variable.toString()];
    // Extraire la partie numérique
    let number = typeof d[variable.toString()] === 'string' || d[variable.toString()] instanceof String ? parseFloat(d[variable.toString()].slice(0, -1)) : d[variable.toString()];
    // Selon la valeur SI, multiplier par la puissance
    switch (SI) {
      case 'M': {
        return { "country": d.country, [variableName]: Math.pow(10, 6) * number };
        break;
      }
      case 'B': {
        return { "country": d.country, [variableName]: Math.pow(10, 9) * number };
        break;
      }
      case 'k': {
        return { "country": d.country, [variableName]: Math.pow(10, 3) * number };
        break;
      }
      default: {
        return { "country": d.country, [variableName]: number };
        break;
      }
    }
  })
  return convertedVariable;

};


let pop = [],
  income = [],
  life = [],
  dataCombined = [];

//console.log(dataCombined)

// Merge data
const mergeByCountry = (a1, a2, a3) => {
  let data = [];
  a1.map(itm => {
    let newObject = {
      ...a2.find((item) => (item.country === itm.country) && item),
      ...a3.find((item) => (item.country === itm.country) && item),
      ...itm
    }
    data.push(newObject);
  })
  return data;

}

annees.forEach(annee => {
  pop.push({ "annee": annee, "data": converterSI(populationData, annee, "pop") })
  income.push({ "annee": annee, "data": converterSI(incomeData, annee, "income") })
  life.push({ "annee": annee, "data": converterSI(lifeData, annee, "life") })
  const popAnnee = pop.filter(d => d.annee == annee).map(d => d.data)[0];
  const incomeAnnee = income.filter(d => d.annee == annee).map(d => d.data)[0];
  const lifeAnnee = life.filter(d => d.annee == annee).map(d => d.data)[0];
  dataCombined.push({ "annee": annee, "data": mergeByCountry(popAnnee, incomeAnnee, lifeAnnee) })
});
// console.log(dataCombined)



// set the dimensions and margins of the graph
const margin = { top: 10, right: 20, bottom: 30, left: 50 },
  width = 1000 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Add X axis
const x = d3.scalePow()
  .domain([0, 100000])
  .range([0, width]);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

// Add Y axis
const y = d3.scaleLinear()
  .domain([0, 85])
  .range([height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add a scale for bubble size
const z = d3.scaleLinear()
  .domain([200000, 1310000000])
  .range([4, 40]);

// const groups = converterSI(d=> (d.pop))
const groups = dataCombined[221].data.map(d => d.pop)
//console.log(groups)

// Add a scale for bubble color
const color = d3.scaleOrdinal()
  .domain(groups)
  .range(d3.schemeSet2);

const stackedData = d3.stack()
  .keys(groups)
  (dataCombined)

// Add dots
svg.append('g')
  .selectAll("dot")
  .data(dataCombined[221].data)
  .join("circle")
  .attr("cx", d => x(d.income))
  .attr("cy", d => y(d.life))
  .attr("r", d => z(d.pop))
  // .style("opacity", "0.7")
  .attr("stroke", "white")
  .style("fill", color)
// .style("stroke-width", "2px")


//---------------------------CARTE---------------------------------------------------------------

const margin2 = { top: 10, right: 30, bottom: 20, left: 50 },
  width2 = 2500 - margin2.left - margin2.right,
  height2 = 700 - margin2.top - margin2.bottom;

const svg2 = d3.select("#my_dataviz2")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin2.left + "," + margin2.top + ")");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(170)
  .center([0, 20])
  .translate([width2 / 2, height2 / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeSet2);
//console.log(dataCountry)
// Load external data and boot
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),

]).then(function (loadData) {
  let topo = loadData[0]
  //console.log(topo)

  let mouseOver = function (d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "white")
  }

  let mouseLeave = function (d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .9)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg2.append("g")
    .selectAll("path")
    .data(topo.features)
    // .data(dataCountry)
    .enter()
    .append("path")
    // draw each country
    .attr("d", d3.geoPath()
      .projection(projection)
    )
    // set the color of each country
    .attr("fill", function (d) {
      let populationCarte = pop[221].data.find(pop => pop.country == d.properties.name) || 0
      //console.log(populationCarte)
      return colorScale(populationCarte.pop)
    })
    .style("stroke", "transparent")
    .attr("class", function (d) { return "Country" })
    .style("opacity", .8)
    .on("mouseover", mouseOver)
    .on("mouseleave", mouseLeave)

});

//--------------------------PARTIE3-----------------------------------------------------------------------------

const svg3 = d3.select("#my_dataviz3")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);


// Add X axis
svg3.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(d3.axisBottom(x));

// Add Y axis
svg3.append("g")
  .call(d3.axisLeft(y));

let nIntervId;

function animate() {
  // regarder si l'intervalle a été déjà démarré
  if (!nIntervId) {
    nIntervId = setInterval(play, 100);
  }
  //console.log(nIntervId);
}

d3.select('body').append('h1').attr('id', 'anneeCourante')

let i = -1;
function play() {
  // Recommencer si à la fin du tableau
  if (i == 250) {
    i = 0;
  } else {
    i++;
  }

  d3.select('#anneeCourante').text(dataCombined[i].annee)
  updateChart(dataCombined[i]);
}

// Mettre en pause
function stop() {
  clearInterval(nIntervId);
  nIntervId = null;
}



function updateChart(iterationDonnees) {
  svg3.selectAll('circle')
    .data(iterationDonnees.data)
    .join(enter => enter.append('circle')
      .attr("stroke", "black")
      .style("opacity", "0.7")
      .style("fill", color)
      .attr('cx', function (d) { return x(d.income); })
      .attr('cy', function (d) { return y(d.life); }).transition(d3.transition()
        .duration(500)
        .ease(d3.easeLinear)).attr('r', function (d) { return z(d.pop); }),
      update => update.transition(d3.transition()
        .duration(50)
        .ease(d3.easeLinear))
        .attr('r', function (d) { return z(d.pop); })
        .attr('cx', function (d) { return x(d.income); })
        .attr('cy', function (d) { return y(d.life); }),
      exit => exit.remove())
}

// animate();
const btnPlay = document.createElement("button");
btnPlay.innerHTML = "Play";
btnPlay.id = "play";
document.body.appendChild(btnPlay);


const btnStop = document.createElement("button");
btnStop.innerHTML = "Stop";
btnStop.id = "stop";
document.body.appendChild(btnStop);

document.querySelector('#play').addEventListener("click", animate);
document.querySelector('#stop').addEventListener("click", stop);



