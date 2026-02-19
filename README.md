# cytoscape.js-sbgnLayout

## Demo
Click [here](https://sciluna.github.io/cytoscape.js-sbgn-layout/demo/demo.html) for a demo.


## CLI
Run the SBGN layout on an input SBGNML file and write the updated layout.

```bash
npm install
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