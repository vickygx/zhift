/*  File containing specific errors used by the app

    @author: Vicky Gong
*/

// Any specific errors go into their own object
module.exports.users = {};
module.exports.shifts = {};

//================== Global error functions =================//

module.exports.invalidIdError = {
  status: 400, 
  name: "Bad Input", 
  message: "The given id is not a valid ObjectId"
}

//================== User error functions =================//

//================== Shift error functions =================//