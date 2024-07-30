const CoSEGraphManager = require('cose-base').CoSEGraphManager;

function SBGNGraphManager(layout) {
  CoSEGraphManager.call(this, layout);
}

SBGNGraphManager.prototype = Object.create(CoSEGraphManager.prototype);

for (let prop in CoSEGraphManager) {
  SBGNGraphManager[prop] = CoSEGraphManager[prop];
}

module.exports = SBGNGraphManager;