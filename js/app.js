//import App from ('reactApp')
//import React from ('react')
//import ReactDOM from ('ReactDOM')
//import Vue from('Vue')
//import { readMeComments} from './utils'

// https://medium.freecodecamp.org/environment-settings-in-javascript-apps-c5f9744282b6
const baseUrl =  window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : 'https://heig-vd-ga-server.herokuapp.com';

  const readMeComments = ["Well done ! Your repo does contain a ReadMe file."
  ,"Ton repo ne contient pas de README dioude are u kidding me ?"];

  const licenseComments = [" Bien une license !","Sans une License (MIT...) tu perds en credibilite..."];
  const conductComments = [" Genial ! Tu as pensé à la ligne de conduite ! !","Petit rebelle, il te faut une ligne de conduite !"];
  const contributingComments = [" Bien un guide pour les contributeurs !"
                               ,"Ahlala, comment vas tu ameliorer ton projet sans fournir un guide pour les contributeurs !"];
  const linterComments = [" Bien une fichier linter !","Un fichier linter rendrait ton programme bein plus propre et conventionné..."];

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

function updateList(repodata){
  
  // TODO check if contains readme and adapt message (good or bad) and do that for all the list
  const readme = document.getElementById('readme-msg');

    //if list contains or not readme then adapt the message
  updateLabel(readme,repodata,'README',readMeComments,'imgReadMe');

  const license = document.getElementById('license-msg');
  updateLabel(license,repodata,'LICENSE',licenseComments,'imgLicense')

  const conduction = document.getElementById('conduction-msg');
  updateLabel(conduction,repodata,'CONDUCT',conductComments,'imgConduction')

  const contributing = document.getElementById('contributing-msg');
  updateLabel(contributing,repodata,'CONTRIBUTING',contributingComments,'imgContributing')

  const linter = document.getElementById('linter-msg');
  updateLabel(linter,repodata,'eslint',linterComments,'imgLinter')

  const test = document.getElementById('test-msg');
  updateLabel(linter,repodata,'test',linterComments,'imgTest')

  // TODO when we have more time (never obviously...)

  /*const issues = document.getElementById('issues-msg');
  updateLabel(issues,repodata,'eslint',issuesComments)

  const dependences = document.getElementById('dependences-msg');

  const projectname = document.getElementById('project-name-msg');
  */
}

function updateLabel(labelToModify,repodata,info,comment,imageToModify){
  let contains = false;
  // if contains the desired label then puts a good comment
  repodata.forEach(word => {
      if (word.includes(info)) {
        labelToModify.innerHTML = comment[0];
        document.getElementById(imageToModify).src = '/images/true.png';
        contains = true;
      }
  });
  // otherwise puts a negative comment
  if (!contains){
    labelToModify.innerHTML = comment[1];

  }
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
    getRepoInfos(username,reponame) // recupere les infos de l'utilisateur
  ])
    .then(([user, repodata]) => {
      updatePlaceholder('');        


      updateProfile(user);
      updateList(repodata);
    
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

handleSearch(defaultSearchUser,defaultSearchRepo);


module.exports = {
  handleSearch,
  updatePlaceholder,
  updateProfile,
};