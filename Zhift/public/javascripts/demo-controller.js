/*  Controller for the api testing page
*   Contains all the eventlisteners and varaibles.
* 
*   @author: Vicky Gong, Lily Seropian
*/
var DemoController = function() {
  
    // Starts all processes
    var init = function() {
      eventListeners();
    };

    var eventListeners = function() {
        var runCreate = function(formId, url, responseBoxId) {
            $('#' + formId).on('submit', function(e) {
                e.preventDefault();

                var data = $(this).serializeArray();

                $.ajax({
                    datatype: 'json', 
                    type: 'POST', 
                    url: '/' + url, 
                    data: data
                }).always(function(res) {
                    $('#' + responseBoxId).text(JSON.stringify(res));
                });
            });
        };

        var runGet = function(formId, url, responseBoxId) {
            $('#' + formId).on('submit', function(e) {
                e.preventDefault();

                var id = $(this)[0].elements['id'].value;

                $.ajax({
                    datatype: 'json',
                    type: 'GET',
                    url: '/' + url + '/' + id
                }).always(function(res) {
                    $('#' + responseBoxId).text(JSON.stringify(res));
                })
            });
        };

        var runDelete = function(formId, url, responseBoxId) {
            $('#' + formId).on('submit', function(e){
                e.preventDefault();

                var id = $(this)[0].elements['id'].value;

                $.ajax({
                    datatype: 'json', 
                    type: 'DELETE', 
                    url: '/' + url + '/' + id, 
                }).always(function(res) {
                    $('#' + responseBoxId).text(JSON.stringify(res));
                });
            });
        };

        /*================================= Organization ===============================*/
        (function() {
            runCreate('createOrgForm', 'org', 'createOrgResponse');
            runGet('getOrgForm', 'org', 'getOrgResponse');
        })();

        /*=================================== Schedule =================================*/
        (function(){
            runCreate('createScheduleForm', 'schedule', 'createScheduleResponse');
            runGet('getScheduleForm', 'schedule', 'getScheduleResponse');
        })();

        /*===================================== User ===================================*/
        (function(){
            runCreate('createUserForm', 'user', 'createUserResponse');
            runGet('getUserForm', 'user', 'getUserResponse');
        })();

        /*================================ TemplateShift ===============================*/
        (function(){
            runCreate('createTemplateShiftForm', 'shift/template', 'createTemplateShiftResponse');
            runGet('getTemplateShift', 'shift/template', 'getTemplateShiftResponse');
            runDelete('deleteTemplateShift', 'shift/template', 'deleteTemplateShiftResponse');
        })();

        /*==================================== Shift ===================================*/
        (function(){
            runCreate('createShiftForm', 'shift', 'createShiftResponse');
            runGet('getShift', 'shift', 'getShiftResponse');
        })();
    }
      
    return {
        init: init
    }
}