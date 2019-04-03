function make_table (data, columns, id){

    var headers = columns;
    d3.select('#'+id+'_div').select('table').remove();

    var table = d3.select('#'+id+'_div')
        .append('table')
        .attr("id", id)
        .attr("class","table table-striped table-hover");

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
        .data(data);

    var rows_grp_enter = rows_grp
        .enter()
        .append('tr')
    ;

    rows_grp_enter.merge(rows_grp);

    //Assign number formats
    val_format(rows_grp_enter, columns);

    //Add colour series to commute table
    if (id === "comm_tbl"){
        make_series();
    }

    //Add headers to tables
    make_headers(id);
}

//Apply number formats, add links
function val_format(rows_grp_enter, columns){

    var comafmt = d3.format(",d");
    var pctformat = d3.format(",.1%");

    rows_grp_enter
        .selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                //Num formats for columns in general
                new_val = ( _.contains(["value", "LMI_value", "PS_value"],column ) ? comafmt(row[column]) : column === "share" ? pctformat(row[column]) : row[column]);
                //Num formats in specific LMI
                new_val = ( _.contains(["Participation rate", "Employment rate", "Unemployment rate"],row["indicator"] )&& row[column] === row["value"] ? pctformat(row["value"]) : new_val);
                return {
                    column: column,
                    value: new_val,
                    link:row["url"]
                };
            });
        })
        .enter()
        .append('td')
        .html(function (d) {
            if(d.column === "Sel_Process_Nbr"){
                return "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
            }
            else {
                return d.value;
            }
        });
}

//Function to create colour series label to commute table
function make_series (){

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    //Title
    var sHead = d3.select("#comm_tbl_div").select("thead");

    sHead.selectAll("tr")
        .append('th');

    //Colours
    var series = d3.select("#comm_tbl_div").select("tbody");

    series.selectAll("tr")
        .append('td')
        .html(function (d,i) {
            return '<svg width="20" height="20"><title>Series color</title><rect width="20" height="20"  fill="' + color(i) + '"/> </svg>'
        });
}

//Function to assign headers
function make_headers (table){

    var i = 0;
    var headers = d3.select("#" + table + "_div").selectAll("th");

    var length = headers.nodes().length;
    var lmi = ["Indicator", "Value"];
    var comm = ["Commute", "Share", ""];
    var occ = ["Category", "Market Population", "Public Service"];

    switch (table){
        case "LMI":
            for (i = 0; i < length; i++) {
                headers.nodes()[i].innerHTML = lmi[i];
            }
            break;

        case "comm_tbl":
            for (i = 0; i < length; i++) {
                headers.nodes()[i].innerHTML = comm[i];
            }
            break;

        case "LMI_PS":
            for (i = 0; i < length; i++) {
                headers.nodes()[i].innerHTML = occ[i];
            }
            break;
    }
}