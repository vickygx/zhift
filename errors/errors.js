/*  File containing specific errors used by the app

    @author: Vicky Gong
*/

// Any specific errors go into their own object
module.exports.orgs = {};
module.exports.users = {};
module.exports.shifts = {};
module.exports.schedules = {};
module.exports.records = {};

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

module.exports.orgs.invalidId = {
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

module.exports.shifts.createNotManagerError = function(extraInfo){
    return {
        status: 401,
        name: "Bad permissions",
        message: "Unauthorized, you are not a manager of the appropriate organization or schedule. " + extraInfo
    }
}

module.exports.shifts.createInvalidManagerOrUserError = function(extraInfo){
    return {
        status: 401,
        name: "Bad permissions",
        message: "Unauthorized, you are not a manager or the owner of requested. " + extraInfo
    }
}

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

module.exports.shifts.employeeNotFound = {
    status: 404,
    message: "Invalid user id."
}

//================== Schedule error functions =================//

module.exports.schedules.invalidScheduleId = {
    status: 400,
    name: "Bad Input",
    message: "The given schedule id doesn't exist"
};

//================== Record error functions =================//

module.exports.records.invalidScheduleId = {
    status: 404,
    message: "The given schedule id doesn't exist"
};

module.exports.records.unauthorized = {
    status: 403,
    message: "Unauthorized, you are not a manager of the appropriate organization. Cannot get records."
}