
var wait;

function makeMap(error, csd_map, adv_data, LMI_data, lmi_ps_noc_data, commute_data, edu_data) {

    if (error) {
        console.log("*** ERROR LOADING FILES: " + error + " ***");
    }

    wait = setTimeout(function () {

        renderMap(csd_map, LMI_data, lmi_ps_noc_data, commute_data, adv_data, edu_data);
        make_table(_.where(LMI_data, {cd: "1001"}), _.without(LMI_data.columns,"cd", "var"), "LMI");
        make_table(_.where(lmi_ps_noc_data, {cd: "1001"}), _.without(lmi_ps_noc_data.columns,"cd", "var"), "LMI_PS");
        make_table(_.where(commute_data, {cd: "1001"}), _.without(commute_data.columns,"cd", "value", "var"), "comm_tbl");
        make_table(_.where(edu_data, {cd: "1001"}), _.without(edu_data.columns, "cd", "var"), "edu_tbl");
        make_pie(_.where(commute_data, {cd: "1001"}));
        make_bar(_.where(edu_data, {cd: "1001"}));
        make_det_table(_.where(adv_data, {cd: "1001"}),_.without(adv_data.columns,"cd", "POSTER_URL", "CAR_CHC_ID","SELECTION_PROCESS_NUMBER", "POSITIONS_AVAILABLE", "tot_in"));


    }, 1);

}

