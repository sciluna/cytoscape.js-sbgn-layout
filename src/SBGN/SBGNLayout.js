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
SBGNLayout.prototype.newGraphManager = function () {
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

SBGNLayout.prototype.constructSkeleton = function () {
  let queue = [];
  let allNodes = this.getAllNodes();
  let processNodes = this.getAllProcessNodes();

  // find process nodes that are suitable to be source of DFS
  processNodes.forEach(process => {
    let neighbors = process.getNeighborsList();
    let count = 0;
    neighbors.forEach((neighbor) => {
      if (neighbor.getEdges().length > 1) {
        count++;
      }
    });
    if (count < 2) {
      let outgoers = process.getOutgoerNodes();
      for (let i = 0; i < outgoers.length; i++) {
        if (outgoers[i].getOutgoerNodes().length > 0) {
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
  for (let i = components.length - 1; i >= 0; i--) {
    if (components[i].length == 1 && components[i][0].pseudoClass == "ring") {
      components.splice(i, 1);
    }
  }

  // some postprocessing to shape components better
  let componentIndexesToBeExpanded = new Set();
  components.forEach((component, i) => {
    if (component.length == 1 && component[0].isProcess()) {
      componentIndexesToBeExpanded.add(i);
    }
  });

  componentIndexesToBeExpanded.forEach(index => {
    let component = components[index];
    let process = component[0];
    let candidateNode = null;
    let otherProcess = null;
    process.getIncomerNodes().forEach(node => {
      if (node.getOutgoerNodes().filter((node) => node.isProcess()).length > 1) {
        candidateNode = node;
      }
    });
    if (candidateNode) {
      components[index].unshift(candidateNode);
      otherProcess = candidateNode.getOutgoerNodes().filter((node) => node.isProcess()).filter((node) => node.id != process.id)[0];
      components.forEach((component, i) => {
        if (component.includes(otherProcess)) {
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
  ringNodes.forEach(ringNode => {
    ringNode.pseudoClass = "ring";
  });
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

  let constraints = { alignmentConstraint: { vertical: verticalAlignments, horizontal: horizontalAlignments }, relativePlacementConstraint: relativePlacementConstraints };
  console.log(constraints);
  return { components: components, componentsExtended: componentsExtended, ringNodes: ringNodes, constraints: constraints, directions: directions };
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

  if (neighborNodes.length == 1) {
    let neighbor = neighborNodes[0];
    //if (!visited.has(neighbor.id())) {
    component.push(neighbor);
    this.DFSUtil(neighbor, component, visited, visitedProcessNodeIds, queue);
    //} 
  }
  else if (neighborNodes.length > 1) {
    currentNode.pseudoClass = "ring";
    neighborNodes.forEach(function (neighbor) {
      if (neighbor.pseudoClass == "ringCandidate") {
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

SBGNLayout.prototype.DFS = function (node, visited, visitedProcessNodeIds, queue) {
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
    if (component.length > 1) {
      let direction = [null, null];
      if (component[0].pseudoClass == "ring") {
        ringNodes1.add(component[0]);
        if (Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())) {
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
      if (component[component.length - 1].pseudoClass == "ring") {
        ringNodes1.add(component[component.length - 1]);
        if (Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())) {
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
      if (direction[0] != null) {
        directions[i] = direction[0];
      }
      else if (direction[1] != null) {
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
  for (let i = 0; i < components.length; i++) {
    let component = components[i];
    for (let j = i + 1; j < components.length; j++) {
      let componentToCompare = components[j];
      if (component[0].id == componentToCompare[0].id || component[0].id == componentToCompare[componentToCompare.length - 1].id) {
        let commonNode = component[0]
        ringNodes2.add(commonNode);
      }
      if (component[component.length - 1].id == componentToCompare[0].id || component[component.length - 1].id == componentToCompare[componentToCompare.length - 1].id) {
        let commonNode = component[component.length - 1];
        ringNodes2.add(commonNode);
      }
    }
  }

  components.forEach((component, i) => {
    let direction = [null, null];
    if (ringNodes2.has(component[0])) {
      if (Math.abs(component[1].getCenterX() - component[0].getCenterX()) > Math.abs(component[1].getCenterY() - component[0].getCenterY())) {
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
    if (ringNodes2.has(component[component.length - 1])) {
      if (Math.abs(component[component.length - 2].getCenterX() - component[component.length - 1].getCenterX()) > Math.abs(component[component.length - 2].getCenterY() - component[component.length - 1].getCenterY())) {
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
    if (!directions[i]) {
      if (direction[0] != null) {
        directions[i] = direction[0];
      }
      else if (direction[1] != null) {
        directions[i] = direction[1];
      }
      else {
        if (Math.abs(component[component.length - 1].getCenterX() - component[0].getCenterX()) > Math.abs(component[component.length - 1].getCenterY() - component[0].getCenterY())) {
          directions[i] = "horizontal";
        }
        else {
          directions[i] = "vertical";
        }
      }
    }
  });
  return { components: components, ringNodes: new Set([...nodesWithRingClass, ...ringNodes1, ...ringNodes2]), directions: directions, horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

// Extend components (reaction chains) with one degree neighbors
SBGNLayout.prototype.extendComponents = function (components) {
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

SBGNLayout.prototype.addPerComponentConstraints = function (components, directions) {
  let horizontalAlignments = [];
  let verticalAlignments = [];
  let relativePlacementConstraints = [];

  directions.forEach((direction, i) => {
    if (direction == "horizontal" && components[i].length > 1) {
      horizontalAlignments.push(components[i].map(node => node.id));

      let isLeftToRight = true;
      if (components[i][0].getCenterX() > components[i][1].getCenterX())
        isLeftToRight = false;

      if (isLeftToRight) {
        components[i].forEach((node, j) => {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ left: node.id, right: components[i][j + 1].id });
          }
        });
      }
      else {
        components[i].forEach((node, j) => {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ left: components[i][j + 1].id, right: node.id });
          }
        });
      }
    }
    else if (direction == "vertical" && components[i].length > 1) {
      verticalAlignments.push(components[i].map(node => node.id));

      let isTopToBottom = true;
      if (components[i][0].getCenterY() > components[i][1].getCenterY())
        isTopToBottom = false;

      if (isTopToBottom) {
        components[i].forEach((node, j) => {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ top: node.id, bottom: components[i][j + 1].id });
          }
        });
      }
      else {
        components[i].forEach((node, j) => {
          if (j != components[i].length - 1) {
            relativePlacementConstraints.push({ top: components[i][j + 1].id, bottom: node.id });
          }
        });
      }
    }
  });

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

SBGNLayout.prototype.addPerComponentPolishingConstraints = function (components, directions) {
  let horizontalAlignments = [];
  let verticalAlignments = [];
  let relativePlacementConstraints = [];

  let idealEdgeLength = SBGNConstants.DEFAULT_EDGE_LENGTH;

  let calculatePosition = function (nodeA, nodeB, idealEdgeLength, degree) {
    if (degree == 0) {
      return { x: nodeA.getCenterX() + (nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength), y: nodeA.getCenterY() };
    }
    else if (degree == 90) {
      return { x: nodeA.getCenterX(), y: nodeA.getCenterY() - (nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength) };
    }
    else if (degree == 180) {
      return { x: nodeA.getCenterX() - (nodeA.getWidth() / 2 + nodeB.getWidth() / 2 + idealEdgeLength), y: nodeA.getCenterY() };
    }
    else if (degree == 270) {
      return { x: nodeA.getCenterX(), y: nodeA.getCenterY() + (nodeA.getHeight() / 2 + nodeB.getHeight() / 2 + idealEdgeLength) };
    }
    else {
      let radian = degree * Math.PI / 180;
      let radius = idealEdgeLength / 2 + 2 * nodeA.getDiagonal();
      return { x: nodeA.getCenterX() + radius * Math.cos(radian), y: nodeA.getCenterY() - radius * Math.sin(radian) };
    }
  };

  let findOrientation = function (edgeBetween, direction) {
    let source = edgeBetween.getSource();
    let target = edgeBetween.getTarget();
    if (direction == "horizontal") {
      if (source.getCenterX() > target.getCenterX())
        return "right-to-left";
      else
        return "left-to-right";
    }
    else {
      if (source.getCenterY() > target.getCenterY())
        return "bottom-to-top";
      else
        return "top-to-bottom";
    }
  };

  // first process input nodes (except modulators)
  components.forEach((component, i) => {
    let orientation = "";
    if (component.length > 1) {
      let edgeBetween = component[0].getEdgesBetween(component[1])[0];
      orientation = findOrientation(edgeBetween, directions[i]);
    }
    else if (component.length == 1) {
      let ringNeighbors = [...component[0].getNeighborsList()].filter(neighbor => { return neighbor.pseudoClass == "ring" });
      if (ringNeighbors.length == 1) {
        let ringNeighbor = ringNeighbors[0];
        let edgeBetween = component[0].getEdgesBetween(ringNeighbor)[0];
        orientation = findOrientation(edgeBetween, directions[i]);
      }
    }
    console.log(orientation);
    component.forEach((node, j) => {
      let incomers = node.getIncomerNodes();
      let outgoers = node.getOutgoerNodes();
      // find input nodes (filter ring nodes, modulator nodes and input with degree higher than 1)
      let inputs = incomers.filter((input) => {
        let edgeBetween = node.getEdgesBetween(input)[0];
        if (input.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || input.getNeighborsList().size > 1) {
          return false;
        }
        else {
          return true;
        }
      });
      // find modulator nodes (filter ring nodes, non-modulator nodes and input with degree higher than 1)
      let modulators = incomers.filter((input) => {
        let edgeBetween = node.getEdgesBetween(input)[0];
        if (input.pseudoClass != "ring" && (edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation") && input.getNeighborsList().size == 1) {
          return true;
        }
        else {
          return false;
        }
      });
      // find output nodes (filter ring nodes, modulator nodes and output with degree higher than 1)
      let outputs = outgoers.filter((output) => {
        let edgeBetween = node.getEdgesBetween(output)[0];
        if (output.pseudoClass == "ring" || edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation" || output.getNeighborsList().size > 1) {
          return false;
        }
        else {
          return true;
        }
      });
      if (j == 0 && !node.isConnectedToRing()) {  // first node and not connected to ring
        if (orientation == "left-to-right") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 180);
            inputs[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, inputs[0]]);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 135);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 225);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length == 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 135);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 180);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 225);
            inputs[2].setCenter(position.x, position.y);
            horizontalAlignments.push([node, inputs[1]]);
          }
          else if (inputs.length > 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 126);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 162);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 198);
            inputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[3], idealEdgeLength, 234);
            inputs[3].setCenter(position.x, position.y);
            inputs.forEach(input => {
              relativePlacementConstraints.push({ left: input.id, right: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(position.x, position.y);
            verticalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length >= 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(position.x, position.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 135);
                modulators[2].setCenter(position.x, position.y);
              }
              if (inputs.length == 2) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 180);
                modulators[2].setCenter(position.x, position.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 45);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 330);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 30);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 310);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 60);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
        if (orientation == "right-to-left") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 0);
            inputs[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, inputs[0]]);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 315);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length == 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 0);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 315);
            inputs[2].setCenter(position.x, position.y);
            horizontalAlignments.push([node, inputs[1]]);
          }
          else if (inputs.length > 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 36);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 324);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 72);
            inputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[3], idealEdgeLength, 288);
            inputs[3].setCenter(position.x, position.y);
            inputs.forEach(input => {
              relativePlacementConstraints.push({ left: input.id, right: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 270);
            modulators[0].setCenter(position.x, position.y);
            verticalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length >= 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(position.x, position.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 45);
                modulators[2].setCenter(position.x, position.y);
              }
              if (inputs.length == 2) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 0);
                modulators[2].setCenter(position.x, position.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {

            let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 210);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 150);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 240);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 120);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
        if (orientation == "top-to-bottom") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 90);
            inputs[0].setCenter(position.x, position.y);
            verticalAlignments.push([node, inputs[0]]);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 135);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length == 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 90);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 135);
            inputs[2].setCenter(position.x, position.y);
            horizontalAlignments.push([node, inputs[1]]);
          }
          else if (inputs.length > 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 72);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 108);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 36);
            inputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[3], idealEdgeLength, 144);
            inputs[3].setCenter(position.x, position.y);
            inputs.forEach(input => {
              relativePlacementConstraints.push({ left: input.id, right: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 0);
            modulators[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length >= 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(position.x, position.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 135);
                modulators[2].setCenter(position.x, position.y);
              }
              if (inputs.length == 2) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 90);
                modulators[2].setCenter(position.x, position.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 300);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 240);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 330);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 210);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
        if (orientation == "bottom-to-top") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 270);
            inputs[0].setCenter(position.x, position.y);
            verticalAlignments.push([node, inputs[0]]);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 225);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length == 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 270);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 225);
            inputs[2].setCenter(position.x, position.y);
            verticalAlignments.push([node, inputs[1]]);
          }
          else if (inputs.length > 3) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 288);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 252);
            inputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[2], idealEdgeLength, 324);
            inputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[3], idealEdgeLength, 216);
            inputs[3].setCenter(position.x, position.y);
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length >= 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(position.x, position.y);
            if (modulators[2]) {
              if (inputs.length == 1) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 225);
                modulators[2].setCenter(position.x, position.y);
              }
              if (inputs.length == 2) {
                position = calculatePosition(node, modulators[2], idealEdgeLength, 270);
                modulators[2].setCenter(position.x, position.y);
              }
            }
          }
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 60);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 120);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 30);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 150);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
      }
      else { // an intermediate node - think about if connected to ring
        if (orientation == "left-to-right") {
          // process inputs
          if (inputs.length == 1) {

            let position = calculatePosition(node, inputs[0], idealEdgeLength, 225);
            inputs[0].setCenter(position.x, position.y);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 225);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 135);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length > 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 210);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 150);
            inputs[1].setCenter(position.x, position.y);
            if (inputs[2]) {
              position = calculatePosition(node, inputs[2], idealEdgeLength, 240);
              inputs[2].setCenter(position.x, position.y);
              if (inputs[3]) {
                position = calculatePosition(node, inputs[3], idealEdgeLength, 120);
                inputs[3].setCenter(position.x, position.y);
              }
            }
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(position.x, position.y);
            verticalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length == 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 180);
            modulators[1].setCenter(position.x, position.y);
          }
          else if (modulators.length > 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 60);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 120);
            modulators[1].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[2], idealEdgeLength, 270);
            modulators[2].setCenter(position.x, position.y);
          }
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 45);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 330);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 30);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 300);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 60);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
        if (orientation == "right-to-left") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(position.x, position.y);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 45);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length > 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 330);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 30);
            inputs[1].setCenter(position.x, position.y);
            if (inputs[2]) {
              position = calculatePosition(node, inputs[2], idealEdgeLength, 300);
              inputs[2].setCenter(position.x, position.y);
              if (inputs[3]) {
                position = calculatePosition(node, inputs[3], idealEdgeLength, 60);
                inputs[3].setCenter(position.x, position.y);
              }
            }
            inputs.forEach(input => {
              relativePlacementConstraints.push({ left: node.id, right: input.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 270);
            modulators[0].setCenter(position.x, position.y);
            verticalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length == 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 270);
            modulators[1].setCenter(position.x, position.y);
          }
          else if (modulators.length > 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 60);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 120);
            modulators[1].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[2], idealEdgeLength, 270);
            modulators[2].setCenter(position.x, position.y);
          }
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 210);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 150);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 240);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 120);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
        if (orientation == "top-to-bottom") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(position.x, position.y);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 135);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length > 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 60);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 120);
            inputs[1].setCenter(position.x, position.y);
            if (inputs[2]) {
              position = calculatePosition(node, inputs[2], idealEdgeLength, 30);
              inputs[2].setCenter(position.x, position.y);
              if (inputs[3]) {
                position = calculatePosition(node, inputs[3], idealEdgeLength, 150);
                inputs[3].setCenter(position.x, position.y);
              }
            }
            inputs.forEach(input => {
              relativePlacementConstraints.push({ top: input.id, bottom: node.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 0);
            modulators[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length == 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 0);
            modulators[1].setCenter(position.x, position.y);
          }
          else if (modulators.length > 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 150);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 210);
            modulators[1].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[2], idealEdgeLength, 0);
            modulators[2].setCenter(position.x, position.y);
          }
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 315);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 300);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 240);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 330);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 210);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
        if (orientation == "bottom-to-top") {
          // process inputs
          if (inputs.length == 1) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(position.x, position.y);
          }
          else if (inputs.length == 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 315);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 225);
            inputs[1].setCenter(position.x, position.y);
          }
          else if (inputs.length > 2) {
            let position = calculatePosition(node, inputs[0], idealEdgeLength, 300);
            inputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, inputs[1], idealEdgeLength, 240);
            inputs[1].setCenter(position.x, position.y);
            if (inputs[2]) {
              position = calculatePosition(node, inputs[2], idealEdgeLength, 330);
              inputs[2].setCenter(position.x, position.y);
              if (inputs[3]) {
                position = calculatePosition(node, inputs[3], idealEdgeLength, 210);
                inputs[3].setCenter(position.x, position.y);
              }
            }
            inputs.forEach(input => {
              relativePlacementConstraints.push({ top: node.id, bottom: input.id });
            });
          }
          // process modulators
          if (modulators.length == 1) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
            modulators[0].setCenter(position.x, position.y);
            horizontalAlignments.push([node, modulators[0]]);
          }
          else if (modulators.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 180);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 0);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (modulators.length > 2) {
            let position = calculatePosition(node, modulators[0], idealEdgeLength, 150);
            modulators[0].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[1], idealEdgeLength, 210);
            modulators[1].setCenter(position.x, position.y);
            position = calculatePosition(node, modulators[2], idealEdgeLength, 0);
            modulators[2].setCenter(position.x, position.y);
          }
          // process outputs
          if (outputs.length == 1) {
            /*               let random = Math.random();
                          if (random > 0.5)
                            outputs[0].setCenter(node.getCenterX() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"), node.getCenterY() - calculateDiagonal(node, outputs[0], idealEdgeLength, "diagonal"));
                          else */
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(position.x, position.y);
          }

          else if (outputs.length > 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 60);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 120);
            outputs[1].setCenter(position.x, position.y);
            if (outputs[2]) {
              position = calculatePosition(node, outputs[2], idealEdgeLength, 30);
              outputs[2].setCenter(position.x, position.y);
              if (outputs[3]) {
                position = calculatePosition(node, outputs[3], idealEdgeLength, 150);
                outputs[3].setCenter(position.x, position.y);
              }
            }
          }
        }
      }
      if(j == component.length - 1 && !node.isConnectedToRing()) {
        if (orientation == "left-to-right") {
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 0);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 315);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length == 3) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 0);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 315);
            outputs[2].setCenter(position.x, position.y);
          }
          else if (outputs.length == 4) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 54);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 18);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 342);
            outputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[3], idealEdgeLength, 306);
            outputs[3].setCenter(position.x, position.y);
          }
        }
        if (orientation == "right-to-left") {
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 180);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 225);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length == 3) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 135);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 180);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 225);
            outputs[2].setCenter(position.x, position.y);
          }
          else if (outputs.length == 4) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 126);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 162);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 198);
            outputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[3], idealEdgeLength, 234);
            outputs[3].setCenter(position.x, position.y);
          }
        }
        if (orientation == "top-to-bottom") {
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 270);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 315);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length == 3) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 270);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 315);
            outputs[2].setCenter(position.x, position.y);
          }
          else if (outputs.length == 4) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 216);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 252);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 288);
            outputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[3], idealEdgeLength, 324);
            outputs[3].setCenter(position.x, position.y);
          }
        }
        if (orientation == "bottom-to-top") {
          // process outputs
          if (outputs.length == 1) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 90);
            outputs[0].setCenter(position.x, position.y);
          }
          else if (outputs.length == 2) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 135);
            outputs[1].setCenter(position.x, position.y);
          }
          else if (outputs.length == 3) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 45);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 90);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 135);
            outputs[2].setCenter(position.x, position.y);
          }
          else if (outputs.length == 4) {
            let position = calculatePosition(node, outputs[0], idealEdgeLength, 36);
            outputs[0].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[1], idealEdgeLength, 72);
            outputs[1].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[2], idealEdgeLength, 108);
            outputs[2].setCenter(position.x, position.y);
            position = calculatePosition(node, outputs[3], idealEdgeLength, 144);
            outputs[3].setCenter(position.x, position.y);
          }
        }
      }
    });
  });

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
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