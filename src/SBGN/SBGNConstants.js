let CoSEConstants = require('cose-base').CoSEConstants;

function SBGNConstants() {
}

//CoSEPConstants inherits static props in FDLayoutConstants
for (let prop in CoSEConstants) {
  SBGNConstants[prop] = CoSEConstants[prop];
}

SBGNConstants.SLOPE_THRESHOLD = 0.5;

module.exports = SBGNConstants;