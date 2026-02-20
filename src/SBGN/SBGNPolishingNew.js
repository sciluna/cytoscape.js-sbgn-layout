const SBGNConstants = require('./SBGNConstants');

function SBGNPolishingNew() {
}

SBGNPolishingNew.polish = function (sbgnLayout) {
  let allNodes = sbgnLayout.getAllNodes();
  let processNodes = sbgnLayout.getAllProcessNodes();
  processNodes.forEach(process => {
    let edges = process.edges.filter(edge => {
      return edge.direction;
    });
    for (let i = 0; i < edges.length; i++ ) {
      if(edges[i].direction && (edges[i].direction == 'l-r' || edges[i].direction == 'r-l' || edges[i].direction == 't-b' || edges[i].direction == 'b-t')) {
        process.direction = edges[i].direction;
        break;
      } else if (edges[i].direction == 'tl-br' || edges[i].direction == 'tr-bl' || edges[i].direction == 'br-tl' || edges[i].direction == 'bl-tr') {
          process.direction = 't-b';
      }
    };
    let predecessors = [];
    let incomers = process.getIncomerNodes();
    incomers.forEach(incomer => {
      predecessors = predecessors.concat(incomer.getIncomerNodes());
    });
    let successors = [];
    let outgoers = process.getOutgoerNodes();
    outgoers.forEach(outgoer => {
      successors = successors.concat(outgoer.getOutgoerNodes());
    });
    let before = false;
    let after = false;
    predecessors.forEach(node => {
      if(node.isProcess()) {
        before = true;
      }
    });
    successors.forEach(node => {
      if(node.isProcess()) {
        after = true;
      }
    });
    if(before && after) {
      process.status = "middle";
    } else if(before) {
      process.status = "last";
    } else if(after) {
      process.status = "first";
    }
    // console.log(process.status);
  });

  this.addPerProcessPolishment(processNodes);
}

SBGNPolishingNew.generateConstraints = function (sbgnLayout, mapType, slopeThreshold) {
  let allNodes = sbgnLayout.getAllNodes();
  let oneDegreeNodes = new Set();
  let multiDegreeNodes = new Set();
  allNodes.forEach(node => {
    if(node.getNeighborsList().size == 1) {
      oneDegreeNodes.add(node);
    } else {
      multiDegreeNodes.add(node);
    }
  });
  
  let relativePlacementConstraints = [];
  let verticalAlignments = [];
  let horizontalAlignments = [];
  let allEdges = sbgnLayout.getAllEdges();
  allEdges.forEach(edge => {
    let source = edge.getSource();
    let target = edge.getTarget();
    if ((!oneDegreeNodes.has(source) && !oneDegreeNodes.has(target) && mapType == "PD") || (mapType == "AF")){
      let direction = this.getDirection(source, target, slopeThreshold);
      edge.direction = direction;
      if (direction == "l-r") {
        let relativePlacement = [];
        relativePlacement.push({left: source.id, right: target.id});
        horizontalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "r-l") {
        let relativePlacement = [];
        relativePlacement.push({left: target.id, right: source.id});
        horizontalAlignments.push([source.id, target.id]); 
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "t-b") {
        let relativePlacement = [];
        relativePlacement.push({top: source.id, bottom: target.id});
        verticalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "b-t") {
        let relativePlacement = [];
        relativePlacement.push({top: target.id, bottom: source.id});
        verticalAlignments.push([source.id, target.id]);
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "tl-br") {
        let relativePlacement = [];
        relativePlacement.push({left: source.id, right: target.id});
        relativePlacement.push({top: source.id, bottom: target.id});
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "br-tl") {
        let relativePlacement = [];
        relativePlacement.push({left: target.id, right: source.id});
        relativePlacement.push({top: target.id, bottom: source.id});
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "tr-bl") {
        let relativePlacement = [];
        relativePlacement.push({left: target.id, right: source.id});
        relativePlacement.push({top: source.id, bottom: target.id});
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      } else if (direction == "bl-tr") {
        let relativePlacement = [];
        relativePlacement.push({left: source.id, right: target.id});
        relativePlacement.push({top: target.id, bottom: source.id});
        relativePlacementConstraints = relativePlacementConstraints.concat(relativePlacement);  
      }
    }
  });

  if (verticalAlignments.length) {
    verticalAlignments = mergeArrays(verticalAlignments);
  }
  if (horizontalAlignments.length) {
    horizontalAlignments = mergeArrays(horizontalAlignments);
  }

  // remove conflicts between relative and alignment constraints
  // traverse relative constraints and if both nodes are found in 
  // opposite alignment constraints, remove that relative constraint
  for(let i = relativePlacementConstraints.length - 1; i >= 0; i--) {
    let constraint = relativePlacementConstraints[i];  
    if (constraint.left) {
      let left = constraint.left;
      let right = constraint.right;
      verticalAlignments.forEach(verticalAlignment => {
        if(verticalAlignment.includes(left) && verticalAlignment.includes(right)) {
          relativePlacementConstraints.splice(i, 1);
        }
      });
    } else if (constraint.top) {
      let top = constraint.top;
      let bottom = constraint.bottom;
      horizontalAlignments.forEach(horizontalAlignment => {
        if(horizontalAlignment.includes(top) && horizontalAlignment.includes(bottom)) {
          relativePlacementConstraints.splice(i, 1);
        }
      });
    }
  }
  
  let alignmentConstraints = { vertical: verticalAlignments.length > 0 ? verticalAlignments : undefined, horizontal: horizontalAlignments.length > 0 ? horizontalAlignments : undefined }

  return { relativePlacementConstraint: relativePlacementConstraints, alignmentConstraint: alignmentConstraints }
};

