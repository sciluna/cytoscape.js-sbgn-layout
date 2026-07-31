/**
  The implementation of the sbgn layout algorithm
*/

const PointD = require('cose-base').layoutBase.PointD;
const DimensionD = require('cose-base').layoutBase.DimensionD;
const Integer = require('cose-base').layoutBase.Integer;
const LayoutConstants = require('cose-base').layoutBase.LayoutConstants;
const SBGNConstants = require('../SBGN/SBGNConstants');
const CoSEConstants = require('cose-base').CoSEConstants;
const FDLayoutConstants = require('cose-base').layoutBase.FDLayoutConstants;
const SBGNLayout = require('../SBGN/SBGNLayout2');
const SBGNNode = require('../SBGN/SBGNNode');
const SBGNPolishing = require('./SBGNPolishing.js');
const sketchLay = require('sketchlay');

const assign = require('../assign');
const glyphMapping = require('./elementMapping.js');

const isFn = fn => typeof fn === 'function';

const optFn = (opt, ele) => {
  if (isFn(opt)) {
    return opt(ele);
  } else {
    return opt;
  }
};

const defaults = Object.freeze({
  animate: 'end', // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  animationDuration: 1000,
  refresh: 30, // number of ticks per frame; higher is faster but more jerky
  //maxIterations: 2500, // max iterations before the layout will bail out
  //maxSimulationTime: 5000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  // Whether to pack disconnected components
  packComponents: true,
  // map type - PD or AF
  mapType: "PD",
  // slope threshold to decide orientation during polishing
  slopeThreshold: 0.5,
  // positioning options
  randomize: true, // use random node positions at beginning of layout
  // Include labels in node dimensions
  nodeDimensionsIncludeLabels: false,
  // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
  uniformNodeDimensions: false,
  // Node repulsion (non overlapping) multiplier
  nodeRepulsion: 4500,
  // Ideal edge (non nested) length
  idealEdgeLength: 50,
  // Divisor to compute edge forces
  edgeElasticity: 0.45,
  // Nesting factor (multiplier) to compute ideal edge length for nested edges
  nestingFactor: 0.1,
  // For enabling tiling
  tile: true,
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity force (constant)
  gravity: 0.25,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 1.5,
  // Gravity force (constant) for compounds
  gravityCompound: 1.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5,

  // layout event callbacks
  ready: function () { }, // on layoutready
  stop: function () { }, // on layoutstop

  // sketchlay options
  imageData: undefined,
  subset: undefined
});

let getUserOptions = function (options) {
  if (options.nestingFactor != null)
    SBGNConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = CoSEConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = FDLayoutConstants.PER_LEVEL_IDEAL_EDGE_LENGTH_FACTOR = options.nestingFactor;
  if (options.numIter != null)
    SBGNConstants.MAX_ITERATIONS = FDLayoutConstants.MAX_ITERATIONS = options.numIter;
  if (options.gravity != null)
    SBGNConstants.DEFAULT_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_GRAVITY_STRENGTH = options.gravity;
  if (options.gravityRange != null)
    SBGNConstants.DEFAULT_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_GRAVITY_RANGE_FACTOR = options.gravityRange;
  if (options.gravityCompound != null)
    SBGNConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_STRENGTH = options.gravityCompound;
  if (options.gravityRangeCompound != null)
    SBGNConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = CoSEConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = FDLayoutConstants.DEFAULT_COMPOUND_GRAVITY_RANGE_FACTOR = options.gravityRangeCompound;
  if (options.initialEnergyOnIncremental != null)
    SBGNConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = CoSEConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = FDLayoutConstants.DEFAULT_COOLING_FACTOR_INCREMENTAL = options.initialEnergyOnIncremental;
  if (options.slopeThreshold != null)
    SBGNConstants.SLOPE_THRESHOLD = options.slopeThreshold;

  SBGNConstants.TILE = CoSEConstants.TILE = options.tile;
  if (options.tilingCompareBy != null)
    SBGNConstants.TILING_COMPARE_BY = CoSEConstants.TILING_COMPARE_BY = options.tilingCompareBy;

  SBGNConstants.TILING_PADDING_VERTICAL = CoSEConstants.TILING_PADDING_VERTICAL =
    typeof options.tilingPaddingVertical === 'function' ? options.tilingPaddingVertical.call() : options.tilingPaddingVertical;
  SBGNConstants.TILING_PADDING_HORIZONTAL = CoSEConstants.TILING_PADDING_HORIZONTAL =
    typeof options.tilingPaddingHorizontal === 'function' ? options.tilingPaddingHorizontal.call() : options.tilingPaddingHorizontal;

  SBGNConstants.NODE_DIMENSIONS_INCLUDE_LABELS = CoSEConstants.NODE_DIMENSIONS_INCLUDE_LABELS = FDLayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = LayoutConstants.NODE_DIMENSIONS_INCLUDE_LABELS = options.nodeDimensionsIncludeLabels;
  SBGNConstants.DEFAULT_INCREMENTAL = CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = !(options.randomize);
  SBGNConstants.ANIMATE = CoSEConstants.ANIMATE = FDLayoutConstants.ANIMATE = LayoutConstants.ANIMATE = options.animate;
  SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
  LayoutConstants.DEFAULT_UNIFORM_LEAF_NODE_SIZES = options.uniformNodeDimensions;
}

