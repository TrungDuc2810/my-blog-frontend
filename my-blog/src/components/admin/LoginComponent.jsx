// // eslint-disable-next-line no-unused-vars
// import React, { useState } from "react";
// import {
//   loginCallAPI,
//   saveLoggedInUser,
// } from "../../services/AuthService"; // Loại bỏ storeToken
// import { useNavigate } from "react-router-dom";

// const LoginComponent = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");

//   const navigator = useNavigate();

//   async function handleLoginForm(e) {
//     e.preventDefault();

//     await loginCallAPI(username, password)
//       .then((res) => {
//         console.log(res);
//         saveLoggedInUser(username);

//         navigator("/api/home");
//         window.location.reload(false);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   return (
//     <div className="container">
//       <br />
//       <div className="row">
//         <div className="col-md-6 offset-md-3">
//           <div className="card">
//             <div className="card-header">
//               <h2 className="text-center">Admin Login Form</h2>
//             </div>
//             <div className="card-body">
//               <form>
//                 <div className="row mb-3">
//                   <label className="col-md-3 control-label pt-2">
//                     Username or email
//                   </label>
//                   <div className="col-md-9">
//                     <input
//                       type="text"
//                       name="username"
//                       className="form-control"
//                       placeholder="Enter username or email"
//                       value={username}
//                       onChange={(e) => setUsername(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="row mb-3">
//                   <label className="col-md-3 control-label pt-2">Password</label>
//                   <div className="col-md-9">
//                     <input
//                       type="password"
//                       name="password"
//                       className="form-control"
//                       placeholder="Enter password"
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group text-center">
//                   <button
//                     className="btn btn-primary"
//                     onClick={(e) => handleLoginForm(e)}
//                   >
//                     Login
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;
