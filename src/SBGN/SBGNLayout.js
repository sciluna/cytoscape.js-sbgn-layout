const CoSELayout = require('cose-base').CoSELayout;
const SBGNGraphManager = require('./SBGNGraphManager');
const SBGNConstants = require('./SBGNConstants');
const SBGNGraph = require('./SBGNGraph');
const SBGNNode = require('./SBGNNode');
const SBGNEdge = require('./SBGNEdge');

// Constructor
function SBGNLayout() {
  CoSELayout.call(this);
}

SBGNLayout.prototype = Object.create(CoSELayout.prototype);

for (let property in CoSELayout) {
  SBGNLayout[property] = CoSELayout[property];
}

// -----------------------------------------------------------------------------
// Section: Class methods related to Graph Manager
// -----------------------------------------------------------------------------
SBGNLayout.prototype.newGraphManager = function(){
  this.graphManager = new SBGNGraphManager(this);
  return this.graphManager;
};

SBGNLayout.prototype.newGraph = function (vGraph) {
  return new SBGNGraph(null, this.graphManager, vGraph);
};

SBGNLayout.prototype.newNode = function (vNode) {
  return new SBGNNode(this.graphManager, vNode);
};

SBGNLayout.prototype.newEdge = function (vEdge) {
  return new SBGNEdge(null, null, vEdge);
};

SBGNLayout.prototype.getAllProcessNodes = function () {
  return this.graphManager.getAllProcessNodes();
};

///////////////////////////////////////////////////////

SBGNLayout.prototype.constructSkeleton = function(){
  let queue = [];
  let allNodes = this.getAllNodes();
  let processNodes = this.getAllProcessNodes();

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
    if(component.length == 1 && component[0].isProcess()) {
      componentIndexesToBeExpanded.add(i);
    }
  });

  componentIndexesToBeExpanded.forEach(index => {
    let component = components[index];
    let process = component[0];
    let candidateNode = null;
    let otherProcess = null;
    process.getIncomerNodes().forEach(node => {
      if(node.getOutgoerNodes().filter((node) => node.isProcess()).length > 1) {
        candidateNode = node;
      }
    });
    if(candidateNode) {
      components[index].unshift(candidateNode);
      otherProcess = candidateNode.getOutgoerNodes().filter((node) => node.isProcess()).filter((node) => node.id != process.id)[0];
      components.forEach((component, i) => {
        if(component.includes(otherProcess)) {
          components[i].unshift(candidateNode);
        }
      });
    }
  });

  let nodesWithRingClass = new Set(allNodes.filter((node) => node.pseudoClass == "ring"));
  // process components to separate ring nodes
  let componentsInfo = this.processComponents(components, nodesWithRingClass);
  components = componentsInfo.components;
  let ringNodes = componentsInfo.ringNodes;
  let directions = componentsInfo.directions
  let verticalAlignments = componentsInfo.verticalAlignments;
	let horizontalAlignments = componentsInfo.horizontalAlignments;
  let relativePlacementConstraints = componentsInfo.relativePlacementConstraints;
  console.log(ringNodes);
  console.log(components);

  let componentsExtended = this.extendComponents(components);

  console.log(componentsExtended);
  console.log(directions);
  

  let constraintInfo = this.addPerComponentConstraints(components, directions);
  verticalAlignments = verticalAlignments.concat(constraintInfo.verticalAlignments);
  horizontalAlignments = horizontalAlignments.concat(constraintInfo.horizontalAlignments);
  verticalAlignments = this.mergeArrays(verticalAlignments);
	horizontalAlignments = this.mergeArrays(horizontalAlignments);
