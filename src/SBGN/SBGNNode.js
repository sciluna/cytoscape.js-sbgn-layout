const CoSENode = require('cose-base').CoSENode;
const IMath = require('layout-base').IMath;

function SBGNNode(gm, loc, size, vNode) {
  // the constructor of LNode handles alternative constructors
  CoSENode.call(this, gm, loc, size, vNode);

  // SBGN class of node (such as macromolecule, simple chemical etc.)
  this.class = null;
}

SBGNNode.prototype = Object.create(CoSENode.prototype);
for (let prop in CoSENode) {
  SBGNNode[prop] = CoSENode[prop];
}

module.exports = SBGNNode;