// calculates line direction
SBGNPolishingNew.getDirection = function(source, target, slopeThreshold = 0.5) {
  let direction = "l-r";
  if (Math.abs(target.getCenterY() - source.getCenterY()) / Math.abs(target.getCenterX() - source.getCenterX()) < slopeThreshold) {
    if (target.getCenterX() - source.getCenterX() > 0) {
      direction = "l-r";
    } else {
      direction = "r-l";
    }
  } else if (Math.abs(target.getCenterX() - source.getCenterX()) / Math.abs(target.getCenterY() - source.getCenterY()) < slopeThreshold) {
    if (target.getCenterY() - source.getCenterY() > 0) {
      direction = "t-b";
    } else {
      direction = "b-t";
    }
  } else if (target.getCenterY() - source.getCenterY() > 0 && target.getCenterX() - source.getCenterX() > 0) {
    direction = "tl-br";
  } else if (target.getCenterY() - source.getCenterY() < 0 && target.getCenterX() - source.getCenterX() < 0) {
    direction = "br-tl";
  } else if (target.getCenterY() - source.getCenterY() > 0 && target.getCenterX() - source.getCenterX() < 0) {
    direction = "tr-bl";
  } else if (target.getCenterY() - source.getCenterY() < 0 && target.getCenterX() - source.getCenterX() > 0) {
    direction = "bl-tr";
  }
  return direction;
};

// auxuliary function to merge arrays with duplicates
let mergeArrays = function (arrays) {
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
};