/*   let verticalAlignments = constraintInfo.verticalAlignments.length > 0 ? constraintInfo.verticalAlignments: undefined;
  let horizontalAlignments = constraintInfo.horizontalAlignments.length > 0 ? constraintInfo.horizontalAlignments : undefined; */
  relativePlacementConstraints = relativePlacementConstraints.concat(constraintInfo.relativePlacementConstraints);

  let constraints = {alignmentConstraint: {vertical: verticalAlignments, horizontal: horizontalAlignments},relativePlacementConstraint: relativePlacementConstraints};
  console.log(constraints);
  return {components: components, componentsExtended: componentsExtended, ringNodes: ringNodes, constraints: constraints, directions: directions};
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
  let relativePlacementConstraints = [];
  let directions = [];
  // first, process components with nodes that have ring class
  components.forEach((component, i) => {
    if(component.length > 1) {
      let direction = [null, null];
      if(component[0].pseudoClass == "ring") {
        ringNodes1.add(component[0]);
        if(Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())){
          direction[0] = "horizontal";
          horizontalAlignments.push([component[0].id, component[1].id]);
/*           if(component[1].getCenterX() > component[0].getCenterX())
            relativePlacementConstraints.push({left: component[0].id, right: component[1].id});
          else
            relativePlacementConstraints.push({left: component[1].id, right: component[0].id}); */
        }
        else {
          direction[0] = "vertical";
          verticalAlignments.push([component[0].id, component[1].id]);
/*           if(component[1].getCenterY() > component[0].getCenterY())
            relativePlacementConstraints.push({top: component[0].id, bottom: component[1].id});
          else
            relativePlacementConstraints.push({top: component[1].id, bottom: component[0].id}); */
        }
        component = component.filter((node) => node.id != component[0].id);
        components[i] = component;
      }
      if(component[component.length - 1].pseudoClass == "ring") {
        ringNodes1.add(component[component.length - 1]);
        if(Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())){
          direction[1] = "horizontal";
          horizontalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
/*           if(component[component.length - 2].getCenterX() > component[component.length - 1].getCenterX())
            relativePlacementConstraints.push({left: component[component.length - 1].id, right: component[component.length - 2].id});
          else
            relativePlacementConstraints.push({left: component[component.length - 2].id, right: component[component.length - 1].id}); */
        }
        else {
          direction[1] = "vertical";
          verticalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
/*           if(component[component.length - 2].getCenterY() > component[component.length - 1].getCenterY())
            relativePlacementConstraints.push({top: component[component.length - 1].id, bottom: component[component.length - 2].id});
          else
            relativePlacementConstraints.push({top: component[component.length - 2].id, bottom: component[component.length - 1].id}); */
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
      ringNodes1.add(component[0]);
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
        ringNodes2.add(commonNode);
      }
      if(component[component.length - 1].id == componentToCompare[0].id || component[component.length - 1].id == componentToCompare[componentToCompare.length - 1].id ){
        let commonNode = component[component.length - 1];
        ringNodes2.add(commonNode);
      }     
    }
  }

  components.forEach((component, i) => {
    let direction = [null, null];
    if(ringNodes2.has(component[0])){
      if(Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())){
        direction[0] = "horizontal";
        horizontalAlignments.push([component[0].id, component[1].id]);
/*         if(component[1].getCenterX() > component[0].getCenterX())
          relativePlacementConstraints.push({left: component[0].id, right: component[1].id});
        else
          relativePlacementConstraints.push({left: component[1].id, right: component[0].id}); */
      }
      else {
        direction[0] = "vertical";
        verticalAlignments.push([component[0].id, component[1].id]);
/*         if(component[1].getCenterY() > component[0].getCenterY())
          relativePlacementConstraints.push({top: component[0].id, bottom: component[1].id});
        else
          relativePlacementConstraints.push({top: component[1].id, bottom: component[0].id}); */
      }
      component = component.filter((node) => node.id != component[0].id);
      components[i] = component;
    }
    if (ringNodes2.has(component[component.length - 1])){
      if(Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())){
        direction[1] = "horizontal";
        horizontalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
/*         if(component[component.length - 2].getCenterX() > component[component.length - 1].getCenterX())
          relativePlacementConstraints.push({left: component[component.length - 1].id, right: component[component.length - 2].id});
        else
          relativePlacementConstraints.push({left: component[component.length - 2].id, right: component[component.length - 1].id}); */
      }
      else {
        direction[1] = "vertical";
        verticalAlignments.push([component[component.length - 1].id, component[component.length - 2].id]);
/*         if(component[component.length - 2].getCenterY() > component[component.length - 1].getCenterY())
          relativePlacementConstraints.push({top: component[component.length - 1].id, bottom: component[component.length - 2].id});
        else
          relativePlacementConstraints.push({top: component[component.length - 2].id, bottom: component[component.length - 1].id}); */
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
  return {components: components, ringNodes: new Set([...nodesWithRingClass, ...ringNodes1, ...ringNodes2]), directions: directions, horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints};
};

// Extend components (reaction chains) with one degree neighbors
SBGNLayout.prototype.extendComponents = function (components){
  let componentsExtended = [];
  components.forEach((component, i) => {
    let componentExtended = [];
    component.forEach(node => {
      componentExtended.push(node);
      let neighbors = node.getNeighborsList();
      neighbors.forEach((neighbor) => {
        if (neighbor.getEdges().length == 1) {
          componentExtended.push(neighbor);
        }
      });
    });
    //componentExtended.move({parent: componentParent.id()});
    //componentExtended.css('background-color', getRandomColor());
    componentsExtended.push(componentExtended);
  });
  return componentsExtended;
};

SBGNLayout.prototype.addPerComponentConstraints = function (components, directions){
  let horizontalAlignments = [];
  let verticalAlignments = [];
  let relativePlacementConstraints = [];

  directions.forEach((direction, i) => {
    if(direction == "horizontal" && components[i].length > 1) {
      horizontalAlignments.push(components[i].map(node => node.id));

      let isLeftToRight = true;
      if(components[i][0].getCenterX() > components[i][1].getCenterX())
        isLeftToRight = false;

      if(isLeftToRight){
        components[i].forEach((node, j) => {
          if(j != components[i].length - 1){
            relativePlacementConstraints.push({left: node.id, right: components[i][j+1].id});
          }
        });
      }
      else {
        components[i].forEach((node, j) => {
          if(j != components[i].length - 1){
            relativePlacementConstraints.push({left: components[i][j+1].id, right: node.id});
          }
        });
      }
    }
    else if(direction == "vertical" && components[i].length > 1){
      verticalAlignments.push(components[i].map(node => node.id));

      let isTopToBottom = true;
      if(components[i][0].getCenterY() > components[i][1].getCenterY())
        isTopToBottom = false;

      if(isTopToBottom){
        components[i].forEach((node, j) => {
          if(j != components[i].length - 1){
            relativePlacementConstraints.push({top: node.id, bottom: components[i][j+1].id});
          }
        });
      }
      else {
        components[i].forEach((node, j) => {
          if(j != components[i].length - 1){
            relativePlacementConstraints.push({top: components[i][j+1].id, bottom: node.id});
          }
        });
      }
    }
  });

  return {horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints};
};

SBGNLayout.prototype.addPerComponentPolishingConstraints = function (components, directions){
  let horizontalAlignments = [];
  let verticalAlignments = [];
  let relativePlacementConstraints = [];

  let idealEdgeLength = SBGNConstants.DEFAULT_EDGE_LENGTH;

  let calculateDiagonal = function(nodeA, nodeB, idealEdgeLength, direction) {
    if (direction == "diagonal")
      return 2 * (nodeA.getWidth() / 2) + (3 / 5) * idealEdgeLength;
    else if (direction == "horizontal")
      return nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength;
    else
      return nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength;
  };

  // first process input nodes (except modulators)
  components.forEach((component, i) => {
    if(component.length > 1) {
      let orientation = "";
      if (directions[i] == "horizontal") {
        if(component[0].getCenterX() > component[1].getCenterX())
          orientation = "right-to-left";
        else
          orientation = "left-to-right";
      }
      else {
        if(component[0].getCenterY() > component[1].getCenterY())
          orientation = "bottom-to-top";
        else
          orientation = "top-to-bottom";
      }
      component.forEach((node, j) => {
        let incomers = node.getIncomerNodes();
        let outgoers = node.getOutgoerNodes();
        // find input nodes (filter ring nodes, modulator nodes and input with degree higher than 1)
        let inputs = incomers.filter((input) => {
          let edgeBetween = node.getEdgesBetween(input)[0];
          if(input.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || input.getNeighborsList().size > 1) {
            return false;
          }
          else {
            return true;
          }
        });
        // find modulator nodes (filter ring nodes, non-modulator nodes and input with degree higher than 1)
        let modulators = incomers.filter((input) => {
          let edgeBetween = node.getEdgesBetween(input)[0];
          if(input.pseudoClass != "ring" && (edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation") && input.getNeighborsList().size == 1) {
            return true;
          }
          else {
            return false;
          }
        });
        // find output nodes (filter ring nodes, modulator nodes and output with degree higher than 1)
        let outputs = outgoers.filter((output) => {
          let edgeBetween = node.getEdgesBetween(output)[0];
          if(output.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || output.getNeighborsList().size > 1) {
            return false;
          }
          else {
            return true;
          }
        });
        if (j == 0 && !node.isConnectedToRing()) {  // first node and not connected to ring
          if(orientation == "left-to-right") {
            // process inputs
            if (inputs.length == 1){
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "horizontal"), node.getCenterY());
              horizontalAlignments.push([node, inputs[0]]);
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            }
            else if (inputs.length > 3){
              inputs.forEach(input => {
                relativePlacementConstraints.push({left: input.id, right: node.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              verticalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length >= 2) {
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              modulators[1].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "vertical"));
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else */
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({left: node.id, right: output.id});
              });
            }
          }
          if(orientation == "right-to-left") {
            // process inputs
            if (inputs.length == 1){
              inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "horizontal"), node.getCenterY());
              horizontalAlignments.push([node, inputs[0]]);
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            }
            else if (inputs.length > 3){
              inputs.forEach(input => {
                relativePlacementConstraints.push({left: node.id, right: input.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              verticalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length >= 2) {
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              modulators[1].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "vertical"));
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else */
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({left: output.id, right: node.id});
              });
            }
          }
          if(orientation == "top-to-bottom") {
            // process inputs
            if (inputs.length == 1){
              inputs[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "vertical"));
              verticalAlignments.push([node, inputs[0]]);
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, inputs[1], idealEdgeLength, "vertical"));
              inputs[2].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              verticalAlignments.push([node, inputs[1]]);
            }
            else if (inputs.length > 3){
              inputs.forEach(input => {
                relativePlacementConstraints.push({top: input.id, bottom: node.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              horizontalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length >= 2) {
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              modulators[1].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"));
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else */
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({top: node.id, bottom: output.id});
              });
            }        
          }
          if(orientation == "bottom-to-top") {
            // process inputs
            if (inputs.length == 1){
              inputs[0].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "vertical"));
              verticalAlignments.push([node, inputs[0]]);
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "vertical"));
              inputs[2].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              verticalAlignments.push([node, inputs[1]]);
            }
            else if (inputs.length > 3){
              inputs.forEach(input => {
                relativePlacementConstraints.push({top: node.id, bottom: input.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              horizontalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length == 2) {
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              modulators[1].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"));
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else */
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({top: output.id, bottom: node.id});
              });
            }
          }
        }
        else { // an intermediate node - think about if connected to ring
          if(orientation == "left-to-right") {
            // process inputs
            if (inputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              else */
                inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length > 2){
              inputs.forEach(input => {
                relativePlacementConstraints.push({left: input.id, right: node.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              verticalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length >= 2) {
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              modulators[1].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "vertical"));
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else */
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({left: node.id, right: output.id});
              });
            }
          }
          if(orientation == "right-to-left") {
            // process inputs
            if (inputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              else */
                inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length > 2){
              inputs.forEach(input => {
                relativePlacementConstraints.push({left: node.id, right: input.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              verticalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length >= 2) {
              modulators[0].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[0], idealEdgeLength, "vertical"));
              modulators[1].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "vertical"));
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
              let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({left: output.id, right: node.id});
              });
            }
          }
          if(orientation == "top-to-bottom") {
            // process inputs
            if (inputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              else */
                inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length > 2){
              inputs.forEach(input => {
                relativePlacementConstraints.push({top: input.id, bottom: node.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              horizontalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length >= 2) {
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              modulators[1].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX(), node.getCenterY() - calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"));
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
              let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({top: node.id, bottom: output.id});
              });
            } 
          }
          if(orientation == "bottom-to-top") {
            // process inputs
            if (inputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              else */
                inputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length == 2) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[1], idealEdgeLength, "diagonal"));
            }
            else if (inputs.length > 2){
              inputs.forEach(input => {
                relativePlacementConstraints.push({top: node.id, bottom: input.id});
              });
            }
            // process modulators
            if (modulators.length == 1){
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              horizontalAlignments.push([node, modulators[0]]);
            }
            else if (modulators.length == 2) {
              modulators[0].setCenter(node.getCenterX() - calculateDiagonal(node, modulators[0], idealEdgeLength, "horizontal"), node.getCenterY());
              modulators[1].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"), node.getCenterY());
              if (modulators[2]) {
                if (inputs.length == 1) {
                  modulators[2].setCenter(node.getCenterX() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "diagonal"));
                }
                if (inputs.length == 2) {
                  modulators[2].setCenter(node.getCenterX(), node.getCenterY() + calculateDiagonal(node, modulators[1], idealEdgeLength, "horizontal"));
                }
              }
            }
            // process outputs
            if (outputs.length == 1){
/*               let random = Math.random();
              if (random > 0.5)
                outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              else */
              outputs[0].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
            }
            else if (outputs.length == 2) {
              outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
              outputs[1].setCenter(node.getCenterX() + calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[1], idealEdgeLength, "diagonal"));
            }
