/**
 * Angular Controller for the employee template shift schedule
 *  portion of the site.
 *
 * Managers can:
 *     See all template shifts for a schedule
 *
 * @author: Vicky Gong
 */

var ZhiftApp = angular.module('ZhiftApp');

ZhiftApp.controller('EmployeeScheduleController', function($scope, ScheduleService, ShiftService) {

    /**
     * Get roles, shifts, and template shifts from database.
     * @param  {String} org The name of the organization from which to get data.
     */
    $scope.init = function(org, scheduleId) {
        $scope.org = org;
        $scope.schedules = [];
        $scope.currentWeek = Date.today();
        $scope.availableWeeks = [];
        resetShifts();

        //TODO: make isManager a param
        var isManager = true;

        if (isManager){
            // Populating schedules + setting current schedule
            getAllSchedules($scope.org, function(){
                if ($scope.schedules.length === 0) {
                    return;
                }

                // Setting current schedule
                $scope.currentScheduleId = $scope.schedules[0]._id;
                $scope.$apply();

                // Populating shifts based on current schedule
                getShifts($scope.currentScheduleId, Date.today(), function(err) {
                    $scope.$apply();
                });
            });
        }
        else {
            $scope.currentScheduleId = scheduleId;
            // Populating shifts based on current schedule
            getShifts($scope.currentScheduleId, Date.today(), function(err) {
                $scope.$apply();
            });
        }

        // Setting the available weeks to pick from
        setAvailableWeeks(function(){
            $scope.$apply();
        })
    };

    /*  Gets template shifts associated with the scheduleId and 
    *   populates $scope.shiftsByDay such that it has the following format:
    *   
    *   $scope.shiftsByDay = {
    *       'Monday': {
    *           8: [], // list of template shifts starting at 8am on Monday
    *           9: [],
    *           etc.
    *        }
    *       'Tuesday':
    *       etc.
    *   }
    *
    *   @param {ObjectId} scheduleId        id of the schedule to get template shfits for
    *   @param {function} callback          callback function that takes err if there is an error, or null 
    *
    */
    var getShifts = function(scheduleId, date, callback){       
        var dateFrom = date;

        // If not sunday, get last sunday
        if (! dateFrom.is().sunday()){
            dateFrom = dateFrom.last().sunday();
        }

        $scope.currentWeek = dateFrom;

        // Getting that week of shifts
        ShiftService.getWeekOfShifts(scheduleId, dateFrom, function(err, shifts){
            if (!err){
                resetShifts();
                
                // Go through template shifts
                for (var i = 0; i < shifts.length; i++){
                    var templateDay = shifts[i].dayOfWeek;
                    var templateHour = getHour(shifts[i].start);

                    var scopeDayHour = $scope.shiftsByDay[templateDay];
                    
                    // Append templateshift to proper day and hour
                    if (!scopeDayHour[templateHour]){
                        scopeDayHour[templateHour] = [];
                    }

                    scopeDayHour[templateHour].push(shifts[i]);
                }
                callback();
            }
            else {
                callback(err);
            }
        });
    }

    var resetShifts = function(){
        $scope.shiftsByDay = 
            {'Monday': {},
            'Tuesday': {},
            'Wednesday': {},
            'Thursday': {},
            'Friday': {},
            'Saturday': {},
            'Sunday': {}};
    }

    /*  Returns the hour of "HH:MM" */
    var getHour = function(string){
        return parseInt(string.split(":")[0]);
    }

    /*  Sets the available weeks. 
    *   This is at most 3 weeks from the given date.
    *   (The current week of the current day, and then two weeks after)
    */
    var setAvailableWeeks = function(callback){
        var currentWeek = Date.today();

        // If not sunday, get last sunday
        if (! currentWeek.is().sunday()){
            currentWeek = currentWeek.last().sunday();
        }

        // Get next 2 weeks
        var week2 = new Date(currentWeek);
        week2.next().sunday();

        var week3 = new Date(week2);
        week3.next().sunday();

        $scope.availableWeeks = [currentWeek, week2, week3];

    }

    /*  Gets all the schedules associated with the organization 
    */
    var getAllSchedules = function(orgId, callback) {
        ScheduleService.getSchedules(orgId, function(err, schedules) {
            $scope.schedules = schedules;
            callback();
        });
    };

    $scope.tradeShift = function(){

    }

    $scope.putUpShift = function(){

    }

    $scope.grabShift = function(){

    }

    /*  Sets the current schedule to the new schedule
    *   And updates the shifts
    */
    $scope.setCurrentSchedule = function(scheduleId) {
        $scope.currentScheduleId = scheduleId;
        getShifts(scheduleId, Date.today(), function(err){
            if (!err)
                $scope.$apply();
        });
    };

   
})

.directive('setCurrentSchedule', function() {
    return {
        restrict: 'C', 
        link: function(scope, element, attrs) {
            element.unbind('click');
            element.bind('click', function(evt) {
                evt.stopPropagation();
                var scheduleId = evt.currentTarget.id;
                scope.setCurrentSchedule(scheduleId);
            });
        }
    };
})
