const CoSENode = require('cose-base').CoSENode;
const IMath = require('layout-base').IMath;

function SBGNNode(gm, loc, size, vNode) {
  // the constructor of LNode handles alternative constructors
  CoSENode.call(this, gm, loc, size, vNode);

  // SBGN class of node (such as macromolecule, simple chemical etc.)
  this.class = null;
  // pseudoClass is used to add temporary class (other than SBGN class) for a node
  this.pseudoClass = null;
}

SBGNNode.prototype = Object.create(CoSENode.prototype);
for (let prop in CoSENode) {
  SBGNNode[prop] = CoSENode[prop];
}

SBGNNode.prototype.getOutgoerNodes = function () {
  let nodeList = [];
  let self = this;

  self.edges.forEach(function(edge) {
    
    if (edge.source == self)
    {
      nodeList.push(edge.target);
    }
  });

  return nodeList;
};

SBGNNode.prototype.getIncomerNodes = function () {
  let nodeList = [];
  let self = this;

  self.edges.forEach(function(edge) {
    
    if (edge.target == self)
    {
      nodeList.push(edge.source);
    }
  });

  return nodeList;
};

SBGNNode.prototype.isProcess = function() {
  let self = this;
  if(self.class == "process" || self.class == "omitted process" || self.class == "uncertain process")
    return true;
  else
    return false;
};

// for nodes in components
SBGNNode.prototype.isConnectedToRing = function() {
  let self = this;

  let neighbors = self.getNeighborsList();
  let isConnectedToRing = false;

  neighbors.forEach(neighbor => {
    if (neighbor.pseudoClass == "ring"){
      isConnectedToRing = true;
      return true;
    }
  });

  return isConnectedToRing;
};

module.exports = SBGNNode;