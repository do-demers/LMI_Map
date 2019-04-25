function make_bar(data){

    d3.select("#edu_bar").select("svg").remove();

    var barHeight = 25, textDy = 18, width = 1020, height = 50, padding = 10;

    var barX = 10;

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var svg = d3.select("#edu_bar")
        .append("svg")
        .attr("id", "bar_svg")
        .attr("width", width)
        .attr("height", height);

    var x = d3.scaleLinear()
        .range([0,width - 2 * padding])
        .domain([0,100]);

    var bars = svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "bar");

    bars.append("rect")
        .attr("width", function(d){
            return x(d.percent);
        })
        .attr("height", barHeight)
        .attr("x", function(d){
            var temp = barX;
            barX +=x(d.percent);
            return temp;
        })
        .attr("fill", function(d, i) {
            return color(i);
        });
        //.style("stroke", "white")
        //.style("stroke-width", "1");
    
    //Reset for labels
    /*barX = 10;

    bars.append("text")
        .attr("class","barText")
        .attr("dy", textDy)
        .attr("x", function(d){
            var temp = barX + x(d.percent)/2;
            barX +=x(d.percent);
            return temp;
        })
        .style("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .style("font-size", "14px")
        .attr("fill", "white")
        .text( function (d){
            return d.percent + "%";
        });*/

    bars.append("title")
        .text( function (d){
            return d.edu + ", " + d.percent + "%";
        });

    bars.on("mouseover", function() {
        d3.select(this)
            .style("opacity", "0.75")
    }).
    on("mouseout", function() {
        d3.select(this)
            .style("opacity", "1.0");
    });

    //Add axis
    var xAxis = d3.axisBottom(x)
        .scale(x)
        .tickFormat(function(d) { return d + "%"; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + padding + ", " + (barHeight +1) +")")
        .call(xAxis);

}