class Layout {
  constructor( options ){
    this.options = assign( {}, defaults, options );
    getUserOptions(this.options);
  }

  async run(){
    let layout = this;
    let options = this.options;
    let cy = options.cy;
    let eles = options.eles;
    let nodes = eles.nodes();
    let edges = eles.edges();
    let self = this;

     // decide component packing is enabled or not
    let layUtil;
    let packingEnabled = false;
    if(cy.layoutUtilities && options.packComponents){
      layUtil = cy.layoutUtilities("get");
      if(!layUtil)
        layUtil = cy.layoutUtilities();             
    }   

    this.idToLNode = {};
    //Initialize SBGN elements
    let sbgnLayout = this.sbgnLayout = new SBGNLayout();
    let graphManager = this.graphManager = sbgnLayout.newGraphManager();
    this.root = graphManager.addRoot();

    // Establishing node relations in the GraphManager object
    this.processChildrenList(this.root, this.getTopMostNodes(nodes), sbgnLayout);
    this.processEdges(this.options, sbgnLayout, graphManager, edges);
    
    let randomize = false;
    let sketchConstraints = undefined;
    if (this.options.imageData) {
      if (this.options.subset) {
        let subsetNodes = this.options.subset.nodes();
        let zeroDegreeNodes = cy.collection();
        subsetNodes.forEach(node => {
          if (node.data("class") == "complex") {
            zeroDegreeNodes.merge(node.children());
          }
        });
        this.options.subset = this.options.subset.difference(zeroDegreeNodes);
      }
      let sketchLayResult = await sketchLay.generateConstraints({cy: this.options.cy, imageData: this.options.imageData, subset: this.options.subset, idealEdgeLength: this.options.idealEdgeLength});
      sketchConstraints = sketchLayResult.constraints;
      if (sketchConstraints.alignmentConstraint && sketchConstraints.relativePlacementConstraint) {
        randomize = false; // so no tree reduction is applied
      } else {
        randomize = options.randomize;
      }
    } else {
      randomize = options.randomize;
    }

    if (!randomize) {
      CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = true;
    } else {
      CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = false;
    }

    // start to layout
    const initialCenter = calcCenter(graphManager);

    if (!randomize) {
      if (sketchConstraints && sketchConstraints.alignmentConstraint && sketchConstraints.relativePlacementConstraint) {
        sbgnLayout.constraints["alignmentConstraint"] = sketchConstraints.alignmentConstraint;
        sbgnLayout.constraints["relativePlacementConstraint"] = sketchConstraints.relativePlacementConstraint;
        graphManager.allNodesToApplyGravitation = undefined;
        sbgnLayout.initParameters();
        sbgnLayout.initSpringEmbedder();
        CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false;
        CoSEConstants.TILE = true;
        sbgnLayout.runLayout();
      }
    } else {
        sbgnLayout.initParameters();
        sbgnLayout.initSpringEmbedder();
        CoSEConstants.TILE = true;
        sbgnLayout.runLayout();

/*         let graphInfo = sbgnLayout.constructSkeleton();
        graphManager.updateBounds();
        sbgnLayout.constraints["alignmentConstraint"] = graphInfo.constraints.alignmentConstraint;
        sbgnLayout.constraints["relativePlacementConstraint"] = graphInfo.constraints.relativePlacementConstraint;
        graphManager.allNodesToApplyGravitation = undefined;
        sbgnLayout.initParameters();
        sbgnLayout.initSpringEmbedder();
        CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = true;
        CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false;
        CoSEConstants.TILE = true;
        sbgnLayout.runLayout(); */

/*         graphInfo.componentsExtended.forEach(component => {
          let processes = [];
          let nodes = [];
          let edges = [];
          component.forEach(ele => {
            if (ele instanceof SBGNNode){
              if (ele.isProcess()) {
                processes.push(ele);
              }
              nodes.push(ele);
            } else {
              edges.push(ele);
            }
          })
          SBGNPolishing.polish2(processes, nodes, edges);
        }); */
        //SBGNPolishing.polish(sbgnLayout.getAllProcessNodes());
    }

    // polishment phase - first iteration
    let constraints = SBGNPolishing.generateConstraints(sbgnLayout, this.options.mapType, this.options.slopeThreshold);
    sbgnLayout.constraints["alignmentConstraint"] = constraints.alignmentConstraint;
    sbgnLayout.constraints["relativePlacementConstraint"] = constraints.relativePlacementConstraint;

    graphManager.allNodesToApplyGravitation = undefined;
    sbgnLayout.initParameters();
    sbgnLayout.initSpringEmbedder();
    SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = 100;
    CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = true;
    CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false;
    CoSEConstants.TILE = true;
    sbgnLayout.runLayout();
    if (this.options.mapType == "PD") {
      SBGNPolishing.polish(sbgnLayout);
    }

    // polishment phase - second iteration
    constraints = SBGNPolishing.generateConstraints(sbgnLayout, this.options.mapType, this.options.slopeThreshold);
    sbgnLayout.constraints["alignmentConstraint"] = constraints.alignmentConstraint;
    sbgnLayout.constraints["relativePlacementConstraint"] = constraints.relativePlacementConstraint;

    graphManager.allNodesToApplyGravitation = undefined;
    sbgnLayout.initParameters();
    sbgnLayout.initSpringEmbedder();
    SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
    CoSEConstants.DEFAULT_INCREMENTAL = FDLayoutConstants.DEFAULT_INCREMENTAL = LayoutConstants.DEFAULT_INCREMENTAL = true;
    CoSEConstants.TREE_REDUCTION_ON_INCREMENTAL = false;
    CoSEConstants.TILE = true;
    sbgnLayout.runLayout();
    if (this.options.mapType == "PD") {
      SBGNPolishing.polish(sbgnLayout);
    }

    const finalCenter = calcCenter(graphManager);
    const centerDiff = {x: initialCenter.x - finalCenter.x, y: initialCenter.y-finalCenter.y};
    if(this.options.subset) {
      moveNodes(graphManager.getAllNodes(), centerDiff);
    }

    function calcCenter(gm) {
      let left = Integer.MAX_VALUE;
      let right = -Integer.MAX_VALUE;
      let top = Integer.MAX_VALUE;
      let bottom = -Integer.MAX_VALUE;
      let allNodes = gm.getAllNodes();
      allNodes.forEach(node => {
        if(node.getNoOfChildren() == 1) {
          if(node.getRect().x < left) {
            left = node.getRect().x;
          }
          if(node.getRect().x + node.getWidth() > right) {
            right = node.getRect().x + node.getWidth();
          }
          if(node.getRect().y < top) {
            top = node.getRect().y;
          }
          if(node.getRect().y + node.getHeight() > bottom) {
            bottom = node.getRect().y + node.getHeight();
          }
        }
      });
      return { x: (left + right) / 2, y: (top + bottom) / 2 };
    };

    function moveNodes(nodes, centerDiff) {
      nodes.forEach(node => {
        node.moveBy(centerDiff.x, centerDiff.y);
        if (node.getChild()) {
          moveNodes(node.getChild().getNodes(), centerDiff);
        }
      });
      //gm.updateBounds();
    }
  
    let getPositions = function (ele, i) {
      if (typeof ele === "number") {
        ele = i;
      }
      let theId = ele.data('id');
      let lNode = self.idToLNode[theId];

      return {
        x: lNode.getRect().getCenterX(),
        y: lNode.getRect().getCenterY()
      };
    };

    eles.nodes().not(":parent").layoutPositions(layout, options, getPositions);
  }
  
