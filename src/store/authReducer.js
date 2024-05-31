// authReducer.js
const initialState = {
  isAuthenticated: !!localStorage.getItem('authToken'),
  user: JSON.parse(localStorage.getItem('user')) || null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case '@auth/LOGIN_SUCCESS':
      localStorage.setItem('authToken', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    case '@auth/LOGOUT':
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

export default authReducer;
