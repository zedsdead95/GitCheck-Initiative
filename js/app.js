//import App from ('reactApp')
//import React from ('react')
//import ReactDOM from ('ReactDOM')
//import Vue from('Vue')
//import { readMeComments} from './utils'
//var mongoUtil = require( 'mongoUtil' );


// https://medium.freecodecamp.org/environment-settings-in-javascript-apps-c5f9744282b6
const baseUrl = 'https://arcane-wave-60281.herokuapp.com';

const readMeComments = ["Well done ! Your repo does contain a README file."
  ,"Your repository does not contain a README file. README file is essential to enable collaborator to improve your project or just simply help users to follow advices and installation procedure."];
const licenseComments = [" Good ! You did think of a license !","Without a license (MIT,Apache...) your project looses some credibility... Add a license."];
const conductComments = [" Great ! You specified a  conduct line !","You sneaky pete, you need a conduct line for your project !"];
const contributingComments = [" Amazing. A contributing file is indeed a must to guide other collaborators !"
                               ,"Oh dear... how are you gonna improve your project without a guide for other collaborators !"];
const linterComments = [" Well done for adding a linter file !","A linter file would set your project code as a code following great coding conventions..."];
const testComments = ["Excellent ! You thought of unit tests. We are never safe from bugs and errors.","Oups ! It seems like you do not have a test folder. How are you gonna spare your project from bugs ?"]
const issuesComments = ["","Ton projet possede des issues qui n'ont toujours pas ete regler."]
const dependencesComments =["Bien joué, tes dependances sont a jour !","Les dependances mon cher, les dependances ne sont pas a jour."]
const projectComments =["Le nom du projet est assez explicite, c'est super !","Le nom de ton repo est beaucoup trop long, rends le plus explicite et plus simple pour une meilleur visaulite !"]

  const defaultSearchUser = 'babel';
const defaultSearchRepo = 'babel';
const searchForm = document.getElementById('search-form');
let chart = null;

var score_final = 0;

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

function updateScore(){
  document.getElementById('grade').innerHTML = ("Well here is you grade : " + score_final + " / 6");
  score_final = 0;
}

function updateList(repodata){
  
  // check if contains readme and adapt message (good or bad) and do that for all the list
  const readme = document.getElementById('readme-msg');
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
  updateLabel(test,repodata,'test',testComments,'imgTest')


  updateScore();
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
        score_final += 1;
      }
  });
  // otherwise puts a negative comment
  if (!contains){
    labelToModify.innerHTML = comment[1];
    document.getElementById(imageToModify).src = '/images/false.png';

  }
}

// returns infos from database in the same format as they are represented when extracted from github API
function checkInfosIntoDatabase(username,reponame){
  var db = mongoUtil.getDb();
  // search for infos inside the database
  return db.collection.find({'username': username,"reponame" :reponame },{ _id:0,"username" : 0,"reponame" :0}).toArray().
      then((val) => {

          let res = new Set();
          res.add(val[0].readme);
          res.add(val[0].license);
          res.add(val[0].conduct);
          res.add(val[0].contributing);
          res.add(val[0].eslint);
          res.add(val[0].test);

          return Array.from(res);
      }).then((result) =>{
        if (result) {
          // if infos contained inside database returns it
          return  result;
        }
        // else return empty string
        else {
          return "";
        }
      });
    

}

function addToDatabase(username,reponame,readmeData,licenseData,conductData,contributingData,eslintData,testData){
    var newRepoInfo = {"username" : username,"reponame" :reponame,
                       "readme" : readmeData,"license" : licenseData,
                       "conduct" : conductData,"contributing": contributingData,
                       "eslint" :eslintData , "test" : testData}
      // Insert a document inside database
      db.collection('infos').insertOne(newRepoInfo);
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
/*
function handleSearchWithDatabase(username,reponame) {
  updatePlaceholder('Loading for a repo to judge...');

  return Promise.all([
    // search inside database
    checkInfosIntoDatabase(username,reponame),
     // recupere les infos de l'utilisateur
    getUser(username),
  ]).then(([DBrepodata,user]) => {
    if(!DBrepodata){  // If contained inside the database get the infos
      updatePlaceholder(''),         
      updateProfile(user);  // update profile
      updateList(DBrepodata);
      return "";
    }
    else{
      updatePlaceholder(''),         
      updateProfile(user);  // update profile
      return getRepoInfos(username,reponame)
    }
  }).then((res) => {
    if(!res){ // if not empty
      console.log(res);
      //addToDatabase(res.username,reponame,DBrepodata.readmeData,licenseData,conductData,contributingData,eslintData,testData)         }
      updateList(res);
    }

  })
    .catch(err => {
      updatePlaceholder('Oups, an error occured. Sorry, this app sucks...', 'text-error');
      console.error('Cannot fetch data', err)
    })
}
*/

function loadingMessage(){
  const message = " loading your grade..."; 
}

searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const username = this.elements['username'].value; // get user
  const reponame = this.elements['reponame'].value; // get repo
  if (!(username && reponame)) {
    handleSearch(defaultSearchUser,defaultSearchRepo);
    return;
  }
  handleSearch(username,reponame);
});

handleSearch(defaultSearchUser,defaultSearchRepo);


/*module.exports = {
  handleSearch,
  updatePlaceholder,
  updateProfile,
};*/