  // Note: Taken from CoSE-Bilkent !!
  processChildrenList(parent, children, layout) {
    let size = children.length;
    for (let i = 0; i < size; i++) {
      let theChild = children[i];
      let children_of_children = theChild.children();
      let theNode;

      let dimensions = theChild.layoutDimensions({
        nodeDimensionsIncludeLabels: false
      });

      if (theChild.outerWidth() != null
        && theChild.outerHeight() != null) {
        theNode = parent.add(new SBGNNode(layout.graphManager,
          new PointD(theChild.position('x') - dimensions.w / 2, theChild.position('y') - dimensions.h / 2),
          new DimensionD(parseFloat(dimensions.w), parseFloat(dimensions.h))));
      }
      else {
        theNode = parent.add(new SBGNNode(this.graphManager));
      }
      // Attach id and class to the layout node
      theNode.id = theChild.data("id");
      theNode.class = (theChild.data("class") && glyphMapping.isSbgnGlyph(theChild.data("class"))) ? theChild.data("class") : (theChild.classes() ? glyphMapping.getGlyph(theChild.classes()) : undefined);

      // Attach the paddings of cy node to layout node
      theNode.paddingLeft = parseInt(theChild.css('padding'));
      theNode.paddingTop = parseInt(theChild.css('padding'));
      theNode.paddingRight = parseInt(theChild.css('padding'));
      theNode.paddingBottom = parseInt(theChild.css('padding'));

      // Map the layout node
      this.idToLNode[theChild.data("id")] = theNode;

      if (isNaN(theNode.rect.x)) {
        theNode.rect.x = 0;
      }

      if (isNaN(theNode.rect.y)) {
        theNode.rect.y = 0;
      }

      if (children_of_children != null && children_of_children.length > 0) {
        let theNewGraph;
        theNewGraph = layout.getGraphManager().add(layout.newGraph(), theNode);
        this.processChildrenList(theNewGraph, children_of_children, layout);
      }
    }
  }

