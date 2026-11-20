HOSPITAL APPOINTMENT & HEALTHCARE PORTAL - HOSPITAL ADMIN MODULE

FILES
1. index.html  - Page structure and forms
2. style.css   - Page design and responsive layout
3. script.js   - Dashboard counts, validation, staff, department and user actions

HOW TO OPEN IN VS CODE
1. Extract Hospital_Admin_Module.zip.
2. Open Visual Studio Code.
3. Click File > Open Folder.
4. Select the Hospital_Admin_Module folder.
5. Open index.html.
6. Right-click inside index.html and choose Open with Live Server.
   If Live Server is not installed, install the Live Server extension first.
   You can also double-click index.html to open it in a browser.

WHAT TO TEST
1. Dashboard: check the four summary numbers.
2. Staff Management: add a Doctor with name, email, role, department, fee and a temporary password.
3. Staff Management: add a Receptionist. Department and fee are not needed for this role.
4. Staff Management: click Edit and save a change.
5. Staff Management: click Deactivate and then Activate.
6. Departments: add a department, set a fee and optionally assign a doctor.
7. Departments: edit or delete a department.
8. Manage Users: search for a user and deactivate/activate an account.
9. Refresh the browser. Demo changes should remain because this example uses localStorage.

IMPORTANT LIMITATIONS
- This is a front-end classroom demonstration using HTML, CSS and JavaScript.
- localStorage saves demo information in the current browser only. It is not a shared database.
- Passwords are deliberately not saved by this demo. A real login system needs a server, database and secure password hashing.
- Total Appointments is sample data (86). It must be connected to the shared appointments database to show a real total.
- Connect this module to the group's common login and database during final integration.
