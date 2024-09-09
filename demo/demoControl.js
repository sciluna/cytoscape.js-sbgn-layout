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
		if(cy.nodes("[class='process']")[0].css('content'))
			cy.nodes("[class='process']").css("content", ".");
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
		filename = "WP121.sbgn";
	}
	else if(sample == "sample4") {
		filename = "R-HSA-5652084.sbgn";
	}
	else if(sample == "sample5") {
		filename = "Beta_oxidation_of_hexanoyl-CoA_to_butanoyl-CoA.xml";
	}
	else if(sample == "sample6") {
		filename = "vitamins_b6_activation_to_pyridoxal_phosphate.sbgn";
	}
	else if(sample == "sample7") {
		filename = "Artemether_Metabolism_Pathway.xml";
	}
	else if(sample == "sample8") {
		filename = "Aminobutyrate_degradation.xml";
	}
	else if(sample == "sample9") {
		filename = "Formation_of_the_Editosome.xml";
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
	loadSample('examples/' + filename);
	document.getElementById("fileName").innerHTML = filename;
});

document.getElementById("randomizeButton").addEventListener("click", function () {
	cy.layout({name: "random"}).run();
});

document.getElementById("layoutButton").addEventListener("click", function () {
	cy.layout({name: "sbgn-layout"}).run();
});