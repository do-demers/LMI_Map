function renderMap(map_data, pop_data, prov_bool, LMI_data, lmi_ps_noc_data, commute_data, adv_data) {

     var color = d3.scaleOrdinal(d3.schemeCategory20);

    var width = 700,
        height = 700,
        active = d3.select(null)
    ;

    var projection = d3.geoConicConformal()
        .parallels([33, 45])
        .rotate([96, -39])
        .fitSize([width, height], map_data);


    var zoom = d3.zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed);


    var path = d3.geoPath()
        .projection(projection);

    // d3.selectAll("svg").remove()

    var svg = d3.select("#map_svg")
        // .append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "#f9f9f9")
        .on("click", stopped, true);

    svg.append("rect")
        .attr("class", "background")
        .attr("width", width)
        .attr("height", height)
        .on("click", reset);

    var g = svg.append("g");

    svg.call(zoom)

    g.append("g")
        .attr("class", "states")
        .style("stroke", "black")
        .style("stroke-width", "0.5px")
        .selectAll("path")
        .data(map_data.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", function (d) {
            return _.isUndefined(d.properties.CDUID) ? d.properties.PRNAME : d.properties.CDNAME;
        })
        .on("click", clicked);

    function clicked(d) {

        if (active.node() === this) return reset();

        active.attr("class", "");

        active = d3.select(this).attr("class", "active");

        d3.selectAll("path")
            .style("stroke-width", "0.5px");

        d3.select(this)
            .style("stroke-width", "1.5px");

        var bounds = path.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

        svg.transition()
            .duration(750)
            .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );


        var cduid = d.properties.CDUID;

        d3.select("#summary").text("The new CDUID is "+ cduid)
        // LMI_data, lmi_ps_noc_data, commute_data, adv_data

        update_table(_.where(LMI_data, {cd: cduid}), _.without(LMI_data.columns,"cd", "var"), "LMI");
        update_table(_.where(lmi_ps_noc_data, {cd: cduid}),  _.without(lmi_ps_noc_data.columns,"cd", "var"), "LMI_PS");
        update_table(_.where(commute_data, {cd: cduid}),  _.without(commute_data.columns,"cd", "value", "var"), "comm_tbl");
        update_pie(_.where(commute_data, {cd: cduid}));
        update_det_table(_.where(adv_data, {cd: cduid}),_.without(adv_data.columns,"cd", "POSTER_URL", "CAR_CHC_ID", "POSITIONS_AVAILABLE", "tot_in"));

    }

    function reset() {

        d3.select(active).node()
            .style("stroke-width", "1px");

        active.classed("active", false);
        active = d3.select(null);

        svg.transition()
            .duration(750)
            .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4

    }

    function zoomed() {
        g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform); // updated for d3 v4
    }

    function stopped() {
        if (d3.event.defaultPrevented) d3.event.stopPropagation();
    }

};

