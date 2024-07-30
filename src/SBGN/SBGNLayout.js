const CoSELayout = require('cose-base').CoSELayout;

// Constructor
function SBGNLayout() {
  CoSELayout.call(this);
}

SBGNLayout.prototype = Object.create(CoSELayout.prototype);

for (let property in CoSELayout) {
  SBGNLayout[property] = CoSELayout[property];
}

SBGNLayout.prototype.constructSkeleton = function(){
  let queue = [];
  let allNodes = this.getAllNodes();
  let processNodes = allNodes.filter((node) => node.class == "process");

  // find process nodes that are suitable to be source of DFS
  processNodes.forEach(process => {
    let neighbors = process.getNeighborsList();
    let count = 0;
    neighbors.forEach((neighbor) => {
      if(neighbor.getEdges().length > 1) {
        count++;
      }
    });
    if(count < 2) {
      let outgoers = process.getOutgoerNodes();
      for(let i = 0; i < outgoers.length; i++) {
        if(outgoers[i].getOutgoerNodes().length > 0){
          queue.push(process);
          break;
        }
      }
    }
  });
  console.log(queue);

  let components = [];
  let visited = new Set();
  let visitedProcessNodeIds = new Set();

  // run DFS on graph and find components (in skeleton format)
  while (queue.length > 0) {
    let cmpt = this.DFS(queue[0], visited, visitedProcessNodeIds, queue);
    components.push(cmpt);
    queue = queue.filter((element) => !visitedProcessNodeIds.has(element.id));
  }

  let unvisitedProcessNodes = processNodes.filter((process) => !visitedProcessNodeIds.has(process.id));

  unvisitedProcessNodes.forEach((node) => {
    let cmpt = this.DFS(node, visited, visitedProcessNodeIds, queue);
    components.push(cmpt);
  });

  // remove components with only one node that has ring class
  for(let i = components.length - 1; i >= 0; i--) {
    if(components[i].length == 1 && components[i][0].pseudoClass == "ring"){
      components.splice(i, 1);
    }
  }

  // some postprocessing to shape components better
  let componentIndexesToBeExpanded = new Set();
  components.forEach((component, i) => {
    if(component.length == 1 && component[0].class == "process") {
      componentIndexesToBeExpanded.add(i);
    }
  });

  componentIndexesToBeExpanded.forEach(index => {
    let component = components[index];
    let process = component[0];
    let candidateNode = null;
    let otherProcess = null;
    process.getIncomerNodes().forEach(node => {
      if(node.getOutgoerNodes().filter((node) => node.class == "process").length > 1) {
        candidateNode = node;
      }
    });
    if(candidateNode) {
      components[index].unshift(candidateNode);
      otherProcess = candidateNode.getOutgoerNodes().filter((node) => node.class == "process").filter((node) => node.id != process.id)[0];
      components.forEach((component, i) => {
        if(component.includes(otherProcess)) {
          components[i].unshift(candidateNode);
        }
      });
    }
  });

  let nodesWithRingClass = allNodes.filter((node) => node.pseudoClass == "ring");
  // process components to separate ring nodes
  let componentsInfo = this.processComponents(components, nodesWithRingClass);
  components = componentsInfo.components;
  let ringNodes = componentsInfo.ringNodes;
  let directions = componentsInfo.directions
  let verticalAlignments = componentsInfo.verticalAlignments;
	let horizontalAlignments = componentsInfo.horizontalAlignments;
  console.log(ringNodes);
  console.log(components);
}

// A function used by DFS
SBGNLayout.prototype.DFSUtil = function (currentNode, component, visited, visitedProcessNodeIds, queue) {

  visited.add(currentNode.id);
  if (currentNode.class == "process") {
    visitedProcessNodeIds.add(currentNode.id);
  }

  // Traverse all outgoer neigbors of this node
  let neighborNodes = [];
  currentNode.getOutgoerNodes().forEach(function (node) {
    if (node.getEdges().length != 1) {
      neighborNodes.push(node);
    }
  });

  if(neighborNodes.length == 1) {
    let neighbor = neighborNodes[0];
    //if (!visited.has(neighbor.id())) {
      component.push(neighbor);
      this.DFSUtil(neighbor, component, visited, visitedProcessNodeIds, queue);
    //} 
  }
  else if(neighborNodes.length > 1) {
    currentNode.pseudoClass = "ring";
    neighborNodes.forEach(function (neighbor) {
      if(neighbor.pseudoClass == "ringCandidate") {
        neighbor.pseudoClass = "ring";
      }
      else {
        neighbor.pseudoClass = "ringCandidate";
      }
      if (!visited.has(neighbor.id)) {
        queue.unshift(neighbor);
      }
    });
  }
};

