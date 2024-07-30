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

module.exports = SBGNEdge;