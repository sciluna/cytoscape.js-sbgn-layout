const CoSEGraph = require('cose-base').CoSEGraph;

function SBGNGraph(parent, graphMgr, vGraph) {
    CoSEGraph.call(this, parent, graphMgr, vGraph);
}

SBGNGraph.prototype = Object.create(CoSEGraph.prototype);

for (let prop in CoSEGraph) {
  SBGNGraph[prop] = CoSEGraph[prop];
}

module.exports = SBGNGraph;