/*             else if (outputs.length == 3) {
              inputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, inputs[0], idealEdgeLength, "diagonal"));
              inputs[1].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[1], idealEdgeLength, "horizontal"), node.getCenterY());
              inputs[2].setCenter(node.getCenterX() - calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"), node.getCenterY() + calculateDiagonal(node, inputs[2], idealEdgeLength, "diagonal"));
              horizontalAlignments.push([node, inputs[1]]);
            } */
            else if (outputs.length > 3){
              outputs.forEach(output => {
                relativePlacementConstraints.push({top: output.id, bottom: node.id});
              });
            }
          }
        }
      });
    }
    else {

    }
  });

  return {horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints};
};

// auxuliary function to merge arrays with duplicates
SBGNLayout.prototype.mergeArrays = function (arrays) {
	// Function to check if two arrays have common items
	function haveCommonItems(arr1, arr2) {
			return arr1.some(item => arr2.includes(item));
	}

	// Function to merge two arrays and remove duplicates
	function mergeAndRemoveDuplicates(arr1, arr2) {
			return Array.from(new Set([...arr1, ...arr2]));
	}

	// Loop until no more merges are possible
	let merged = false;
	do {
			merged = false;
			for (let i = 0; i < arrays.length; i++) {
					for (let j = i + 1; j < arrays.length; j++) {
							if (haveCommonItems(arrays[i], arrays[j])) {
									// Merge the arrays
									arrays[i] = mergeAndRemoveDuplicates(arrays[i], arrays[j]);
									// Remove the merged array
									arrays.splice(j, 1);
									// Set merged to true to indicate a merge has occurred
									merged = true;
									break;
							}
					}
					if (merged) {
							break;
					}
			}
	} while (merged);

	return arrays;
}

module.exports = SBGNLayout;