SBGNPolishingNew.addPerProcessPolishment = function (processes, directions) {
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
      let radius = idealEdgeLength / 2 + (nodeA.getDiagonal() / 2 + nodeB.getDiagonal() / 2);
      return { x: nodeA.getCenterX() + radius * Math.cos(radian), y: nodeA.getCenterY() - radius * Math.sin(radian) };
    }
  };

  let placeLogicalOperators = function(modulator, a1, a2, a3){
    let incomers = modulator.getIncomerNodes();
    if (incomers.length == 1) {
      let position = calculatePosition(modulator, incomers[0], idealEdgeLength, a1);
      incomers[0].setCenter(position.x, position.y);
    }
    else if(incomers.length == 2) {
      let position = calculatePosition(modulator, incomers[0], idealEdgeLength, a2);
      incomers[0].setCenter(position.x, position.y);
      position = calculatePosition(modulator, incomers[1], idealEdgeLength, a3);
      incomers[1].setCenter(position.x, position.y);
    }
  };

  // first process input nodes (except modulators)
  processes.forEach((node, j) => {
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
      if (input.pseudoClass != "ring" && (edgeBetween.class == "modulation" || edgeBetween.class == "stimulation" || edgeBetween.class == "catalysis" || edgeBetween.class == "inhibition" || edgeBetween.class == "necessary stimulation") && (input.getNeighborsList().size == 1 || input.isLogicalOperator())) {
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
    if (node.status == 'first') {  // first node and not connected to ring
      if (node.direction == "l-r") {
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
      if (node.direction == "r-l") {
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
      if (node.direction == "t-b") {
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
      if (node.direction == "b-t") {
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
    else if (node.status == 'middle'){ // an intermediate node - think about if connected to ring
      if (node.direction == "l-r") {
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
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 90, 45, 135);
          }
        }
        else if (modulators.length == 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 90, 45, 135);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 270);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 270, 225, 315);
          }
        }
        else if (modulators.length > 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 60);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 90, 45, 135);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 120);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 90, 45, 135);
          }
          position = calculatePosition(node, modulators[2], idealEdgeLength, 270);
          modulators[2].setCenter(position.x, position.y);
          if(modulators[2].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[2], 270, 225, 315);
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
            position = calculatePosition(node, outputs[2], idealEdgeLength, 300);
            outputs[2].setCenter(position.x, position.y);
            if (outputs[3]) {
              position = calculatePosition(node, outputs[3], idealEdgeLength, 60);
              outputs[3].setCenter(position.x, position.y);
            }
          }
        }
      }
      if (node.direction == "r-l") {
        // process inputs
        if (inputs.length == 1) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
          inputs[0].setCenter(position.x, position.y);
        }
        else if (inputs.length == 2) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
          inputs[0].setCenter(position.x, position.y);
          position = calculatePosition(node, inputs[1], idealEdgeLength, 315);
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
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 270, 225, 315);
          }
        }
        else if (modulators.length == 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 90);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 90, 45, 135);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 270);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 270, 225, 315);
          }
        }
        else if (modulators.length > 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 60);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 90, 45, 135);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 120);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 90, 45, 135);
          }
          position = calculatePosition(node, modulators[2], idealEdgeLength, 270);
          modulators[2].setCenter(position.x, position.y);
          if(modulators[2].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[2], 270, 225, 315);
          }
        }
        // process outputs
        if (outputs.length == 1) {
          let position = calculatePosition(node, outputs[0], idealEdgeLength, 135);
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
      if (node.direction == "t-b") {
        // process inputs
        if (inputs.length == 1) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 135);
          inputs[0].setCenter(position.x, position.y);
        }
        else if (inputs.length == 2) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 135);
          inputs[0].setCenter(position.x, position.y);
          position = calculatePosition(node, inputs[1], idealEdgeLength, 45);
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
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 0, 45, 315);
          }
        }
        else if (modulators.length == 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 180, 135, 225);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 0);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 0, 45, 315);
          }
        }
        else if (modulators.length > 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 150);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 180, 135, 225);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 210);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 180, 135, 225);
          }
          position = calculatePosition(node, modulators[2], idealEdgeLength, 0);
          modulators[2].setCenter(position.x, position.y);
          if(modulators[2].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[2], 0, 45, 315);
          }
        }
        // process outputs
        if (outputs.length == 1) {
          let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
          outputs[0].setCenter(position.x, position.y);
        }
        else if (outputs.length == 2) {
          let position = calculatePosition(node, outputs[0], idealEdgeLength, 225);
          outputs[0].setCenter(position.x, position.y);
          position = calculatePosition(node, outputs[1], idealEdgeLength, 315);
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
      if (node.direction == "b-t") {
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
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 180, 135, 225);
          }
        }
        else if (modulators.length == 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 180);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 180, 135, 225);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 0);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 0, 45, 315);
          }
        }
        else if (modulators.length > 2) {
          let position = calculatePosition(node, modulators[0], idealEdgeLength, 150);
          modulators[0].setCenter(position.x, position.y);
          if(modulators[0].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[0], 180, 135, 225);
          }
          position = calculatePosition(node, modulators[1], idealEdgeLength, 210);
          modulators[1].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 180, 135, 225);
          }
          position = calculatePosition(node, modulators[2], idealEdgeLength, 0);
          modulators[2].setCenter(position.x, position.y);
          if(modulators[1].isLogicalOperator()) {   // if logical operator
            placeLogicalOperators(modulators[1], 0, 45, 315);
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
    else { //if last node and not connected to ring, or first node, connected to ring but connected as a target
      if (node.direction == "l-r") {
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
      if (node.direction == "r-l") {
        // process inputs
        if (inputs.length == 1) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
          inputs[0].setCenter(position.x, position.y);
        }
        else if (inputs.length == 2) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 45);
          inputs[0].setCenter(position.x, position.y);
          position = calculatePosition(node, inputs[1], idealEdgeLength, 315);
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
      if (node.direction == "t-b") {
        // process inputs
        if (inputs.length == 1) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 135);
          inputs[0].setCenter(position.x, position.y);
        }
        else if (inputs.length == 2) {
          let position = calculatePosition(node, inputs[0], idealEdgeLength, 135);
          inputs[0].setCenter(position.x, position.y);
          position = calculatePosition(node, inputs[1], idealEdgeLength, 45);
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
      if (node.direction == "b-t") {
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

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

module.exports = SBGNPolishingNew;
