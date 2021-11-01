import { Redirect, Route } from "react-router";
import { store } from "..";

const PrivateRoute = (props) => {

    const logged = store.getState().authState.logged;
    return logged ? <Route path={props.path} component={props.component} /> : <Redirect to='/login' />;
}

export default PrivateRoute;