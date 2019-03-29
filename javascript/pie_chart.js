
function make_pie (data){

    var width = 350;
    var height = 350;

    var svg = d3.select('#pie_div')
        .append("svg")
        .attr("id", "pie_svg")
        .attr("width", width)
        .attr("height", height);


    var radius = Math.min(width, height) / 2;

    var g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {  return d.value; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 100);

    var new_data = _.where(data, {cd: "1001"});

    var label = d3.arc()
        .outerRadius(radius-10)
        .innerRadius(radius-100);

    var arc = g
        .selectAll(".arc")
        .data(pie(new_data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arc.append("path")
        .attr("d", path)
        .attr("fill", function(d, i) {  return color(i); });

    arc.append("text")
        .attr("class","pieText")
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "white")
        .text( function (d){
            return d.value;
        });
}

function update_pie(new_data2) {

    var width = 350;
    var height = 350;

    //get rid of previous numbers on pie chart
    //d3.selectAll(".pieText").remove();

    var svg = d3.select('#svg');

    var radius = Math.min(width, height) / 2;

    var g = svg
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var pie = d3.pie()
        .sort(null)
        .value(function(d) {  return d.value; });

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 100);

    var label = d3.arc()
        .outerRadius(radius-10)
        .innerRadius(radius-100);

    var vis = d3.select('#pie_svg');

    var arcs = vis
        .selectAll("path")
        .data(pie(new_data2))
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


    //update text
    d3.selectAll(".pieText")
        .data(pie(new_data2))
        .attr("class","pieText")
        .transition()
        .duration(2000)
        .attrTween("d", arcTween)
        .attr("transform", function (d) {
            return "translate(" + label.centroid(d) + ")";
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "16px")
        .attr("fill", "white")
        .text( function (d){
            return d.value;
        });

    console.log(new_data2);
}

function arcTween(a) {

    var width = 350;
    var height = 350;

    var radius = Math.min(width, height) / 2;

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 100);


    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function(t) {
        return path(i(t));
    };
}
