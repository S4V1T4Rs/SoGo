// authActions.js
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGOUT = '@auth/LOGOUT';

// export const loginSuccess = (user) => {
//   localStorage.setItem('user', JSON.stringify(user));
//   return {
//     type: LOGIN_SUCCESS,
//     payload: user
//   };
// };
export const loginSuccess = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  return {
    type: LOGIN_SUCCESS,
    payload: user
  };
};

export const logout = () => {
  localStorage.removeItem('user');
  return {
    type: LOGOUT
  };
};
// authActions.js
export const CHECK_AUTH_STATUS = '@auth/CHECK_AUTH_STATUS';

export const checkAuthStatus = () => ({
  type: CHECK_AUTH_STATUS
});
