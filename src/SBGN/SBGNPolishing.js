const LayoutConstants = require('cose-base').layoutBase.LayoutConstants;
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
        if(edges[i].getTarget().id == process.id) {
          break;
        }
      } else if (edges[i].direction == 'tl-br' || edges[i].direction == 'tr-bl' || edges[i].direction == 'br-tl' || edges[i].direction == 'bl-tr') {
          process.direction = edges[i].direction;
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
    incomers.forEach(incomer => {
      if(incomer.getEdges().length > 1) {
        before = true;
      }
    });
    successors.forEach(node => {
      if(node.isProcess()) {
        after = true;
      }
    });
    outgoers.forEach(outgoer => {
      if(outgoer.getEdges().length > 1) {
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
  });

  // polish process nodes
  let { horizontalAlignments, verticalAlignments, elativePlacementConstraints } = this.addPerProcessPolishment(processNodes, sbgnLayout);

  // polish phenotype nodes
  let phenotypeNodes = allNodes.filter(node => {
    if (node.class == "phenotype") {
      return node;
    }
  });
  const slopeThreshold = SBGNConstants.SLOPE_THRESHOLD;
  this.addPerPhenotypePolishment(phenotypeNodes, slopeThreshold, horizontalAlignments, verticalAlignments, elativePlacementConstraints, sbgnLayout);
}
// not used
SBGNPolishingNew.polish2 = function (processNodes, nodes, edges, mapType = "PD", slopeThreshold = 0.5) {
/*   let allNodes = sbgnLayout.getAllNodes();
  let processNodes = sbgnLayout.getAllProcessNodes(); */
  let allNodes = nodes;
  let oneDegreeNodes = new Set();
  let multiDegreeNodes = new Set();
  allNodes.forEach(node => {
    if(node.getNeighborsList().size == 1) {
      oneDegreeNodes.add(node);
    } else {
      multiDegreeNodes.add(node);
    }
  });
  edges.forEach(edge => {
    let source = edge.getSource();
    let target = edge.getTarget();
    if ((!oneDegreeNodes.has(source) && !oneDegreeNodes.has(target) && mapType == "PD") || (mapType == "AF")){
      let direction = getDirection(source, target, slopeThreshold);
      edge.direction = direction;
    }
  });

  processNodes.forEach(process => {
    let edges = process.edges.filter(edge => {
      return edge.direction;
    });
    for (let i = 0; i < edges.length; i++ ) {
      if(edges[i].direction && (edges[i].direction == 'l-r' || edges[i].direction == 'r-l' || edges[i].direction == 't-b' || edges[i].direction == 'b-t')) {
        process.direction = edges[i].direction;
        break;
      } else if (edges[i].direction == 'tl-br' || edges[i].direction == 'tr-bl' || edges[i].direction == 'br-tl' || edges[i].direction == 'bl-tr') {
          process.direction = edges[i].direction;
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
    if ((!oneDegreeNodes.has(source) && !oneDegreeNodes.has(target) && (!source.isLogicalOperator()) && !target.isLogicalOperator() && mapType == "PD") || (mapType == "AF")){
      let direction = getDirection(source, target, slopeThreshold);
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
let getDirection = function(source, target, slopeThreshold = 0.5) {
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

let placeInputs = function (node, inputs, direction = 'l-r', idealEdgeLength, isFirstNode, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout) {
  let inputsTemp = [];
  inputs.forEach(input => {
    if (input.getParent() == node.getParent() || input.inclusionTreeDepth != node.inclusionTreeDepth){
      inputsTemp.push(input);
    }
  });
  inputs = inputsTemp;
  const n = inputs.length;
  if (n === 0) return;

  fillQuadrants(node, direction); // fill related quadrants
  // Direction configuration
  const directionConfig = {
    'l-r': { start: 270, end: 90, center: 180 },   // left side
    'r-l': { start: 90, end: 270, center: 0 },     // right side
    't-b': { start: 180, end: 0, center: 90 },     // above
    'b-t': { start: 360, end: 180, center: 270 },  // below
    'tl-br': { start: 225, end: 45, center: 135 },  // top left
    'bl-tr': { start: 315, end: 135, center: 225 },  // bottom left
    'tr-bl': { start: 135, end: -45, center: 45 },  // top right
    'br-tl': { start: 45, end: 225, center: 315 },  // bottom right
  };

  const { start, end, center } = directionConfig[direction];

  let step = 0;
  if (isFirstNode){
    step = 180 / (n + 1);
  } else {
    step = 90 / Math.ceil(n / 2  + 1);
  }

  let lastAngle = start;
  for (let i = 0; i < n; i++) {
    let angle;

    if (n === 1) {
      // single input special cases
      if (isFirstNode) {
        angle = center; // perfectly centered
      } else {
        // place at first-position angle (as if there were 2 inputs)
        angle = (direction === 'l-r' ? 225 :
                 direction === 'r-l' ? -45 :
                 direction === 't-b' ? 135 :
                 direction === 'b-t' ? 225 :
                 direction === 'tl-br' ? 180 :
                 direction === 'bl-tr' ? 270 :
                 direction === 'tr-bl' ? 90 :
                 direction === 'br-tl' ? 0 :
                 0); // fallback
      }
    } else {
      angle = lastAngle - step;
      if ((!isFirstNode && angle == center) || (angle == center && isFirstNode && n%2 == 0)){
        angle -= step;
      }
      lastAngle = angle;
    } 

    // Normalize to [0, 360)
    angle = (angle + 360) % 360;

    let idealLength = idealEdgeLength;
    if (node.inclusionTreeDepth != inputs[i].inclusionTreeDepth) {
      idealLength = idealEdgeLength + node.getDiagonal() + inputs[i].getDiagonal() + 4 * LayoutConstants.SIMPLE_NODE_SIZE;
    }

    let position = calculatePosition(node, inputs[i], idealLength, angle);
    let isOverlapping = checkOverlap(inputs[i], position, sbgnLayout);
    if (isOverlapping) {
      let quadrant = findQuadrant(angle);
      let newQuadrant = quadrant;
      for(let j = 1; j < node.quadrants.length; j++) {
        if (!node.quadrants[(quadrant + j) % node.quadrants.length]) {
          newQuadrant = (quadrant + j) % node.quadrants.length;
          break;
        }
      }
      angle = newQuadrant * 45;
      position = calculatePosition(node, inputs[i], idealLength, angle);
      node.quadrants[newQuadrant] = true;
    } else {
      let quadrant = findQuadrant(angle);
      node.quadrants[quadrant] = true;
    }

    const oldPos = {x: inputs[i].getCenterX(), y: inputs[i].getCenterY()};
    const newPos = {x: position.x, y: position.y};
    const shiftAmount = {x: newPos.x - oldPos.x, y: newPos.y - oldPos.y};
    inputs[i].setCenter(position.x, position.y);
    try {
      addNodeToGrid(inputs[i], sbgnLayout);
    } catch (error){
      console.log("Exceeds polishingGrid boundaries!");
    }

    // if node is compound we need to move its children as well
    if (inputs[i].child && inputs[i].child.getNodes().length > 0) {
      inputs[i].child.getNodes().forEach(node => {
        node.moveBy(shiftAmount.x, shiftAmount.y)
      });
    }

    const alignedAngle = Math.round(angle); // avoid float precision
    if (alignedAngle === 0 || alignedAngle === 180) {
      horizontalAlignments.push([node, inputs[i]]);
    } else if (alignedAngle === 90 || alignedAngle === 270) {
      verticalAlignments.push([node, inputs[i]]);
    }
  }

  // Add relative constraints if many inputs
  if (n > 3) {
    inputs.forEach(input => {
      if(direction == "l-r") {
        relativePlacementConstraints.push({ left: input.id, right: node.id });
      } else if(direction == "r-l") {
        relativePlacementConstraints.push({ right: input.id, left: node.id });
      } else if(direction == "t-b") {
        relativePlacementConstraints.push({ top: input.id, bottom: node.id });
      } else if(direction == "b-t") {
        relativePlacementConstraints.push({ bottom: input.id, top: node.id });
      } else if(direction == "tl-br") {
        relativePlacementConstraints.push({ left: input.id, right: node.id });
        relativePlacementConstraints.push({ top: input.id, bottom: node.id });
      } else if(direction == "bl-tr") {
        relativePlacementConstraints.push({ left: input.id, right: node.id });
        relativePlacementConstraints.push({ bottom: input.id, top: node.id });
      } else if(direction == "tr-bl") {
        relativePlacementConstraints.push({ top: input.id, bottom: node.id });
        relativePlacementConstraints.push({ right: input.id, left: node.id });
      } else if(direction == "br-tl") {
        relativePlacementConstraints.push({ bottom: input.id, top: node.id });
        relativePlacementConstraints.push({ right: input.id, left: node.id });
      }
    });
  }
};

let placeOutputs = function (node, outputs, direction = 'l-r', idealEdgeLength, isLastNode, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout) {
  let outputsTemp = [];
  outputs.forEach(output => {
    if (output.getParent() == node.getParent() || output.inclusionTreeDepth != node.inclusionTreeDepth){
      outputsTemp.push(output);
    }
  });
  outputs = outputsTemp;
  const n = outputs.length;
  if (n === 0) return;

  fillQuadrants(node, direction); // fill related quadrants

  // Direction configuration
  const directionConfig = {
    'l-r': { start: -90, end: 90, center: 0 },   // right side
    'r-l': { start: 90, end: 180, center: 180 },     // left side
    't-b': { start: 180, end: 360, center: 270 },     // below
    'b-t': { start: 0, end: 180, center: 90 },  // above
    'tl-br': { start: 225, end: 45, center: 315 },  // bottom right
    'bl-tr': { start: -45, end: 135, center: 45 },  // top right
    'tr-bl': { start: 135, end: -45, center: 225 },  // bottom left
    'br-tl': { start: 45, end: 225, center: 135 },  // top left
  };

  const { start, end, center } = directionConfig[direction];

  let step = 0;
  if (isLastNode){
    step = 180 / (n + 1);
  } else {
    step = 90 / Math.ceil(n / 2  + 1);
  }

  let lastAngle = start;
  for (let i = 0; i < n; i++) {
    let angle;

    if (n === 1) {
      // single input special cases
      if (isLastNode) {
        angle = center; // perfectly centered
      } else {
        // place at first-position angle (as if there were 2 inputs)
        angle = (direction === 'l-r' ? -45 :
                 direction === 'r-l' ? 225 :
                 direction === 't-b' ? 225 :
                 direction === 'b-t' ? 135 :
                 direction === 'tl-br' ? 270 :
                 direction === 'bl-tr' ? 0 :
                 direction === 'tr-bl' ? 180 :
                 direction === 'br-tl' ? 90 :
                 0); // fallback
      }
    } else {
      angle = lastAngle + step;
      if ((!isLastNode && angle == center) || (angle == center && isLastNode && n%2 == 0)){
        angle += step;
      }
      lastAngle = angle;
    } 

    // Normalize to [0, 360)
    angle = (angle + 360) % 360;

    let idealLength = idealEdgeLength;
    if(node.inclusionTreeDepth != outputs[i].inclusionTreeDepth) {
      idealLength = idealEdgeLength + node.getDiagonal() + outputs[i].getDiagonal() + 4 * LayoutConstants.SIMPLE_NODE_SIZE;
    }
    let position = calculatePosition(node, outputs[i], idealLength, angle);
    let isOverlapping = checkOverlap(outputs[i], position, sbgnLayout);
    if (isOverlapping) {
      let quadrant = findQuadrant(angle);
      let newQuadrant = quadrant;
      for(let j = 1; j < node.quadrants.length; j++) {
        if (!node.quadrants[(quadrant + j) % node.quadrants.length]) {
          newQuadrant = (quadrant + j) % node.quadrants.length;
          break;
        }
      }
      angle = newQuadrant * 45;
      position = calculatePosition(node, outputs[i], idealLength, angle);
      node.quadrants[newQuadrant] = true;
    } else {
      let quadrant = findQuadrant(angle);
      node.quadrants[quadrant] = true;
    }

    const oldPos = {x: outputs[i].getCenterX(), y: outputs[i].getCenterY()};
    const newPos = {x: position.x, y: position.y};
    const shiftAmount = {x: newPos.x - oldPos.x, y: newPos.y - oldPos.y};
    outputs[i].setCenter(position.x, position.y);
    try {
      addNodeToGrid(outputs[i], sbgnLayout);
    } catch (error){
      console.log("Exceeds polishingGrid boundaries!");
    }
    // if node is compound we need to move its children as well
    if(outputs[i].child && outputs[i].child.getNodes().length > 0) {
      outputs[i].withChildren().forEach(node => {
        if(outputs[i].id != node.id) {
          node.moveBy(shiftAmount.x, shiftAmount.y);
        }
      });
    }

    const alignedAngle = Math.round(angle); // avoid float precision
    if (alignedAngle === 0 || alignedAngle === 180) {
      horizontalAlignments.push([node, outputs[i]]);
    } else if (alignedAngle === 90 || alignedAngle === 270) {
      verticalAlignments.push([node, outputs[i]]);
    }
  }

  // Add relative constraints if many inputs
  if (n > 3) {
    outputs.forEach(output => {
      if(direction == "l-r") {
        relativePlacementConstraints.push({ right: output.id, left: node.id });
      } else if(direction == "r-l") {
        relativePlacementConstraints.push({ left: output.id, right: node.id });
      } else if(direction == "t-b") {
        relativePlacementConstraints.push({ bottom: output.id, top: node.id });
      } else if(direction == "b-t") {
        relativePlacementConstraints.push({ top: output.id, bottom: node.id });
      } else if(direction == "tl-br") {
        relativePlacementConstraints.push({ right: output.id, left: node.id });
        relativePlacementConstraints.push({ bottom: output.id, top: node.id });
      } else if(direction == "bl-tr") {
        relativePlacementConstraints.push({ right: output.id, left: node.id });
        relativePlacementConstraints.push({ top: output.id, bottom: node.id });
      } else if(direction == "tr-bl") {
        relativePlacementConstraints.push({ left: output.id, right: node.id });
        relativePlacementConstraints.push({ top: output.id, bottom: node.id });
      } else if(direction == "br-tl") {
        relativePlacementConstraints.push({ left: output.id, right: node.id });
        relativePlacementConstraints.push({ top: output.id, bottom: node.id });
      }
    });
  }
};

let placeModulators = function (node, modulators, direction = 'l-r', idealEdgeLength, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout) {
  let modulatorsTemp = [];
  modulators.forEach(modulator => {
    if (modulator.getParent() == node.getParent() || modulator.inclusionTreeDepth != node.inclusionTreeDepth){
      modulatorsTemp.push(modulator);
    }
  });
  modulators = modulatorsTemp;

  const n = modulators.length;
  if (n === 0) return;

  fillQuadrants(node, direction); // fill related quadrants

  // Define angle bands depending on direction (supports all 4)
  const directionConfig = {
    'l-r': { belowRange: [225, 315], aboveRange: [45, 135] },
    'r-l': { belowRange: [225, 315], aboveRange: [45, 135] },
    't-b': { belowRange: [135, 225], aboveRange: [-45, 45] },
    'b-t': { belowRange: [135, 225], aboveRange: [-45, 45] },
    'tl-br': { belowRange: [180, 270], aboveRange: [0, 90] },
    'bl-tr': { belowRange: [270, 360], aboveRange: [90, 180] },
    'tr-bl': { belowRange: [90, 180], aboveRange: [-90, 0] },
    'br-tl': { belowRange: [0, 90], aboveRange: [180, 270] },
  };

  const { belowRange, aboveRange } = directionConfig[direction];

  const aboveCount = Math.ceil(n / 2);
  const belowCount = n - aboveCount;

  const aboveNodes = modulators.slice(0, aboveCount);
  const belowNodes = modulators.slice(aboveCount);

  // Helper: distribute within a range
  const distribute = (nodes, [start, end]) => {
    const count = nodes.length;
    if (count === 0) return [];
    if (count === 1) return [(start + end) / 2];

    const step = (end - start) / (count - 1);
    return Array.from({ length: count }, (_, i) => start + step * i);
  };

  const belowAngles = distribute(belowNodes, belowRange);
  const aboveAngles = distribute(aboveNodes, aboveRange);

  // Combine (above first, then below)
  const allAngles = [...aboveAngles, ...belowAngles];

  // Apply placement
  allAngles.forEach((angle, i) => {
    //if(modulators[i].class == "complex"){
      idealEdgeLength *= 1.25;
    //}
    let position = calculatePosition(node, modulators[i], idealEdgeLength, angle);
    let isOverlapping = checkOverlap(modulators[i], position, sbgnLayout);
    if(modulators[i].isLogicalOperator()) { // otherwise it may detect overlap with its inputs because of first polising iteration
      isOverlapping = false;
    }
    if (isOverlapping) {
      let quadrant = findQuadrant(angle);
      let newQuadrant = quadrant;
      for(let j = 1; j < node.quadrants.length; j++) {
        if (!node.quadrants[(quadrant + j) % node.quadrants.length]) {
          newQuadrant = (quadrant + j) % node.quadrants.length;
          break;
        }
      }
      angle = newQuadrant * 45;
      position = calculatePosition(node, modulators[i], idealEdgeLength, angle);
      node.quadrants[newQuadrant] = true;
    } else {
      let quadrant = findQuadrant(angle);
      node.quadrants[quadrant] = true;
    }

    const oldPos = {x: modulators[i].getCenterX(), y: modulators[i].getCenterY()};
    const newPos = {x: position.x, y: position.y};
    const shiftAmount = {x: newPos.x - oldPos.x, y: newPos.y - oldPos.y};
    modulators[i].setCenter(position.x, position.y);
    try {
      addNodeToGrid(modulators[i], sbgnLayout);
    } catch (error){
      console.log("Exceeds polishingGrid boundaries!");
    }
    // if node is compound we need to move its children as well
    if(modulators[i].child && modulators[i].child.getNodes().length > 0) {
      modulators[i].child.getNodes().forEach(node => {
        node.moveBy(shiftAmount.x, shiftAmount.y)
      });
    }

    // Alignment tagging
    const alignedAngle = Math.round(angle % 360);
    if (alignedAngle === 0 || alignedAngle === 180)
      horizontalAlignments.push([node, modulators[i]]);
    else if (alignedAngle === 90 || alignedAngle === 270)
      verticalAlignments.push([node, modulators[i]]);

    // extra process if modulator is a logical operator
    if(modulators[i].isLogicalOperator()) {
      modulators[i].quadrants = Array(8).fill(false);
      let incomers = modulators[i].getIncomerNodes().filter(incomer => {
        if(incomer.getEdges().length == 1)
          return true;
      });
      let incomerDirection = getDirection(modulators[i], node);
      placeInputs(modulators[i], incomers, incomerDirection, idealEdgeLength, true, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout);
    }
  });  
}

SBGNPolishingNew.addPerProcessPolishment = function (processNodes, sbgnLayout) {
  let horizontalAlignments = [];
  let verticalAlignments = [];
  let relativePlacementConstraints = [];

  let idealEdgeLength = SBGNConstants.DEFAULT_EDGE_LENGTH;

  // construct grid
  let repulsionRange = sbgnLayout.repulsionRange;
  let grid = calcGrid(sbgnLayout.graphManager.getRoot(), repulsionRange);
  sbgnLayout.polishingGrid = grid;
  let allNodes = sbgnLayout.getAllNodes();
  // put all nodes to proper grid cells
  let node;
  for (let i = 0; i < allNodes.length; i++)
  {
    node = allNodes[i];
    if (node.getEdges().length > 1){
      addNodeToGrid(node, sbgnLayout);
    }
  } 

  // first process input nodes (except modulators)
  processNodes.forEach((node, j) => {
    node.quadrants = Array(8).fill(false); // quadrants start from right and finish at top-right
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

    let isFirstNode = node.status === 'first';
    let isLastNode = node.status === 'last';
    if(node.status == undefined){
      isFirstNode = true;
      isLastNode = true
    }
    placeInputs(node, inputs, node.direction, idealEdgeLength, isFirstNode, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout);
    placeOutputs(node, outputs, node.direction, idealEdgeLength, isLastNode, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout);
    placeModulators(node, modulators, node.direction, idealEdgeLength, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout);
  });

  return { horizontalAlignments: horizontalAlignments, verticalAlignments: verticalAlignments, relativePlacementConstraints: relativePlacementConstraints };
};

SBGNPolishingNew.addPerPhenotypePolishment = function (phenotypes, slopeThreshold, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout) {

  let idealEdgeLength = SBGNConstants.DEFAULT_EDGE_LENGTH;

  phenotypes.forEach((phenotype, j) => {
    const edges = phenotype.getEdges();
    const sourceNode = edges[0].getSource();
    sourceNode.quadrants = Array(8).fill(false);
    const direction = getDirection(sourceNode, phenotype, slopeThreshold);
    placeOutputs(sourceNode, [phenotype], direction, idealEdgeLength, true, horizontalAlignments, verticalAlignments, relativePlacementConstraints, sbgnLayout);
  });
};

function calcGrid(graph, repulsionRange){

  var sizeX = 0; 
  var sizeY = 0;
  
  sizeX = parseInt(Math.ceil(((graph.getRight() + 500) - (graph.getLeft() - 500)) / repulsionRange));
  sizeY = parseInt(Math.ceil(((graph.getBottom() + 500) - (graph.getTop() - 500)) / repulsionRange));
  
  var grid = new Array(sizeX);
  
  for(var i = 0; i < sizeX; i++){
    grid[i] = new Array(sizeY);    
  }
  
  for(var i = 0; i < sizeX; i++){
    for(var j = 0; j < sizeY; j++){
      grid[i][j] = new Array();    
    }
  }
  
  return grid;
};

function addNodeToGrid(v, sbgnLayout){  
  let repulsionRange = sbgnLayout.repulsionRange;
  let left = sbgnLayout.graphManager.getRoot().getLeft() - 500;
  let top = sbgnLayout.graphManager.getRoot().getTop() - 500; 
  let startX = 0;
  let finishX = 0;
  let startY = 0;
  let finishY = 0;
  
  startX = parseInt(Math.floor((v.getRect().x - left) / repulsionRange));
  finishX = parseInt(Math.floor((v.getRect().width + v.getRect().x - left) / repulsionRange));
  startY = parseInt(Math.floor((v.getRect().y - top) / repulsionRange));
  finishY = parseInt(Math.floor((v.getRect().height + v.getRect().y - top) / repulsionRange));

  for (var i = startX; i <= finishX; i++)
  {
    for (var j = startY; j <= finishY; j++)
    {
      sbgnLayout.polishingGrid[i][j].push(v);
      v.setGridCoordinates(startX, finishX, startY, finishY); 
    }
  }
};

function checkOverlap(v, position, sbgnLayout){
  let repulsionRange = sbgnLayout.repulsionRange;
  let left = sbgnLayout.graphManager.getRoot().getLeft() - 500;
  let top = sbgnLayout.graphManager.getRoot().getTop() - 500;
  let startX = 0;
  let finishX = 0;
  let startY = 0;
  let finishY = 0;
  
  startX = Math.max(parseInt(Math.floor((position.x - (v.getWidth() / 2) - left) / repulsionRange)), 0);
  finishX = Math.max(parseInt(Math.floor((position.x + v.getWidth() - left) / repulsionRange)), 0);
  startY = Math.max(parseInt(Math.floor((position.y - (v.getHeight() / 2) - top) / repulsionRange)), 0);
  finishY = Math.max(parseInt(Math.floor((position.y + v.getHeight() - top) / repulsionRange)), 0);

  let candidateNodes = [];
  for (var i = startX; i <= finishX; i++)
  {
    for (var j = startY; j <= finishY; j++)
    {
      candidateNodes = candidateNodes.concat(sbgnLayout.polishingGrid[i][j]);
    }
  }
  let isOverlapping = false;
  candidateNodes.forEach(node => {
    let bb1 = {x: position.x - (v.getWidth() / 2), y: position.y - (v.getHeight() / 2), width: v.getWidth(), height: v.getHeight()};
    let bb2 = {x: node.getRect().x, y: node.getRect().y, width: node.getRect().width, height: node.getRect().height};
    if(doesOverlap(bb1, bb2)) {
      isOverlapping = true
    }
  });

  return isOverlapping;
};

function doesOverlap (bb1, bb2) {
  return !(bb2.x > bb1.x + bb1.width || bb2.x + bb2.width < bb1.x || bb2.y > bb1.y + bb1.height || bb2.y + bb2.height < bb1.y);
};

function fillQuadrants(node, direction) {
  if (direction == 'l-r' || direction == 'r-l') {
    node.quadrants[0] = true;
    node.quadrants[4] = true;
  } else if (direction == 't-b' || direction == 'b-t') {
    node.quadrants[2] = true;
    node.quadrants[6] = true;
  } else if (direction == 'tl-br' || direction == 'br-tl') {
    node.quadrants[3] = true;
    node.quadrants[7] = true;
  } else if (direction == 'tr-bl' || direction == 'bl-tr') {
    node.quadrants[1] = true;
    node.quadrants[5] = true;
  }
};

function findQuadrant(angle) {
  if (angle == 0) {
    return 0;
  } else if(angle > 0 && angle < 90) {
    return 1;
  } else if(angle == 90) {
    return 2;
  } else if(angle > 90 && angle < 180) {
    return 3;
  } else if(angle == 180) {
    return 4;
  } else if(angle > 180 && angle < 270) {
    return 5;
  } else if(angle == 270) {
    return 6;
  } else if(angle > 270 && angle < 360) {
    return 7;
  }
};

module.exports = SBGNPolishingNew;
