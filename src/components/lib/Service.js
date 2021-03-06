import { firebaseApp, userProfileRef } from './firebase';

export const isLoggedInUser = async () => {
  let user_id = '';
  let loggedIn = await firebaseApp.auth().onAuthStateChanged(function(user) {
    if (user) {
      user_id = firebaseApp.auth().currentUser.uid;
    }
  });
  return user_id
}

export const getPosts = async () => {
  let  posts = [];
  let datas = await userProfileRef.ref('users').once('value', snapshot => {
    snapshot.forEach(function(child) {
      child.forEach(function(snap) {
        snap.forEach(function(data) {
           let element = data.val();
           element.post_id = data.key;
           console.log(element)
           posts.push(element)
        });
      });
    });
  })
  posts.sort((a, b) => b.time - a.time);
  return posts;
}

export const getUserDetail = (user_id) => {
  const userData = userProfileRef.ref('/users/' + user_id).once('value')
      .then(function(snapshot) {
        return { 
          fullname : snapshot.val().fullname,
          avatar_src: snapshot.val().avatar_src
        }
      }
    )
  return userData;
}

export const getUserPosts = (user_id) => {
   let posts = userProfileRef.ref(`/users/${user_id}/posts`).once('value')
    .then(function(snapshot) {
      return Object.values(snapshot.val())
    })
  return posts;
}