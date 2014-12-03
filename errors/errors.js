/*  File containing specific errors used by the app

    @author: Vicky Gong
*/

// Any specific errors go into their own object
module.exports.org = {};
module.exports.users = {};
module.exports.shifts = {};
module.exports.schedules = {};

//================== Global error functions =================//

module.exports.create400Error = function(name, msg){
    return {
        status: 400,
        name: name,
        message: msg
    };
}

module.exports.invalidIdError = {
    status: 400, 
    name: "Bad Input", 
    message: "The given id is not a valid ObjectId"
};


//================== Org error functions =================//
module.exports.org.invalidId = {
    status: 404,
    message: "The given organization does not exist"
};

//================== User error functions =================//

module.exports.users.invalidUserId = {
    status: 400,
    name: "Bad Input",
    message: "The given user id doesn't exist"
};

//================== Shift error functions =================//

module.exports.shifts.invalidShiftId = {
    status: 400,
    name: "Bad Input",
    message: "The given shift id doesn't exist for the current user."
};

module.exports.shifts.notOwnerOfShift = {
    status: 400,
    name: "Bad permissions",
    message: "User is not owner of shift. Cannot put up for grabs."
};

module.exports.shifts.shiftForWeekAlreadyCreated = {
    status: 400,
    name: "Bad Input",
    message: "Shift associated with this template shift and week already exists! Try another week!"
};

module.exports.shifts.templateShiftDoesNotExist = {
    status: 400,
    name: "Bad Input",
    message: "Cannot create shift from this template shift. Id doesn't exist."
}

module.exports.shifts.invalidDate = {
    status: 400,
    name: "Bad Input",
    message: "Cannot get shifts within this date. Invalid Date."
}

//================== Schedule error functions =================//

module.exports.schedules.invalidScheduleId = {
    status: 400,
    name: "Bad Input",
    message: "The given schedule id doesn't exist"
};