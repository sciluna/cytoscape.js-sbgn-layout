const cytoscape = require('cytoscape');
const convert = require('sbgnml-to-cytoscape');
const sbgnStylesheet = require('cytoscape-sbgn-stylesheet');
const sbgnLayout = require('../dist/cytoscape-sbgn-layout.umd.js');

sbgnLayout(cytoscape);

let cy = window.cy = cytoscape({
	container: document.getElementById('cy'),
	style: sbgnStylesheet(cytoscape)
});

let cyGraph = null;

let loadSample = function (fname) {
	cy.remove(cy.elements());
	fetch(fname).then(function (res) {
		return res.text();
	}).then(function (data) {
		cyGraph = convert(data);
		cy.add(cyGraph);
		cy.layout({ name: 'sbgn-layout' }).run();
	});
};

document.getElementById("samples").addEventListener("change", function (event) {
	let sample = event.target.value;
	let filename = "";
	if(sample == "sample1") {
		filename = "glycolysis_cropped.sbgn";
	}
	else if(sample == "sample2") {
		filename = "glycolysis.sbgn";
	}
	else if(sample == "sample3") {
		filename = "vitamins_b6_activation_to_pyridoxal_phosphate.sbgn";
	}
	else if(sample == "sample4") {
		filename = "R-HSA-5652084.sbgn";
	}
	else if(sample == "sample5") {
		filename = "WP121.sbgn";
	}
	else if(sample == "sample6") {
		filename = "Hsp90β_interacts_with_MDM2.xml";
	}
/* 	else if(sample == "sample7") {
		filename = "glycolysis_cropped2.sbgn";
	} */
/* 	else if(sample == "sample8") {
		filename = "Repressilator_PD_v7.sbgn";
	} */
/* 	else if(sample == "sample9") {
		filename = "mapk_cascade.sbgn";
	} */
	else if(sample == "sample7") {
		filename = "Ascorbate_and_aldarate_metabolism.xml";
	}
	else if(sample == "sample8") {
		filename = "Selenocompound_metab.xml";
	}
/* 	else if(sample == "sample11") {
		filename = "D-Arginine_and_D-Orn.xml";
	} */
	loadSample('examples/' + filename);
	document.getElementById("fileName").innerHTML = filename;
});

document.getElementById("randomizeButton").addEventListener("click", function () {
	cy.layout({name: "random"}).run();
});

document.getElementById("layoutButton").addEventListener("click", function () {
	cy.layout({name: "sbgn-layout"}).run();
});