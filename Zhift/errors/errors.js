/*  File containing specific errors used by the app

    @author: Vicky Gong
*/

// Any specific errors go into their own object
module.exports.users = {};
module.exports.shifts = {};
module.exports.schedules = {};

//================== Global error functions =================//

module.exports.create400Error = function(name, msg){
    return {
        status: 400,
        name: name,
        message: msg
    }
}

module.exports.invalidIdError = {
  status: 400, 
  name: "Bad Input", 
  message: "The given id is not a valid ObjectId"
}


//================== User error functions =================//

//================== Shift error functions =================//

module.exports.shifts.invalidShiftId = {
    status: 400,
    name: "Bad Input",
    message: "The given shift id doesn't exist"
}

//================== Schedule error functions =================//

module.exports.schedules.invalidScheduleId = {
    status: 400,
    name: "Bad Input",
    message: "The given schedule id doesn't exist"
}