const HashMap = require('cose-base').layoutBase.HashMap;
const PointD = require('cose-base').layoutBase.PointD;
const DimensionD = require('cose-base').layoutBase.DimensionD;
let LayoutConstants = require('cose-base').layoutBase.LayoutConstants;
let SBGNConstants = require('../SBGN/SBGNConstants');
let CoSEConstants = require('cose-base').CoSEConstants;
let FDLayoutConstants = require('cose-base').layoutBase.FDLayoutConstants;
const SBGNLayout = require('../SBGN/SBGNLayout');
const SBGNNode = require('../SBGN/SBGNNode');

const ContinuousLayout = require('./continuous-base');
const assign = require('../assign');
const isFn = fn => typeof fn === 'function';

const optFn = ( opt, ele ) => {
  if( isFn( opt ) ){
    return opt( ele );
  } else {
    return opt;
  }
};

/**
 *  Default layout options
 */
let defaults = {
  animate: 'end', // whether to show the layout as it's running; special 'end' value makes the layout animate like a discrete layout
  animationDuration: 1000,
  refresh: 30, // number of ticks per frame; higher is faster but more jerky
  //maxIterations: 2500, // max iterations before the layout will bail out
  //maxSimulationTime: 5000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  // infinite layout options
  infinite: false, // overrides all other options for a forces-all-the-time mode

  // layout event callbacks
  ready: function(){}, // on layoutready
  stop: function(){}, // on layoutstop

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
  // Gravity force (constant)
  gravity: 0.25,
  // For enabling tiling
  tile: true,
  // Represents the amount of the vertical space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingVertical: 10,
  // Represents the amount of the horizontal space to put between the zero degree members during the tiling operation(can also be a function)
  tilingPaddingHorizontal: 10,
  // Gravity range (constant) for compounds
  gravityRangeCompound: 0.5,
  // Gravity force (constant) for compounds
  gravityCompound: 2.0,
  // Gravity range (constant)
  gravityRange: 3.8,
  // Initial cooling factor for incremental layout
  initialEnergyOnIncremental: 0.5
};

class Layout extends ContinuousLayout {
  constructor( options ){
    options = assign( {}, defaults, options );
    super(options);

    //getUserOptions(options);
  }

  prerun(){
    let self = this;
    let state = this.state; // options object combined with current state

    // Get graph information from Cytoscape
    let nodes = state.nodes;
    let edges = state.edges;
    let idToLNode = this.idToLNode = {};

    //Initialize SBGN elements
    let sbgnLayout = this.sbgnLayout = new SBGNLayout();
    let graphManager = this.graphManager = sbgnLayout.newGraphManager();
    this.root = graphManager.addRoot();

    // Establishing node relations in the GraphManager object
    this.processChildrenList(this.root, this.getTopMostNodes(nodes), sbgnLayout);

    for (var i = 0; i < edges.length; i++) {
      var edge = edges[i];
      var sourceNode = this.idToLNode[edge.data("source")];
      var targetNode = this.idToLNode[edge.data("target")];
      if(sourceNode !== targetNode && sourceNode.getEdgesBetween(targetNode).length == 0){
        var e1 = graphManager.add(sbgnLayout.newEdge(), sourceNode, targetNode);
        e1.id = edge.id();
      }
    }
    // First phase of the algorithm
    // If incremental is true, skip over Phase I
    if (state.randomize) {
      sbgnLayout.runLayout();
    }
  }

  // Get the top most ones of a list of nodes
  // Note: Taken from CoSE-Bilkent !!
  getTopMostNodes( nodes ) {
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

  // Note: Taken from CoSE-Bilkent !!
  processChildrenList ( parent, children, layout ) {
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
      theNode.class = theChild.data("class");

      // Attach the paddings of cy node to layout node
      theNode.paddingLeft = parseInt( theChild.css('padding') );
      theNode.paddingTop = parseInt( theChild.css('padding') );
      theNode.paddingRight = parseInt( theChild.css('padding') );
      theNode.paddingBottom = parseInt( theChild.css('padding') );

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

  // run this each iteraction
  tick(){
    let state = this.state;
    let self = this;
    let isDone;

    // TODO update state for this iteration
    this.state.nodes.forEach( n => {
      let s = this.getScratch(n);
        let location = this.idToLNode[n.data('id')];
        s.x = location.getCenterX();
        s.y = location.getCenterY();
    });

    isDone = this.sbgnLayout.tick();

    state.tickIndex = this.sbgnLayout.totalIterations;

    return isDone;
  }

  // run this function after the layout is done ticking
  postrun() {

  }

  // clean up any object refs that could prevent garbage collection, etc.
  destroy() {
    super.destroy();

    return this;
  }
}

module.exports = Layout;