SBGNLayout.prototype.DFS = function(node, visited, visitedProcessNodeIds, queue) {
  let cmpt = [];
  cmpt.push(node);
  queue.shift(node);
  this.DFSUtil(node, cmpt, visited, visitedProcessNodeIds, queue);
  return cmpt;
};

SBGNLayout.prototype.processComponents = function (components, nodesWithRingClass) {
  // ring nodes with 'ring' class
  let ringNodes1 = new Set();
  let verticalAlignments = [];
	let horizontalAlignments = [];
  let directions = [];
  // first, process components with nodes that have ring class
  components.forEach((component, i) => {
    if(component.length > 1) {
      let direction = [null, null];
      if(component[0].pseudoClass == "ring") {
        ringNodes1.add(component[0].id);
        if(Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())){
          direction[0] = "horizontal";
          horizontalAlignments.push([component[0].id, component[1].id]);
        }
        else {
          direction[0] = "vertical";
          verticalAlignments.push([component[0].id, component[1].id]);
        }
        component = component.filter((node) => node.id != component[0].id);
        components[i] = component;
      }
      if(component[component.length - 1].pseudoClass == "ring") {
        ringNodes1.add(component[component.length - 1].id);
        if(Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())){
          direction[1] = "horizontal";
          horizontalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
        }
        else {
          direction[1] = "vertical";
          verticalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
        }
        components[i] = component.filter((node) => node.id != component[component.length - 1].id);
      }
      if(direction[0] != null) {
        directions[i] = direction[0];
      }
      else if(direction[1] != null) {
        directions[i] = direction[1];
      }
    }
    else {
      ringNodes1.add(component[0].id);
      directions[i] = "horizontal";
    }
  });

  // ring nodes without 'ring' class
  let ringNodes2 = new Set();
  // second, process components with ring nodes that doesn't have ring class
  for(let i = 0; i < components.length; i++){
    let component = components[i];
    for(let j = i + 1; j < components.length; j++){
      let componentToCompare = components[j];
      if(component[0].id == componentToCompare[0].id || component[0].id == componentToCompare[componentToCompare.length - 1].id ){
        let commonNode = component[0]
        ringNodes2.add(commonNode.id);
      }
      if(component[component.length - 1].id == componentToCompare[0].id || component[component.length - 1].id == componentToCompare[componentToCompare.length - 1].id ){
        let commonNode = component[component.length - 1];
        ringNodes2.add(commonNode.id);
      }     
    }
  }

  components.forEach((component, i) => {
    let direction = [null, null];
    if(ringNodes2.has(component[0].id)){
      if(Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())){
        direction[0] = "horizontal";
        horizontalAlignments.push([component[0].id, component[1].id]);
      }
      else {
        direction[0] = "vertical";
        verticalAlignments.push([component[0].id, component[1].id]);
      }
      component = component.filter((node) => node.id != component[0].id);
      components[i] = component;
    }
    if (ringNodes2.has(component[component.length - 1].id)){
      if(Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())){
        direction[1] = "horizontal";
        horizontalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
      }
      else {
        direction[1] = "vertical";
        verticalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
      }
      components[i] = component.filter((node) => node.id != component[component.length - 1].id);
    }
    if(!directions[i]) {
      if(direction[0] != null) {
        directions[i] = direction[0];
      }
      else if(direction[1] != null) {
        directions[i] = direction[1];
      }
      else {
        if(Math.abs(component[component.length - 1].getCenterX() - component[0].getCenterX()) > Math.abs(component[component.length - 1].getCenterY() - component[0].getCenterY())){
          directions[i] = "horizontal";
        }
        else {
          directions[i] = "vertical";
        }
      }
    }
  });
  return {components: components, ringNodes: new Set([...ringNodes1, ...ringNodes2]), directions: directions, horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments};
};

module.exports = SBGNLayout;