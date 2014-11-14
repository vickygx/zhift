/*  Controller for the api testing page
*   Contains all the eventlisteners and varaibles.
* 
*   @author: Vicky Gong
*/
var DemoController = function() {
  
    // Starts all processes
    var init = function() {
      eventListeners();
    };

    var eventListeners = function() {
        /*================================= Organization ===============================*/
        (function(){

            // Listener for creating organization form
            $('#createOrgForm').on('submit', function(e){
                e.preventDefault();

                var data = $(this).serializeArray();

                // Sending request 
                $.ajax({
                    datatype: "json", 
                    type: 'POST', 
                    url: '/org', 
                    data: data
                }).always(function(res) {
                    $("#createOrgResponse").text(JSON.stringify(res));
                });

            });

            // Listener for getting organization form
            $('#getOrgForm').on('submit', function(e){
                e.preventDefault();
                var name = $(this)[0].elements["name"].value;
                // Sending request 
                $.ajax({
                    datatype: "json", 
                    type: 'GET', 
                    url: '/org/' + name
                }).always(function(res) {
                    $("#getOrgResponse").text(JSON.stringify(res));
                });
            });


        })();
    /*=================================== Schedule =================================*/
        (function(){
            
            // Listener for creating schedule form
            $('#createScheduleForm').on('submit', function(e){
                e.preventDefault();

                var data = $(this).serializeArray();

                // Sending request 
                $.ajax({
                    datatype: "json", 
                    type: 'POST', 
                    url: '/schedule', 
                    data: data
                }).always(function(res) {
                    $("#createScheduleResponse").text(JSON.stringify(res));
                });

            });

            // Listener for getting schedule form
            $('#getScheduleForm').on('submit', function(e){
                e.preventDefault();

                var scheduleid = $(this)[0].elements["id"].value;

                // Sending request 
                $.ajax({
                    datatype: "json", 
                    type: 'GET', 
                    url: '/schedule/' + scheduleid, 
                }).always(function(res) {
                    $("#getScheduleResponse").text(JSON.stringify(res));
                });

            });
        })();

        /*===================================== User ===================================*/
        (function(){

        })();

        /*================================ TemplateShift ===============================*/
        (function(){

        })();

        /*==================================== Shift ===================================*/
        (function(){

        })();
    }
      
    return {
        init: init
    }
}