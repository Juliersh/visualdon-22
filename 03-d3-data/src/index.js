const WS_POSTS = "https://jsonplaceholder.typicode.com/posts";
const WS_USERS = "https://jsonplaceholder.typicode.com/users";

import { json } from 'd3-fetch'

Promise.all([
  json(WS_POSTS),
  json(WS_USERS)
])
.then(([posts, users]) =>  {
//   console.log(posts)
//   console.log(users)
  const tabUsers = users.map((d,i) => {
      return users
  })
  const tabPosts = posts.map((d,i) => {
      return posts
  })
  const newData = users.map((d) =>  [d.name, d.address.city, d.company]);
  const lesPosts = posts.filter()
  newData.forEach(el => {
        
    });

  //   newData.rows.add(null, newData);
  console.log(newData)


//   const noms = users.map((d,i) => {
//       return d.name
//   })
//   const idUsers = users.map((d,i) => {
//       return d.id;
//   })
//   const idUsersPosts = posts.map((d,i) => {
//       return d.userId;
//   })
//   console.log(noms)
//   console.log(idUsers)
//   console.log(idUsersPosts)
//   console.log(tabUsers)
//   console.log(tabPosts)
//   const tab = []
//   tab.push(tabPosts)
//   tabUsers.push(tabPosts)
//   console.log(tabUsers)
});

