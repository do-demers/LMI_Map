var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;


//2 - Defining the scale of the color pallet
var color = d3
    .scale
    .category20c();

//creating vg
var vis = d3
    .select('#chart')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + radius + "," + radius + ")")
;

//Creating arcs to the svg
var arc = d3
    .svg
    .arc()
    .outerRadius(radius)
    .innerRadius(100)
;

//the arc will be displayed as a pie ?
var pie = d3
    .layout
    .pie()
    .value(function(d) { return d.values.total_count; })
;


//3 - DEfining the first set of data
//*********** to be changed later*************
//d3.csv("pie_data2.csv", function(error, pie_data2) {
//d3.csv("pop_data.csv", function(error, pop_data) {
var pie_data = d3.csv.parse(d3.select("pre#pie_data").text());


//converting data
pie_data.forEach(function(d) {
    d.dept_cd = d.dept_cd;
    d.tnr_cd = d.tnr_cd;
    d.count = +d.count;
});

// The Pie Chart function needs to start here
function piechart(pie_data){

//Getting selected vlaue (for 1st iteration, the defaulf value is "Public Health Agency of Canada"


//Filter data set on the selected value


//Nest data set on the selected valueand calculated total count for this value
    var arcs = vis
        .selectAll("path.slice")
        .data(pie(new_data))
    ;

    var arcsEnter = arcs
        .enter()
    ;

//Enter	(attributes values)
    arcsEnter
        .append("path")
        .attr("class", "slice")
        .attr("fill", function(d, i){return color(i);})
        .each(function(d) {
            this._current = {
                data: d.data,
                value: d.values ,
                startAngle: 0,
                endAngle: 0};
        })
    ;

//enter and Update
    arcs
        .transition()
        .duration(2000)
        .attrTween("d", arcTween)
    ;

//Exit
    arcs
        .exit()
        .transition()
        .duration(2000)
        .each(function(d) {
            this._current = {data: d.data,
                value: d.values ,
                startAngle: 0,
                endAngle: 0};
        })
        .style("fill-opacity", 1e-6)
        .remove();
}

function arcTween(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return arc(i(t));
    };

}

piechart(pie_data);

d3.select("#id-name")
    .on("change", function() {
        piechart(pie_data);
    });

