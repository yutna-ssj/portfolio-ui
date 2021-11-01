import { store } from "../..";
import { AuthAction, HttpAction } from "../../redux/reducer";

export const HTTP_METHOD = {
    GET: 'GET',
    POST: 'POST'
}

export const http = (method, url, body) => {
    store.dispatch({ type: HttpAction.LOADING });
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.withCredentials = true;
        xhr.onreadystatechange = (res) => {
            if (res.currentTarget.readyState === XMLHttpRequest.DONE) {
                store.dispatch({ type: HttpAction.DONE });
                if (xhr.status === 200) {
                    try {
                        resolve(JSON.parse(xhr.response));
                    } catch (e) {
                        resolve(xhr.response);
                    }
                } else if (xhr.status === 403) {
                    store.dispatch({ type: AuthAction.LOGIN_FAILED });
                } else {
                    try {
                        reject(JSON.parse(xhr.response));
                    } catch (e) {
                        reject(xhr.response);
                    }
                }
            }
        }
        body ? xhr.send(JSON.stringify(body)) : xhr.send();
    })
}