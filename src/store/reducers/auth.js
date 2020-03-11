


const authReducer = (state = null, action) => {
  switch (action.type) {
    case 'GET_AUTH':
      return {user: 'Test'};
    default:
      return state;
  }
};

export default authReducer;
