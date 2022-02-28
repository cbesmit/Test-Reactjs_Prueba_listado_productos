export default class fetchServer {
    static baseUrl = 'https://fakestoreapi.com/';

    constructor() {
    }

    static async call(url = '', method = 'GET', data = {}) {
        let othat = this;

        let callUrl = othat.baseUrl + url;
        let settings = {
            method: method,
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        };
        if (data.constructor === Object && Object.keys(data).length !== 0) {
            settings.body = JSON.stringify(data);
        }
        return await fetch(callUrl, settings)
            .then(res => {
                //if (!res.ok) throw new Error(res.status);
                return res.text().then(function (text) {
                    return { 'data': text, 'status': res.status, 'ok': res.ok }
                });
            })
            .then(
                (result) => {
                    let response = result;
                    try {
                        response.data = JSON.parse(result.data);
                        return response;
                    } catch (er) {
                        return result;
                    }
                },
                (error) => {
                    throw new Error(error);
                }
            );
    }

    static async callFormData(url = '', method = 'POST', data = {}) {
        let othat = this;

        let callUrl = othat.baseUrl + url;
        let settings = {
            method: method,
            headers: new Headers({
            })
        };
        settings.body = data;
        return await fetch(callUrl, settings)
            .then(res => {
                //if (!res.ok) throw new Error(res.status);
                return res.text().then(function (text) {
                    return { 'data': text, 'status': res.status, 'ok': res.ok }
                });
            })
            .then(
                (result) => {
                    let response = result;
                    try {
                        response.data = JSON.parse(result.data);
                        return response;
                    } catch (er) {
                        return result;
                    }
                },
                (error) => {
                    throw new Error(error);
                }
            );
    }

    static getTextError(response, customMessage = 'Error') {
        if (response.constructor === Object && Object.keys(response).length !== 0) {
            if (response.data && response.data.errors && response.data.errors.constructor === Object && Object.keys(response.data.errors).length !== 0) return JSON.stringify(response.data.errors);
            if (response.data && response.data.title) return response.data.title;
            if (response.data && response.data.message) return response.data.message;
            if (response.data.constructor === Object && Object.keys(response.data).length !== 0) return JSON.stringify(response.data);
            if (typeof response.data === 'string') { return JSON.stringify(response.data); }
            return JSON.stringify(response);
        }
        else {
            if (response !== '') return response;
            return customMessage;
        }
    }

}