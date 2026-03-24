const cytoscape = require('cytoscape');
const convert = require('sbgnml-to-cytoscape');
const sbgnStylesheet = require('cytoscape-sbgn-stylesheet');
const sbgnLayout = require('../dist/cytoscape-sbgn-layout.umd.js');

sbgnLayout(cytoscape);

let cy = window.cy = cytoscape({
	container: document.getElementById('cy'),
	style: sbgnStylesheet(cytoscape),
});

cy.style().selector('.pinned')
    .style({
      'underlay-color': 'lightgrey',
			'underlay-padding': '5px',
			'underlay-opacity': 1,
    })
	.update(); // indicate the end of your new stylesheet so that it can be updated on elements

let cyGraph = null;

let loadSample = function (fname) {
	cy.remove(cy.elements());
	fetch(fname).then(function (res) {
		return res.text();
	}).then(function (data) {
		if (fname == "examples/9613829.json") {
			cy.style(defaultStylesheet);
			cy.add(JSON.parse(data).elements);
			cy.fit(cy.elements(), 30);
		} else { // sbgn
			cyGraph = convert(data);
			cy.style(sbgnStylesheet(cytoscape));
			cy.add(cyGraph);
			cy.layout({ name: 'preset' }).run();

			cy.nodes().not(":parent").forEach(node => {			
				let bbox = node.data('bbox');
				node.css('width', bbox.w);
				node.css('height', bbox.h);
				node.css('font-size', 11);
				node.position({x: bbox.x, y: bbox.y});
				if(node.data("class") == "process" || node.data("class") == "omitted process" || node.data("class") == "uncertain process" || node.data("class") == "association" || node.data("class") == "dissociation") {
					if(node.css("content")) {
						node.css("content", ".");
					}
				}
				if(node.data("class") != "compartment" && node.data("class") != "complex") {
					node.css('padding', 0);
				} else if (node.data("class") == "complex") {
					if (node.children().length > 0) {
						node.css('padding', 10);
					} else {
						node.css('padding', 0);
					}
				}
			});
			cy.fit(cy.elements(), 30);
		}
	});
};

document.getElementById("samples").addEventListener("change", function (event) {
	let sample = event.target.value;
	let filename = "";
	if(sample == "sample1") {
		filename = "R-HSA-5652084.sbgn";
	}
	else if(sample == "sample2") {
		filename = "R-HSA-70370.sbgn";
	}
	else if(sample == "sample3") {
		filename = "R-HSA-72764.sbgn";
	}
	else if(sample == "sample4") {
		filename = "glycolysis.sbgn";
	}
	else if(sample == "sample5") {
		filename = "vitamins_b6_activation_to_pyridoxal_phosphate.sbgn";
	}
	else if(sample == "sample6") {
		filename = "R-HSA-70326.sbgn";
	}
	else if(sample == "sample7") {
		filename = "Artemether_Metabolism_Pathway.xml";
	}
	else if(sample == "sample8") {
		filename = "Aminobutyrate_degradation.xml";
	}
	else if(sample == "sample9") {
		filename = "Beta_oxidation_of_hexanoyl-CoA_to_butanoyl-CoA.xml";
	}
	else if(sample == "sample10") {
		filename = "Ketone_body_catabolism.sbgn";
	}
	else if(sample == "sample11") {
		filename = "activated_stat1alpha_induction_of_the_irf1_gene.sbgn";
	}
	else if(sample == "sample12") {
		filename = "Riboflavin_Metabolism_toBeSolved.sbgn";
	}
	else if(sample == "sample13") {
		filename = "Synthesis_of_Ketone_Bodies.sbgn";
	}
	else if(sample == "sample14") {
		filename = "glycolysis_cropped.sbgn";
	}
	else if(sample == "sample15") {
		filename = "WP121.sbgn";
	}
	else if(sample == "sample16") {
		filename = "neuronal_muscle_signaling.sbgn";
  }
	else if(sample == "sample17") {
		filename = "cam-camk_dependent_signaling_to_the_nucleus.sbgn";
  }
	else if(sample == "sample18") {
		filename = "atm_mediated_phosphorylation_of_repair_proteins.sbgn";
  }
	else if(sample == "sample19") {
		filename = "polyq_proteins_interference.sbgn";
  }
	else if(sample == "reactome") {
		filename = "9613829.json";
	}
	loadSample('examples/' + filename);
	document.getElementById("fileName").innerHTML = filename;
});

document.getElementById('clearButton').addEventListener('click', clearCanvas);

document.getElementById("layoutButton").addEventListener("click", function () {
	let imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
	let selectedEles = cy.elements(":selected");
	if(selectedEles.length > 0) {
		let layoutElements = selectedEles.not(".pinned");
		layoutElements.layout({
			name: "sbgn-layout",
			randomize: !document.getElementById("randomize").checked,
			idealEdgeLength: parseFloat(document.getElementById("idealEdgeLength").value),
			fit: false,
			imageData: imageData,
			subset: layoutElements
		}).run();
	} else {
		let layoutElements = cy.elements().not(".pinned");
		layoutElements.layout({
			name: "sbgn-layout",
			randomize: !document.getElementById("randomize").checked,
			idealEdgeLength: parseFloat(document.getElementById("idealEdgeLength").value),
			imageData: imageData
		}).run();
	}
});

document.getElementById("pinSelected").addEventListener("click", function () {
	let selectedNodes = cy.nodes(":selected");
	selectedNodes.addClass("pinned");
	selectedNodes.lock();
});

document.getElementById("unpinSelected").addEventListener("click", function () {
	let selectedNodes = cy.nodes(":selected");
	selectedNodes.removeClass("pinned");
	selectedNodes.unlock();
});

document.getElementById("unpinAll").addEventListener("click", function () {
  cy.nodes().removeClass("pinned");
	cy.nodes().unlock();
});

document.getElementById("selectAll").addEventListener("click", function () {
  cy.elements().select();
});

let defaultStylesheet = [
  {
    selector: 'node',
    style: {
			'label': 'data(displayName)',
      'text-wrap': 'wrap',
    }
  }
];