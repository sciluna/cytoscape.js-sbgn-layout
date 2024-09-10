const SBGNConstants = require('./SBGNConstants');

function SBGNPolishing() {
}

SBGNPolishing.addPerComponentPolishment = function (components, directions) {
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

  let findOrientation = function (direction, edgeBetween) {
    if(edgeBetween) {
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
    }
    else {
      if (direction == "horizontal") {
        return "left-to-right";
      }
      else {
        return "top-to-bottom";
      }
    }
  };

  // first process input nodes (except modulators)
  components.forEach((component, i) => {
    let orientation = "";
    if (component.length > 1) {
      let edgeBetween = component[0].getEdgesBetween(component[1])[0];
      orientation = findOrientation(directions[i], edgeBetween);
    }
    else if (component.length == 1) {
      let ringNeighbors = [...component[0].getNeighborsList()].filter(neighbor => { return neighbor.pseudoClass == "ring" });
      if (ringNeighbors.length == 0) {
        orientation = findOrientation(directions[i]);
      }
      else if (ringNeighbors.length == 1) {
        let ringNeighbor = ringNeighbors[0];
        let edgeBetween = component[0].getEdgesBetween(ringNeighbor)[0];
        orientation = findOrientation(directions[i], edgeBetween);
      }
    }

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
        if (orientation == "right-to-left") {
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
        if (orientation == "top-to-bottom") {
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
      if ((j == component.length - 1 && !node.isConnectedToRing()) || (j == 0 && node.isConnectedToRing() && node.getIncomerNodes().filter(incomer => incomer.pseudoClass == "ring").length > 0)) { //if last node and not connected to ring, or first node, connected to ring but connected as a target
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

module.exports = SBGNPolishing;