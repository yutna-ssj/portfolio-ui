export const AuthAction = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT'
}

export const authReducer = (state = { logged: localStorage.getItem('logged') }, action) => {
    switch (action.type) {
        case AuthAction.LOGIN_SUCCESS:
            localStorage.setItem('logged', action.payload.user_id);
            state = { logged: localStorage.getItem('logged') };
            return state;
        case AuthAction.LOGIN_FAILED:
            localStorage.removeItem('logged');
            state = { logged: localStorage.getItem('logged') };
            return state;
        case AuthAction.LOGOUT:
            localStorage.removeItem('logged');
            state = { logged: localStorage.getItem('logged') };
            return state;
        default:
            return state;
    }
}

const loading = [];
export const HttpAction = {
    LOADING: 'LOADING',
    DONE: 'DONE'
}

export const httpReducer = (state = { isLoading: false }, action) => {
    switch (action.type) {
        case HttpAction.LOADING:
            loading.push(true);
            state = { isLoading: loading.length > 0 };
            return state;
        case HttpAction.DONE:
            loading.pop();
            state = { isLoading: loading.length > 0 };
            return state;
        default:
            return state;
    }
}
