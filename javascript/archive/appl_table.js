function make_appl_table (data){


    var new_data = _.where(data, {cd: "1001"});

    var columns = _.without(data.columns,"FOL_eng","FOL_fra","in","out");
    var headers = columns;

    var table = d3.select('#appl_sum_div')
        .append('table')
        .attr("id", "appl_sum_tbl")
        .attr("class","table table-striped table-hover")

    var thead = table.append('thead');

    var tbody = table.append('tbody');

    thead.append('tr')
        .attr("class","active")
        .selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .text(function (column) {
            return column;
        });

// create a row for each object in the data
    var rows_grp = tbody
        .selectAll('tr')
        .data(new_data);

    var rows_grp_enter = rows_grp
        .enter()
        .append('tr')
    ;

    rows_grp_enter.merge(rows_grp);

    rows_grp_enter
        .selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column],link:row["url"] };
            });
        })
        .enter()
        .append('td')
        .html(function (d) {
            if(d.column === "Sel_Process_Nbr"){
                var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
                return new_sel_proc;
            }
            else {
                return d.value;
            }
        });

}