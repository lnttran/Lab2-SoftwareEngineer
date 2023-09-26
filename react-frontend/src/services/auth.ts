import axios from "axios";

const USER_API_URL = "http://localhost:9000/user/";
// const USER_API_URL = "https://9429d5b9-a4ce-43d8-bf6b-637cc223febe.mock.pstmn.io/";
// https://sde-backend-40b2c0bbfd8e.herokuapp.com/api/password-reset-link

const register = (username: string, email: string, password: string) => {
  return axios.post(USER_API_URL + "signup", {
    username,
    email,
    password,
  });
};


/**
 * this function handle user authentication by sending a POST request to the user endpoint API for user to login 
 * 
 * @param username 
 * @param password 
 * @returns 
 */
const login = (username: string, password: string) => {

  return axios
    .post(USER_API_URL + "login", {
      username,
      password,
    })
    .then((response) => {
      // alert(JSON.stringify(response.data)); // for debugging purposes
      //if there is user's data, store the user's data to the local storage 
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    });
};

const logout = () => {
  //remove user when logout
  localStorage.removeItem("user");
  return axios.post(USER_API_URL + "logout").then((response) => {
    return response.data;
  });
};


const getCurrentUser = (): any | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};


const forgotPassword = (email: string) => {
  // Define the headers for the request


  return axios.post(USER_API_URL + "forgot-password", { email },)
    .then((response) => {
      // alert(JSON.stringify(response.data)); // for debugging purposes
      //if there is user's data, store the user's data to the local storage 
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    });
}

const resetPassword = (jwt: string, newPassword: string) => {
  return axios.post(USER_API_URL + "reset-password", {
    headers: {
      'Authorization': 'Bearer ' + jwt
    }, jwt, newPassword
  }).then((response) => {
    console.log(response.data);

    if (response.data.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    return response.data;
  }).catch(function (error) {
    console.log(error)
  })
}


/**
 * This represents some generic auth provider API, like Firebase.
 */
const fakeAuthProvider = {
  isAuthenticated: false,
  signin(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback: VoidFunction) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};


const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  fakeAuthProvider,
  forgotPassword,
  resetPassword,
}

export default AuthService;