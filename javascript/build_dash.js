
// function makeChart(error, OLMC_data) {//first param is error and not data
//     console.log(OLMC_data);
//     console.log("everything ran");
//     debugger
// };

var wait;

function makeMap(error, csd_data, csd_map, adv_data, LMI_data, lmi_ps_noc_data, commute_data) {

    var prov_bool = 0;

    if (error) {
        console.log("*** ERROR LOADING FILES: " + error + " ***");
    }

    wait = setTimeout(function () {

        renderMap(csd_map, csd_data, prov_bool, LMI_data, lmi_ps_noc_data, commute_data, adv_data);
        make_table(LMI_data, _.without(LMI_data.columns,"cd", "var"), "LMI");
        make_table(lmi_ps_noc_data, _.without(lmi_ps_noc_data.columns,"cd", "var"), "LMI_PS");
        make_table(commute_data, _.without(commute_data.columns,"cd", "value", "var"), "comm_tbl");
        make_pie(commute_data);
        make_det_table(adv_data);


    }, 1);

}

