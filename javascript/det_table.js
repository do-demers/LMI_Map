function make_det_table (data, columns){

    var appTotal = 0;
    var comafmt = d3.format(",d");

    var headers = ["SELECTION PROCESS NUMBER", "Organisation Code", "Classification", "Various Work Location", "Applications Submitted"];

    var table = d3.select('#adv_det_div')
        .append('table')
        .attr("id", "det_adv_tbl")
        .attr("class","table table-striped table-hover");

    var thead = table.append('thead');

    var tbody = table.append('tbody');

    var tfoot = table.append('tfoot');

    thead.append('tr')
        .attr("class","active")
        .selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .text(function (column) {
            return column;
        });

    thead.append('tr')
        .attr("class","filterRow")
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
        .data(data);

    var rows_grp_enter = rows_grp
        .enter()
        .append('tr')
    ;

    rows_grp_enter.merge(rows_grp);

// create a cell in each row for each column
    rows_grp_enter
        .selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return {
                    column: column,
                    value: row[column],
                    link: row["POSTER_URL"] };
            });
        })
        .enter()
        .append('td')
        .html(function (d) {
            if(d.column === "SELECTION_PROCESS_NUMBER"){
                return "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
                            }
            else {
                return d.value;
            }
        });

    tfoot.append('tr')
        .attr("class","active")
        .selectAll('th')
        .data(headers)
        .enter()
        .append('th');

    $('#det_adv_tbl').DataTable( {
        "paging": true,
        "searching": true,
        orderCellsTop: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var select = $('<select><option value="">All</option></select>')
                    .appendTo( $("#det_adv_tbl thead tr:eq(1) th").eq(column.index()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option>'+d+'</option>' )
                } );
            } );
        }
    } );

    //Count applications, adverts in CDUID, update text
    data.forEach(function(d){
        appTotal += parseInt(d.TOTAL_SUBMITTED);
    });

    d3.select("#applications").text(comafmt(appTotal));
    d3.select("#adverts").text(comafmt(data.length));
}

function update_det_table (d, columns){

    var appTotal = 0;
    var comafmt = d3.format(",d");

    $('#det_adv_tbl').DataTable().destroy();

    var sorted_data = _.sortBy(d, 'applications');

    var table_u = d3.select('#det_adv_tbl');

    var tbody_u = table_u.select('tbody');

    var rows_grp_u = tbody_u.selectAll('tr').data(sorted_data);

    rows_grp_u.exit().remove();

    var rows_grp_enter_u = rows_grp_u.enter().append('tr');

    var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
        return columns.map(function (column) {
            return {
                column: column,
                value: row[column],
                link:row["url"] };
        });
    });

    new_tds.html(function (d) {
        if(d.column === "SELECTION_PROCESS_NUMBER"){
            return "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
        }else {
            return d.value;
        }
    });

    new_tds.enter().append('td').html(function (d) {
        if(d.column === "SELECTION_PROCESS_NUMBER"){
            return "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
        }else {
            return d.value;
        }
    });

    $('#det_adv_tbl').DataTable( {
        "paging": true,
        "searching": true,
        orderCellsTop: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var select = $('<select><option value="">All</option></select>')
                    .appendTo( $("#det_adv_tbl thead tr:eq(1) th").eq(column.index()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option>'+d+'</option>' )
                } );
            } );
        }
    } );

    //Count applications, adverts in CDUID
    sorted_data.forEach(function(d){
        appTotal += parseInt(d.TOTAL_SUBMITTED);
    });

    d3.select("#applications").text(comafmt(appTotal));
    d3.select("#adverts").text(comafmt(sorted_data.length));

}