  processEdges(options, layout, gm, edges) {
    let idealLengthTotal = 0;
    let edgeCount = 0;
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      let sourceNode = this.idToLNode[edge.data("source")];
      let targetNode = this.idToLNode[edge.data("target")];
      if (sourceNode && targetNode && sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length == 0) {
        let e1 = gm.add(layout.newEdge(), sourceNode, targetNode);
        e1.id = edge.id();
        e1.idealLength = optFn(options.idealEdgeLength, edge);
        e1.edgeElasticity = optFn(options.edgeElasticity, edge);
        e1.class = edge.data("class");
        idealLengthTotal += e1.idealLength;
        edgeCount++;
      }
    }
    // we need to update the ideal edge length constant with the avg. ideal length value after processing edges
    // in case there is no edge, use other options
    if (options.idealEdgeLength != null) {
      if (edgeCount > 0)
        SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = idealLengthTotal / edgeCount;
      else if (!isFn(options.idealEdgeLength)) // in case there is no edge, but option gives a value to use
        SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = options.idealEdgeLength;
      else  // in case there is no edge and we cannot get a value from option (because it's a function)
        SBGNConstants.DEFAULT_EDGE_LENGTH = CoSEConstants.DEFAULT_EDGE_LENGTH = FDLayoutConstants.DEFAULT_EDGE_LENGTH = 50;
      // we need to update these constant values based on the ideal edge length constant
      SBGNConstants.MIN_REPULSION_DIST = CoSEConstants.MIN_REPULSION_DIST = FDLayoutConstants.MIN_REPULSION_DIST = FDLayoutConstants.DEFAULT_EDGE_LENGTH / 10.0;
      SBGNConstants.DEFAULT_RADIAL_SEPARATION = CoSEConstants.DEFAULT_RADIAL_SEPARATION = FDLayoutConstants.DEFAULT_EDGE_LENGTH;
    }
  }

  // Get the top most ones of a list of nodes
  // Note: Taken from CoSE-Bilkent !!
  getTopMostNodes(nodes) {
    let nodesMap = {};
    for (let i = 0; i < nodes.length; i++) {
      nodesMap[nodes[i].id()] = true;
    }
    return nodes.filter(function (ele, i) {
      if (typeof ele === "number") {
        ele = i;
      }
      let parent = ele.parent()[0];
      while (parent != null) {
        if (nodesMap[parent.id()]) {
          return false;
        }
        parent = parent.parent()[0];
      }
      return true;
    });
  }
}

module.exports = Layout;