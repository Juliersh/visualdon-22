const WS_POSTS = "https://jsonplaceholder.typicode.com/posts";
const WS_USERS = "https://jsonplaceholder.typicode.com/users";

import { json } from 'd3-fetch'
import * as d3 from 'd3'

Promise.all([
  json(WS_POSTS),
  json(WS_USERS)
])
  .then(([posts, users]) => {
    let usersPosts = [];
    users.forEach(user => {
      const userId = user.id;
      const person = {
        nom_utilisateur: user.name,
        ville: user.address.city,
        nom_companie: user.company.name
      };
      console.log(person)
      const userPosts = posts.filter((d, i) => {
        return d.userId == userId;
      });
      let titre_posts = [];
      userPosts.forEach(post => {
        titre_posts.push(post.title);
      });

      person['titre_posts'] = titre_posts;
      usersPosts.push(person);
      console.log(usersPosts)

    });


    let graphPosts = [];

    // * Calculez le nombre de **posts** par **user**

    d3.select("body")
      .append("div")
      .attr('id', `div-users`)

    users.forEach(user => {
      let compteurUser = 0;

      // console.log(user.name);
      posts.forEach(post => {

        // console.log(post.userId);
        if (post.userId == user.id) {
          compteurUser++;

        }
      })

      graphPosts.push(compteurUser);

      d3.select(`#div-users`)
        .append('div')
        .attr('id', user.id)
        .append('p')
        .text(`${user.name} a écrit ${compteurUser} article(s).`)

    })


    // * Trouvez le **user** qui a écrit le texte le plus long dans **posts.body**
    let longerPost = 'abc';
    let longerPostUser = 0;
    console.log(posts);
    posts.forEach(post => {

      if (longerPost.length < post.body.length) {
        longerPost = post.body;
        longerPostUser = post.userId

      }

    })
    console.log(longerPost);
    console.log(longerPostUser);
    let userLongerPost = users[longerPostUser - 1].name;



    d3.select("body")
      .append("div")
      .attr('id', 'longerPost')

    d3.select('#longerPost')
      .append('p')
      .text(`${userLongerPost} a écrit le plus long post : "${longerPost}"`)


    // * Dessinez un graphique en bâton en ayant sur l'axe *x* les utilisateurs et *y* le nombre de posts

    let margin = { top: 20, right: 10, bottom: 60, left: 60 };
    let width = 1500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    d3.select("body")
      .append("div")
      .attr('id', 'graph')

    let svg = d3.select("#graph")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let x = d3.scaleBand()
      .domain(usersPosts.map(function (d) { return d["nom_utilisateur"]; }))
      .range([1000, 0]);



    let y = d3.scaleLinear()
      .domain([0, 10])
      .range([height, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-2,10)")

    svg.selectAll("bars")
      .data(usersPosts)
      .enter()
      .append("rect")
      .attr("x", function (d) { return x(d["nom_utilisateur"]) + 30; })
      .attr("y", function (d) { return y(d["titre_posts"].length); })
      .attr("width", "40px")
      .attr("height", function (d) { return height - y(d["titre_posts"].length); })
      .attr("fill", `#${Math.floor(Math.random() * 16777215).toString(16)}`)

  })

