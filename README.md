Zhift
=====

6.170 Final Team Project

Anji Ren
Lily Seropian
Dylan Joss
Victoria Gong

Links
=====

[Application homepage](http://localhost:8080/)

[Test page for API functionality](http://localhost:8080/api)

Instructions
=====

To create an organization/manager:
- Navigate to /.
- Click 'Create an account'.
- Fill out the form, and put 'manager' for Account Type. Leave the 'Role' box empty.
- Click 'Register'.

To create a role/schedule:
- After creating the manager account, you should be logged in.
- Click 'Edit Organization'.
- In the 'Role Name' box, type the name of a role you want to add, and click 'Submit'.
- The role should appear under 'Existing Roles', and if you navigate to 'Home', there should be spaces for the Template Shifts and Shifts for that role.
- You may add as many roles as you like (within reason) in this manner.
- When you're done, click 'Sign Out' to sign out and return to home.

To create an employee:
- Navigate to '/'.
- Click 'Create an account'.
- Fill out the form, and put 'employee' for Account Type. Put a role you created in the previous step in the 'Role' box.
- Click 'Register'.

To create a template shift:
- Navigate to '/schedule/all/[yourOrgName]', and copy the id of the schedule you want to make a template shift for.
- Navigate to '/user/sched/[scheduleId]' and copy the id of an employee you want to be responsible for this template shift.
- Navigate to '/api'.
- Under Template Shift > Create, fill out all fields and click 'Submit'. Day must be a full weekday name (like Monday), and the times must be in HH:MM format.
- The response box should be filled with the created template shift object.

To create a shift:
- Navigate to '/shift/template/all/[scheduleId] and copy the id of a template shift you want to generate a shift from.
- Navigate to '/api'.
- Under Shift > Create, enter all the same information as you entered to create the template shift, and enter the template shift id and a date (MM/DD/YY).
- The response box should be filled with the created shift object.

To delete a template shift (and all shifts generated from it):
- Navigate to '/api'.
- Under Template Shift > Delete, enter the id of the template shift you wish to delete.
- You can test whether the deletion was successful by trying to get the deleted template shift and shifts generated from it (all shifts are available at '/shift/all/[scheduleId]').