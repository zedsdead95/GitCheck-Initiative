const { expect , assert , should } = require('chai');
const {updatePlaceholder} = require ('../js/app');

// Test github API request for babel account and for babel repo
describe('Html and css updating tests on client side', () => {
  it('Should always be true', () => {

    //app.handleSearch("babel","babel") -> not gonna work since window.location needs app to be running from browser
    updatePlaceholder("Works perfectly !");
    assert.notEqual(document.getElementById("text-secondary").innerHTML,"Oups, an error occured. Sorry, this app sucks...");
    assert.equal(document.getElementById("text-secondary").innerHTML,"Works perfectly !");
  });
});

