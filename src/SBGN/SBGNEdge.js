const CoSEEdge = require('cose-base').CoSEEdge;

function SBGNEdge(source, target, vEdge) {
  CoSEEdge.call(this, source, target, vEdge);

  // SBGN class of edge (such as consumption, production etc.)
  this.class = null;
}

SBGNEdge.prototype = Object.create(CoSEEdge.prototype);
for (let prop in CoSEEdge) {
  SBGNEdge[prop] = CoSEEdge[prop];
}

SBGNEdge.prototype.isModulation = function() {
  let self = this;
  if(self.class == "modulation" || self.class == "stimulation" || self.class == "catalysis" || self.class == "inhibition" || self.class == "necessary stimulation")
    return true;
  else
    return false;
};

module.exports = SBGNEdge;