var ZhiftApp = angular.module('ZhiftApp');


/*  EXAMPLE OF DIRECTIVE
*/
ZhiftApp.directive('getAllShifts', ['ShiftService', function(ShiftService){
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.bind('click', function(evt) {
                scheduleId = 'temp';
                ShiftService.displayAllShifts(scheduleId);
            });
        }
    };
}]);

