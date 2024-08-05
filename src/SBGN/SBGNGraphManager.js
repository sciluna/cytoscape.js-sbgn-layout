const CoSEGraphManager = require('cose-base').CoSEGraphManager;

function SBGNGraphManager(layout) {
  CoSEGraphManager.call(this, layout);
}

SBGNGraphManager.prototype = Object.create(CoSEGraphManager.prototype);

for (let prop in CoSEGraphManager) {
  SBGNGraphManager[prop] = CoSEGraphManager[prop];
}

SBGNGraphManager.prototype.getAllProcessNodes = function ()
{
  let nodeList = [];
  let graphs = this.getGraphs();
  let s = graphs.length;
  for (let i = 0; i < s; i++)
  {
    nodeList = nodeList.concat(graphs[i].getNodes());
  }
  let processNodeList = nodeList.filter(node => {
    if(node.class == "process" || node.class == "omitted process" || node.class == "uncertain process")
      return true;
    else
      return false;
  });
  this.processNodes = processNodeList;

  return this.processNodes;
};

module.exports = SBGNGraphManager;