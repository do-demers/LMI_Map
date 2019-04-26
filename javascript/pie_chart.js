//globals
var width = 300;
var height = 300;
var radius = Math.min(width-60, height-60) / 2;
var pctformat = d3.format(",.1%");
var color = d3.scaleOrdinal(d3.schemeCategory10);

//Create basis for pie
var svg = d3.select('#pie')
    .append("svg")
    .attr("id", "pie_svg")
    .attr("width", width)
    .attr("height", height);

var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var pie = d3.pie()
    .sort(null)
    .value(function(d) {  return d.value; });

var paths = d3.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 60);

var label = d3.arc()
    .outerRadius(radius+10)
    .innerRadius(radius+10);

function make_pie (data){

   var arc = g
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

   arc.append("path")
       .attr("d", paths)
       .attr("fill", function(d, i) {  return color(i); })
       .each(function(d) { this._current = d; })
       .append("title")
       .text(function(d) { return pctformat(d.data.share); });

   arc.append("text")
       .attr("class","pieText")
       .attr("transform", function (d) {
           return "translate(" + label.centroid(d) + ")";
       })
       .attr("font-family", "sans-serif")
       .style("font-size", "14px")
       .attr("fill", "black")
       .text( function (d){
           return pctformat(d.data.share);
       })
       .each(function(d) { this._current = d; });

    arc.on("mouseover", function() {
        d3.select(this)
            .style("opacity", "0.5");
    })
        .on("mouseout", function() {
            d3.select(this)
                .style("opacity", "1.0");
        });
}

function update_pie(new_data) {

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {  return d.value; });

    var arcs = svg
        .selectAll("path")
        .data(pie(new_data));

    arcs.transition()
        .duration(2000)
        .attrTween("d", arcTween);

    arcs.select("title")
        .text(function(d) { return pctformat(d.data.share); });

    //update text
    d3.selectAll(".pieText")
        .data(pie(new_data))
        .transition()
        .duration(2000)
        .attrTween("d", arcTween)
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        })
        .attr("font-family", "sans-serif")
        .style("font-size", "14px")
        .attr("fill", "black")
        .text( function (d){
            return pctformat(d.data.share);
        });
}

function arcTween(a) {

    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return paths(i(t));
    };
}
