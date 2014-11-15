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

        var attachCreateListener = function(formId, url, responseBoxId) {
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

        var attachGetListener = function(formId, url, responseBoxId) {
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

        var attachDeleteListener = function(formId, url, responseBoxId) {
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
            attachCreateListener('createOrgForm', 'org', 'createOrgResponse');
            attachGetListener('getOrgForm', 'org', 'getOrgResponse');
        })();

        /*=================================== Schedule =================================*/
        (function(){
            attachCreateListener('createScheduleForm', 'schedule', 'createScheduleResponse');
            attachGetListener('getScheduleForm', 'schedule', 'getScheduleResponse');
        })();

        /*===================================== User ===================================*/
        (function(){
            attachCreateListener('createUserForm', 'user', 'createUserResponse');
            attachGetListener('getUserForm', 'user', 'getUserResponse');
        })();

        /*================================ TemplateShift ===============================*/
        (function(){
            attachCreateListener('createTemplateShiftForm', 'shift/template', 'createTemplateShiftResponse');
            attachGetListener('getTemplateShift', 'shift/template', 'getTemplateShiftResponse');
            attachDeleteListener('deleteTemplateShift', 'shift/template', 'deleteTemplateShiftResponse');
        })();

        /*==================================== Shift ===================================*/
        (function(){
            attachCreateListener('createShiftForm', 'shift', 'createShiftResponse');
            attachGetListener('getShift', 'shift', 'getShiftResponse');
        })();
    }
      
    return {
        init: init
    };
}