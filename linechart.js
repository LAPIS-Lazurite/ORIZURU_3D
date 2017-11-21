
var ip_addr = "192.168.30.39";  // gw addr
var g;
var x,y,z,line,city;

if (rx_data === undefined) {
	var rx_data;
}

function svgLineChart(id,idx,dataList){
	if(g != undefined ) {g.remove();}
	g  = id.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var tmp_table = idx.slice(1).map(function(id){
		var tmp = {id: id}
		tmp.values = dataList.map(function(e){
			return {
				date: e.timestamp,
				value: e.value[id]
			}
		})
		return tmp;
	})

	x = d3.scaleTime().range([0, width_oriz]),
	y = d3.scaleLinear().range([height_oriz, 0]),
	z = d3.scaleOrdinal(d3.schemeCategory10);

	line = d3.line()
		.curve(d3.curveBasis)
		.x(function(d) { return x(d.date); })
		.y(function(d) { return y(d.value); });

	  x.domain(d3.extent(dataList, function(d) { return d.timestamp; }));

	  y.domain([
		d3.min(tmp_table, function(c) { return d3.min(c.values, function(d) { return d.value; }); }),
		d3.max(tmp_table, function(c) { return d3.max(c.values, function(d) { return d.value; }); })
	  ]);

	  z.domain(tmp_table.map(function(c) { return c.id; }));

	 g.append("g")
		  .attr("class", "axis axis--x")
		  .attr("transform", "translate(0," + height_oriz + ")")
		  .call(d3.axisBottom(x));

	 g.append("g")
		  .attr("class", "axis axis--y")
		  .call(d3.axisLeft(y))
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", 6)
		  .attr("dy", "0.71em")
		  .attr("fill", "#000")
		  .text("Degree");

	 city = g.selectAll(".city")
		.data(tmp_table)
		.enter().append("g")
		  .attr("class", "city");

	 city.append("path")
		  .attr("class", "line")
		  .attr("d", function(d) { return line(d.values); })
		  .style("stroke", function(d) { return z(d.id); });

	 city.append("text")
		  .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		  .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.value) + ")"; })
		  .attr("x", 3)
		  .attr("dy", "0.35em")
		  .style("font", "16px sans-serif")
		  .text(function(d) { return d.id; });
}

// #####  表示データ #####
var lineArray = [];
var index_oriz = ['timestamp','ロール角','ピッチ角'];
// #####  表示領域設定 ###
var svg_oriz = d3.select("#orizuru_line").append("svg")
	.attr("width",$('#orizuru_line').width())
	.attr("height",$('#orizuru_line').height());

var margin = {top: 20, right: 80, bottom: 30, left: 50};
var width_oriz = svg_oriz.attr("width") - margin.left - margin.right;
var height_oriz = svg_oriz.attr("height") - margin.top - margin.bottom;

// #####  ネットワーク設定 #####
var url_oriz = "ws://"+ip_addr+":1880/ws/orizuru";
var ws_oriz = new WebSocket(url_oriz);

ws_oriz.onmessage = function(message) {
	rx_data = JSON.parse(message.data);
	//		console.log(rx_data);
	if (lineArray.length > 100) lineArray.shift();
	lineArray.push({
		timestamp: rx_data.t,
		value: {
			'ロール角': parseInt(rx_data.data.roll*100)/100,
			'ピッチ角': parseInt(rx_data.data.pitch*100)/100,
		}
	});
	if (rx_data.data.flap < 0) {
		rx_data.data.corr_flap = (parseInt(rx_data.data.flap) + 1023 + 300) / 100;
	} else {
		rx_data.data.corr_flap = 0;
	}
	svgLineChart(svg_oriz,index_oriz,lineArray);
}
