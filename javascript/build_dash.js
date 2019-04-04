
// function makeChart(error, OLMC_data) {//first param is error and not data
//     console.log(OLMC_data);
//     console.log("everything ran");
//     debugger
// };

var wait;
//test commit
//test commit2
function makeMap(error, csd_data, csd_map, adv_data, LMI_data, lmi_ps_noc_data, commute_data) {

    var prov_bool = 0;

    if (error) {
        console.log("*** ERROR LOADING FILES: " + error + " ***");
    }

    wait = setTimeout(function () {

        renderMap(csd_map, csd_data, prov_bool, LMI_data, lmi_ps_noc_data, commute_data, adv_data);
        make_table(_.where(LMI_data, {cd: "1001"}), _.without(LMI_data.columns,"cd", "var"), "LMI");
        make_table(_.where(lmi_ps_noc_data, {cd: "1001"}), _.without(lmi_ps_noc_data.columns,"cd", "var"), "LMI_PS");
        make_table(_.where(commute_data, {cd: "1001"}), _.without(commute_data.columns,"cd", "value", "var"), "comm_tbl");
        make_pie(_.where(commute_data, {cd: "1001"}));
        make_det_table(_.where(adv_data, {cd: "1001"}),_.without(adv_data.columns,"cd", "POSTER_URL", "CAR_CHC_ID", "POSITIONS_AVAILABLE", "tot_in"));


    }, 1);

}

