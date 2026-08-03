# cytoscape-sbgn-layout

## Description

cytoscape-sbgn-layout is a Cytoscape.js extension supporting the layout of SBGN PD and AF diagrams. It enables users to influence the arrangement of an SBGN map or a selected subgraph through simple sketches. Users can draw structural hints, such as an L-shape or rectangle, on a canvas to indicate a desired layout, and the algorithm adapts the positions of the corresponding graph elements to follow these constraints. 

The extension also provides an SBGN-specific refinement step that organizes nodes according to their functional roles (input, output, modifier) and aligns edges orthogonally or diagonally to improve readability. 

## Demo
Click [here](https://sciluna.github.io/cytoscape.js-sbgn-layout/demo/demo.html) for a demo.

## Dependencies

 * Cytoscape.js
 * cose-base
 * SketchLay
 * sbgnml-to-cytoscape (for cli)
 * xml-js (for cli)

## Usage instructions

Download the library:
 * via npm: `npm install cytoscape-sbgn-layout`,
 * via bower: `bower install cytoscape-sbgn-layout`, or
 * via direct download in the repository (probably from a tag).

Import the library as appropriate for your project:

ES import:

```js
import cytoscape from 'cytoscape';
import sbgnLayout from 'cytoscape-sbgn-layout';

cytoscape.use( sbgnLayout );
```

CommonJS require:

```js
let cytoscape = require('cytoscape');
let sbgnLayout = require('cytoscape-sbgn-layout');

cytoscape.use( sbgnLayout ); // register extension
```

AMD:

```js
require(['cytoscape', 'cytoscape-sbgn-layout'], function( cytoscape, sbgnLayout ){
  sbgnLayout( cytoscape ); // register extension
});
```

Plain HTML/JS has the extension registered for you automatically, because no `require()` is needed. Just add the following files:

```
<script src="https://unpkg.com/layout-base/layout-base.js"></script>
<script src="https://unpkg.com/cose-base/cose-base.js"></script>
<script src="https://unpkg.com/cytoscape-sbgn-layout/cytoscape-sbgn-layout.js"></script>
```

### CLI Usage
Clone the repository and install the dependencies:

```bash
git clone https://github.com/sciluna/cytoscape.js-sbgn-layout.git
cd cytoscape.js-sbgn-layout
npm install
```

Run the SBGN layout on an input SBGNML file and write the updated layout.

```bash
npm run cli -- --input path/to/input.sbgn --output path/to/output.sbgn
```

Pass additional options with `--`:

```bash
npm run cli -- --help
```

Common options:

```text
--randomize / --no-randomize // for polishing layout, use --no-randomize
--ideal-edge-length NUM
--map-type PD|AF
--slope-threshold NUM
```

Note: CLI usage currently doesn't support sketch-based layout. 

## API

When calling the layout, e.g. `cy.layout({ name: 'sbgn-layout', ... })`, the following options are supported:

```js
var defaultOptions = {

  // Use random node positions at beginning of layout
  // if this is set to false, then quality option must be "proof"
  randomize: true, 
  // Whether or not to animate the layout
  animate: true, 
  // Duration of animation in ms, if enabled
  animationDuration: 1000, 
  // Easing of animation, if enabled
  animationEasing: undefined, 
  // Fit the viewport to the repositioned nodes
  fit: true, 
  // Padding around layout
  padding: 30,
  // Whether to include labels in node dimensions. Valid in "proof" quality
  nodeDimensionsIncludeLabels: false,
  // Whether or not simple nodes (non-compound nodes) are of uniform dimensions
  uniformNodeDimensions: false,

  // map type - PD or AF
  mapType: "PD",
  // slope threshold to decide orientation during polishing
  slopeThreshold: 0.5,
  
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

  /* sketch-based layout options */
  // an ImageData object returned from CanvasRenderingContext2D: getImageData() method
  imageData: undefined,
  // a cy collection that contains graph elements that the algorithm will apply
  // if it is undefined, then algorithm applies to whole graph
  subset: undefined,

  /* layout event callbacks */
  ready: () => {}, // on layoutready
  stop: () => {} // on layoutstop
};
```
## Publishing instructions

This project is set up to automatically be published to npm and bower.  To publish:

1. Build the extension : `npm run build:release`
1. Commit the build : `git commit -am "Build for release"`
1. Bump the version number and tag: `npm version major|minor|patch`
1. Push to origin: `git push && git push --tags`
1. Publish to npm: `npm publish .`

## Team
[Hasan Balci](https://github.com/hasanbalci) and [Augustin Luna](https://github.com/cannin) of [Luna Lab](https://github.com/sciluna)

