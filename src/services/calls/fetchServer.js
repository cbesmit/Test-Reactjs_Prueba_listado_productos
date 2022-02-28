//-!-  Class-cbs-doc : fetchServer  [Besmit-28022022]
//---  d:Hace llamadas a una api rest
export default class fetchServer {
    static baseUrl = 'https://fakestoreapi.com/';

    constructor() {
    }

    //-!-  Fun-cbs-doc : call  [Besmit-28022022]
    //---  d:Hace llamadas a una api rest en formato JSON
    //---  p:url : url a la que se hace la llamada
    //---  p:method : metodo de la llamada
    //---  p:data : datos a enviar en la llamada
    //---  r:Promise con la respuesta de la llamada
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

    //-!-  Fun-cbs-doc : call  [Besmit-28022022]
    //---  d:Hace llamadas a una api rest en formato FormData
    //---  p:url : url a la que se hace la llamada
    //---  p:method : metodo de la llamada
    //---  p:data : datos a enviar en la llamada
    //---  r:Promise con la respuesta de la llamada
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

    //-!-  Fun-cbs-doc : getTextError  [Besmit-28022022]
    //---  d:Devuelve el texto de un error, cuando se hace una llamada a una api rest
    //---  p:response : respuesta de la llamada
    //---  p:customMessage : mensaje por defecto, cuando no se encuentra el error
    //---  r:texto del error
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