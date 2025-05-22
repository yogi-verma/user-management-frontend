![Screenshot (247)](https://github.com/user-attachments/assets/594b76eb-b310-41f3-b27e-7c52ead274d9)


![Screenshot (249)](https://github.com/user-attachments/assets/591e0658-43b9-4e48-b62f-7828f572d48b)


![Screenshot (250)](https://github.com/user-attachments/assets/21aa3391-1950-4124-948d-bb15815f61f4)



🧭 User Access Management System (MERN Stack)
A role-based access management system with authentication, software listing, access request workflow, and role-specific dashboards.

🚀 Tech Stack
Layer	            Technology
1. Backend	           Node.js, Express.js, MongoDB, Mongoose
2. Frontend	           React.js, Tailwind CSS
3. Auth	               JWT, bcrypt
4. Tooling	           dotenv, nodemon, concurrently

👥 User Roles
Role	                   Capabilities
1. Employee	              Register, login, request access to software
2. Manager	              View and approve/reject software access requests
3. Admin	                Create software, view requests, full access

🧩 Features
1. User registration and login (JWT-based)
2. Role-based dashboards and redirection
3. Admin can create and list software\
4. Employees can submit access requests
5. Managers can approve or reject requests
6. MongoDB schemas for users, software, and requests

⚙️ Setup Instructions
📦 Backend Setup (/backend)
1. cd frontend
2. npm install
Then run the server:
     npm run dev



📘 API Documentation
🔐 Auth Routes


1. POST /api/auth/signup
Register a new user. Defaults to role "Employee".
Body:
{
  "username": "johndoe",
  "password": "securepass"
}
Response:
{ "message": "User created successfully" }


2. POST /api/auth/login
Log in and receive a JWT and user role.
Body:
{
  "username": "johndoe",
  "password": "securepass"
}
Response:
{
  "token": "jwt_token_here",
  "role": "Employee"
}

-----------------------------------------------------------------------------------------------------------------------------

🧑‍💼 Software Routes (Admin Only)
3. POST /api/software
Create new software.
Headers: Authorization: Bearer <JWT>
Body:
{
  "name": "Photoshop",
  "description": "Design software",
  "accessLevels": ["Read", "Write", "Admin"]
}
Response:
{ "message": "Software created" }


4. GET /api/software
Returns list of all software entries.

-----------------------------------------------------------------------------------------------------------------------------

🧾 Request Routes (Employee)
5. POST /api/requests
Submit access request.
Headers: Authorization: Bearer <JWT>
Body:
{
  "softwareId": "<id>",
  "accessType": "Write",
  "reason": "Need it for work"
}
Response:
{ "message": "Request submitted" }


6. GET /api/requests/mine
View all access requests made by the logged-in employee.

-----------------------------------------------------------------------------------------------------------------------------

✅ Manager Routes
7. GET /api/requests/pending
Fetch all pending requests (Manager only).
Headers: Authorization: Bearer <JWT>
PATCH /api/requests/:id
Approve or reject a request.
Headers: Authorization: Bearer <JWT>
Body:
{
  "status": "Approved"
}
Response:
{ "message": "Request updated" }

-----------------------------------------------------------------------------------------------------------------------------

🧾 MongoDB Schemas (Mongoose Models)
🧍 User
{
  username: String,
  password: String, // hashed
  role: 'Employee' | 'Manager' | 'Admin'
}

🧠 Software
{
  name: String,
  description: String,
  accessLevels: [String] // e.g., ["Read", "Write", "Admin"]
}

📝 Request
{
  userId: ObjectId, // ref: User
  softwareId: ObjectId, // ref: Software
  accessType: 'Read' | 'Write' | 'Admin',
  reason: String,
  status: 'Pending' | 'Approved' | 'Rejected'
}
   
