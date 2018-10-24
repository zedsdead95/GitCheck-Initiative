//import App from ('reactApp')
//import React from ('react')
//import ReactDOM from ('ReactDOM')
//import Vue from('Vue')

// https://medium.freecodecamp.org/environment-settings-in-javascript-apps-c5f9744282b6
const baseUrl =  window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://heig-vd-ga-server.herokuapp.com';


const defaultSearchUser = 'babel';
const defaultSearchRepo = 'babel';
const searchForm = document.getElementById('search-form');
let chart = null;

// recupere infos de l'utilisateur (photo de profil + username)
function getUser(username) {
  return fetch(`${baseUrl}/users/${username}`)
    .then(res => res.json());
}

function getRepoInfos(username,reponame) {
  return fetch(`${baseUrl}/check/${username}/${reponame}`)
    .then(res => res.json());
}


function updateProfile(user) {
  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const login = document.getElementById('user-login');
  avatar.src = user.avatar_url;
  avatar.alt = `avatar of ${user.name}`;
  name.innerHTML = user.name;
  login.innerHTML = user.login;
}

function updateList(){
  /*new Vue({
    el: '#chart-languages',
    data: {
      message: 'Is you Repo well documented ?',
      todos: [
        {file: 'ReadMe', text: 'Ton repo ne contient pas de README dioude are u kidding me ?'},
        {file: 'License' , text: 'Sans une License (MIT...) tu perds en creidibilite couz'},
        {file: 'Conduction', text: 'Petit rebelle, il te faut une ligne de conduite !'},
      ]
    }
  });*/

  const eval = document.getElementById('repo-evaluation');
  
  
}

function updatePlaceholder(content, className = 'text-secondary') {
  const placeholder = document.getElementById('placeholder');
  placeholder.className = className;
  placeholder.innerHTML = content;
}

function handleSearch(username,reponame) {
  updatePlaceholder('Loading for a repo to judge...');

  return Promise.all([
    getUser(username),
    getRepoInfos(username,reponame), // recupere les infos de l'utilisateur
    console.log(getRepoInfos(username,reponame)),
  ])
    .then(([user, repodata, colors]) => {
      updatePlaceholder('');        

      //const labels = Object.keys(languages);
      //const data = labels.map(label => languages[label]);
      /*const backgroundColor = labels.map(label => {
        const color = colors[label] ? colors[label].color : null
        return color || '#000';
      })*/

      updateProfile(user);
      //updateList(repodata)
    
    })
    .catch(err => {
      updatePlaceholder('Oups, an error occured. Sorry, this app sucks...', 'text-error');
      console.error('Cannot fetch data', err)
    })
}

function loadingMessage(){
  const message = " loading your grade...";
}

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = this.elements['username'].value; // get user
  const reponame = this.elements['reponame'].value; // get repo
  if (!(username && reponame)) {
    return;
  }
  handleSearch(username,reponame);
});

//handleSearch(defaultSearchUser,defaultSearchRepo);

//getUser('zedsdead95');
//getRepoInfos('zedsdead95','GitCheck-express-server');
