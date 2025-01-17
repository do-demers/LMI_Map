function renderMap(map_data, LMI_data, lmi_ps_noc_data, commute_data, adv_data, edu_data) {

    d3.select("#cduid_short").text("Division No. 1");

    var width = 800,
        height = 600,
        active = d3.select(null);

    var projection = d3.geoConicConformal()
        .parallels([33, 45])
        .rotate([96, -39])
        .fitSize([width-5, height-5], map_data);

    var zoom = d3.zoom()
        .scaleExtent([1, 40])
        .on("zoom", zoomed);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select("#map_svg")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#fff")
        .on("click", stopped, true);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg.call(zoom);

    g.append("g")
        .attr("class", "states")
        .style("stroke", "black")
        .style("stroke-width", "0.5px")
        .style("stroke-linejoin", "bevel")
        .selectAll("path")
        .data(map_data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function (d) {
            return _.isUndefined(d.properties.CDUID) ? d.properties.PRNAME : d.properties.CDUID;
        })
        .on("click", clicked)
        .append("title")
        .text(function(d){
            return _.isUndefined(d.properties.CDUID) ? d.properties.PRNAME : d.properties.CDNAME;
        });

    d3.select("path[id='1001']").style("fill", "#3d87ff");
    active = d3.select("path[id='1001']");

    g.on("mouseover", function() {
        d3.select(this)
            .style("opacity", "0.75");
    })
        .on("mouseout", function() {
            d3.select(this)
                .style("opacity", "1.0");
        });

     function clicked(d) {

        var cduid = d.properties.CDUID;

        if (active.node() === this) return reset();

        //Remove class and highlight colour from previous active census division
        active.attr("class", "").style("fill", "#fff");

        //Select currently clicked census division as active and give it a highlight colour
        active = d3.select(this).attr("class", "active")
            .style("fill", "#3d87ff");

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(40, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );

        d3.select("#cduid_short").text( d.properties.CDNAME);

        make_table(_.where(LMI_data, {cd: cduid}), _.without(LMI_data.columns,"cd", "var"), "LMI");
        make_table(_.where(lmi_ps_noc_data, {cd: cduid}),  _.without(lmi_ps_noc_data.columns,"cd", "var"), "LMI_PS");
        make_table(_.where(commute_data, {cd: cduid}),  _.without(commute_data.columns,"cd", "value", "var"), "comm_tbl");
        make_table(_.where(edu_data, {cd: cduid}), _.without(edu_data.columns, "cd", "var"), "edu_tbl");
        make_bar(_.where(edu_data, {cd: cduid}));
        update_pie(_.where(commute_data, {cd: cduid}));
        update_det_table(_.where(adv_data, {cd: cduid}),_.without(adv_data.columns,"cd", "POSTER_URL", "CAR_CHC_ID","SELECTION_PROCESS_NUMBER", "POSITIONS_AVAILABLE", "tot_in"));
    }

    function reset() {

        d3.select(active).node()
            .style("stroke-width", "0.5px");

        //Remove class and highlight colour from previous active census division
        active.attr("class", "").style("fill", "#fff");
        active = d3.select(null);

        svg.transition()
            .duration(750)
            .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
    }

    function zoomed() {
        g.style("stroke-width", 0.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

}

