export const AuthAction = {
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILED: 'LOGIN_FAILED',
    LOGOUT: 'LOGOUT'
}

export const authReducer = (state = {
    logged: localStorage.getItem('yuttana_logged'),
    logged_id: localStorage.getItem('yuttana_logged_id')
}, action) => {
    switch (action.type) {
        case AuthAction.LOGIN_SUCCESS:
            localStorage.setItem('yuttana_logged', action.payload.username);
            localStorage.setItem('yuttana_logged_id', action.payload.user_id);
            state = { logged: localStorage.getItem('yuttana_logged'), logged_id: localStorage.getItem('yuttana_logged_id') };
            return state;
        case AuthAction.LOGIN_FAILED:
            localStorage.removeItem('yuttana_logged');
            localStorage.removeItem('yuttana_logged_id');
            state = { logged: localStorage.getItem('yuttana_logged'), logged_id: localStorage.getItem('yuttana_logged_id') };
            return state;
        case AuthAction.LOGOUT:
            localStorage.removeItem('yuttana_logged');
            localStorage.removeItem('yuttana_logged_id');
            state = { logged: localStorage.getItem('yuttana_logged'), logged_id: localStorage.getItem('yuttana_logged_id') };
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
