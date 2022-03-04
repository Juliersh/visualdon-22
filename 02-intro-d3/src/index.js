import * as d3 from 'd3';

// C'est ici que vous allez écrire les premières lignes en d3!

const svg = d3.select(".svg");

const cercle1 = svg.select(".cercle1");
const cercle2 = svg.select(".cercle2");
const cercle3 = svg.select(".cercle3");

//Changer couleur du 2ème cercle
cercle2.attr("fill", "blue");

//Déplacer deux cercles
cercle1.attr("cx", "100");
cercle2.attr("cx", "200");

//Rajouter du texte en dessous de chaque cercle
svg.append("text").text("hello1").attr("x" , 100).attr("y" , 106).attr("text-anchor", "middle")
svg.append("text").text("hello2").attr("x" , 200).attr("y" , 206).attr("text-anchor", "middle")
svg.append("text").text("hello3").attr("x" , 250).attr("y" , 306).attr("text-anchor", "middle")
   

//Aligner verticalement les cercles en cliquant sur le dernier cercle
cercle3.on("click", () => {
    svg.selectAll("circle, text").attr("cx" , 100).attr("x", 100);

})

//Données
const data = [20, 5, 25, 8, 15];

svg.selectAll('.svg')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d,i) => i*25 )
    .attr('y', (d) => 500-d)
    .attr('width', 20)
    .attr('height', (d) => d)
