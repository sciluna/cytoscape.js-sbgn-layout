const CoSELayout = require('cose-base').CoSELayout;

// Constructor
function SBGNLayout() {
  CoSELayout.call(this);
}

SBGNLayout.prototype = Object.create(CoSELayout.prototype);

for (let property in CoSELayout) {
  SBGNLayout[property] = CoSELayout[property];
}



module.exports = SBGNLayout;