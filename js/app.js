//import App from ('reactApp')
//import React from ('react')
//import ReactDOM from ('ReactDOM')
import Vue from('Vue')

// https://medium.freecodecamp.org/environment-settings-in-javascript-apps-c5f9744282b6
const baseUrl =  window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://heig-vd-ga-server.herokuapp.com';


const defaultSearch = 'octocat';
const searchForm = document.getElementById('search-form');
let chart = null;

function getUser(username) {
  return fetch(`${baseUrl}/users/${username}`)
    .then(res => res.json());
}

function getLanguages(username) {
  return fetch(`${baseUrl}/languages/${username}`)
    .then(res => res.json());
}

function getGithubColors() {
  return fetch('data/github-colors.json')
    .then(res => res.json());
};

function updateProfile(user) {
  const avatar = document.getElementById('user-avatar');
  const name = document.getElementById('user-name');
  const login = document.getElementById('user-login');
  avatar.src = user.avatar_url;
  avatar.alt = `avatar of ${user.name}`;
  name.innerHTML = user.name;
  login.innerHTML = user.login;
}

function updatePlaceholder(content, className = 'text-secondary') {
  const placeholder = document.getElementById('placeholder');
  placeholder.className = className;
  placeholder.innerHTML = content;
}

function handleSearch(username) {
  updatePlaceholder('Loading...');

  return Promise.all([
    getUser(username),
    getLanguages(username),
    getGithubColors(),
  ])
    .then(([user, languages, colors]) => {
      updatePlaceholder('');

      const labels = Object.keys(languages);
      const data = labels.map(label => languages[label]);
      const backgroundColor = labels.map(label => {
        const color = colors[label] ? colors[label].color : null
        return color || '#000';
      })

      updateProfile(user);

    })
    .catch(err => {
      updatePlaceholder('Oups, an error occured. Sorry, this app sucks...', 'text-error');
      console.error('Cannot fetch data', err)
    })
}

function loadingMessage(){
  const message = " A Git power comes with Git responsability"
}

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = this.elements['username'].value;
  if (!username) {
    return;
  }
  handleSearch(username);
});

handleSearch(defaultSearch);

