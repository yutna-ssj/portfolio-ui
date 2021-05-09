
export const HttpMethod = {
    GET: 'GET',
    POST: 'POST'
}


const http = (method, url, body = {}) => {
    return new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);

        xhttp.onreadystatechange = function() {
            if (xhttp.readyState === XMLHttpRequest.DONE) {
                if (xhttp.status === 200) {
                    resolve(JSON.parse(xhttp.response));
                } else {
                    reject(JSON.parse(xhttp.response));
                }
            }
        }

        if (method === HttpMethod.GET) {
            xhttp.send();
        } else {
            xhttp.send(JSON.stringify(body));
        }

    });
}




export default http;