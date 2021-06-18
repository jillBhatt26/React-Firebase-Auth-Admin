const LogIn = user => {
    return {
        type: 'LOGIN',
        payload: user
    };
};

const Logout = () => {
    return {
        type: 'LOGOUT'
    };
};

export { LogIn, Logout };
