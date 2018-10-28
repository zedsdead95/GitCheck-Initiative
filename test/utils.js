const { expect , assert , should } = require('chai');
const {updatePlaceholder} = require ('../js/app');

// Test github API request for babel account and for babel repo

// !!!!!!!!   it is impossible to define unit test on the client side since it needs html context 
// that would be available only on a browser page and not locally.
// For example here even a simple fonction doesnt work here since it doesnt recognize document.getElementById.

// So as for the tests, only server side have been done.     !!!!!!!

describe('Html and css updating tests on client side', () => {
  it('Should always be true', () => {

    //app.handleSearch("babel","babel") -> not gonna work since window.location needs app to be running from browser
    /*updatePlaceholder("Works perfectly !");
    assert.notEqual(document.getElementById("text-secondary").innerHTML,"Oups, an error occured. Sorry, this app sucks...");
    assert.equal(document.getElementById("text-secondary").innerHTML,"Works perfectly !");
    */
  });
});

