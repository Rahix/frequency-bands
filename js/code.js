var fb_data;
var fb_current_filter = "Frequency";
var fb_filter_text = "";

function filter_table() {
	var selection;
	switch(fb_current_filter) {
		case "Frequency":
			selection = d3.select("#table_body").selectAll("tr").filter(function(d,i) {
				console.log(fb_filter_text + " " + d.uplink_lower + " " + d.uplink_upper);
				if(fb_filter_text == "") {
					return true;
				}
				if((((+fb_filter_text >= d.uplink_lower)&&(+fb_filter_text <= d.uplink_upper))
						||((+fb_filter_text >= d.downlink_lower)&&(+fb_filter_text <= d.downlink_upper)))) {
					return true;
				}
				return false;
			});
			break;
		case "OB":
			selection = d3.select("#table_body").selectAll("tr").filter(function(d,i) {
				if(fb_filter_text == "") {
					return true;
				}
				if(+fb_filter_text == d.operating_band) {
					return true;
				}
				return false;
			});
			break;
		case "DM":
			selection = d3.select("#table_body").selectAll("tr").filter(function(d,i) {
				if(fb_filter_text == "") {
					return true;
				}
				if(fb_filter_text == d.duplex_mode) {
					return true;
				}
				return false;
			});
			break;
	}
	d3.select("#table_body").selectAll("tr").classed("failfilter", true);
	selection.classed("failfilter", false);
}

function set_name() {
	switch(fb_current_filter) {
		case "Frequency":
			document.querySelector("#current_action").innerHTML = "Frequency";
			break;
		case "OB":
			document.querySelector("#current_action").innerHTML = "Operating Band";
			break;
		case "DM":
			document.querySelector("#current_action").innerHTML = "Duplex Mode";
			break;
	}
	filter_table();
}

function filter_changed() {
	fb_filter_text = document.querySelector("#filter-text").value;
	filter_table();
}

function pretty_print_mhz(mhz) {
	if(isNaN(mhz)) {
		return "N/A";
	}
	if(mhz < 10000)
		return mhz + " Mhz";
	return (mhz/1000) + " Ghz";
}

function load_table() {
	// Create table base structure

	row = d3.select("#table_body").selectAll("tr")
		.data(fb_data)
		.enter()
		.append("tr");

	row.append("td")
		.text(function(d) {return d.operating_band});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.uplink_bandwidth)});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.uplink_lower)});

	row.append("td")
		.classed("uplink-mid", true)
		.text(function(d) {return pretty_print_mhz(d.uplink_mid)});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.uplink_upper)});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.bandgap)});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.downlink_bandwidth)});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.downlink_lower)});

	row.append("td")
		.classed("downlink-mid", true)
		.text(function(d) {return pretty_print_mhz(d.downlink_mid)});

	row.append("td")
		.text(function(d) {return pretty_print_mhz(d.downlink_upper)});

	row.append("td")
		.text(function(d) {return d.duplex_mode});

	row.append("td")
		.text(function(d) {return d.note});
}

function init() {
	d3.csv("data/fb.csv", function(error, data) {
		data.forEach(function(d) {
			d.operating_band = +d.operating_band;
			d.uplink_lower = +d.uplink_lower;
			d.uplink_upper = +d.uplink_upper;
			d.downlink_lower = +d.downlink_lower;
			d.downlink_upper = +d.downlink_upper;
			d.uplink_bandwidth = d.uplink_upper - d.uplink_lower;
			d.downlink_bandwidth = d.downlink_upper - d.downlink_lower;
			d.uplink_mid = (d.uplink_lower + d.uplink_upper)/2.0;
			d.downlink_mid = (d.downlink_lower + d.downlink_upper)/2.0;
			d.bandgap = 0;
			if(d.downlink_lower > d.uplink_upper)
				d.bandgap = d.downlink_lower-d.uplink_upper;
			else if(d.duplex_mode == "TDD")
				d.bandgap = NaN;
			else
				d.bandgap = d.uplink_lower-d.downlink_upper;
		});
		fb_data = data;
		load_table();
		sort_by("operating_band", true);
		switch_mid_up();
		switch_mid_down();
		location = "#home";
	});
}

function switch_mid_up() {
	// Uplink
	if(document.querySelector("#uplink-mid").checked) {
		d3.selectAll("td.uplink-mid").text(function(d) {return pretty_print_mhz(d.uplink_mid)});
		d3.selectAll("td.downlink-mid").text(function(d) {return pretty_print_mhz(d.downlink_mid)});
		document.querySelector("#downlink-mid").checked = true;
	} else {
		d3.selectAll("td.uplink-mid").text("-");
		d3.selectAll("td.downlink-mid").text("-");
		document.querySelector("#downlink-mid").checked = false;
	}
}


function switch_mid_down() {
	if(document.querySelector("#downlink-mid").checked) {
		d3.selectAll("td.downlink-mid").text(function(d) {return pretty_print_mhz(d.downlink_mid)});
		d3.selectAll("td.uplink-mid").text(function(d) {return pretty_print_mhz(d.uplink_mid)});
		document.querySelector("#uplink-mid").checked = true;
	} else {
		d3.selectAll("td.downlink-mid").text("-");
		d3.selectAll("td.uplink-mid").text("-");
		document.querySelector("#uplink-mid").checked = false;
	}
}

function sort_by(name, invert) {
	d3.select("#table_body").selectAll("tr").sort(function (a,b) {
		//console.log("a[name]: " + a[name] + " b[name]: " + b[name]);
		if(invert) {
			if (a[name] < b[name])
				return -1;
			if (a[name] > b[name])
				return 1;
			return 0;
		} else {
			if (a[name] < b[name])
				return 1;
			if (a[name] > b[name])
				return -1;
			return 0;
		}
	});
}

init();
