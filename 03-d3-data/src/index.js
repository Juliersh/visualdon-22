const WS_POSTS = "https://jsonplaceholder.typicode.com/posts";
const WS_USERS = "https://jsonplaceholder.typicode.com/users";

import { json } from 'd3-fetch'

Promise.all([
  json(WS_POSTS),
  json(WS_USERS)
])
  .then(([posts, users]) => {
    const usersPosts = [];
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
      const titre_posts = [];
      userPosts.forEach(post => {
        titre_posts.push(post.title);
      });
      
      person['titre_posts'] = titre_posts;
      usersPosts.push(person);

    });
  })

  