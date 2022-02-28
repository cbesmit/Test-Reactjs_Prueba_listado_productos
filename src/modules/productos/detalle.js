import './productos.css';
import React, { useState, useEffect } from 'react';

import { Form, Row, Button, Spinner, Col, Toast, Badge } from 'react-bootstrap';
import fetchServer from '../../services/calls/fetchServer';
import { processPathForInputChange, valueForInput } from '../../services/supportInputs';
import { isSetNoEmpty } from '../../services/general';

function DetalleProducto(props) {
    //-!-  Comm-cbs-doc : Para mostrar la vista de carga y el error en llamadas fetch  [Besmit-28022022]
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState({
        title: '',
        body: '',
        variant: 'success'
    });
    //-!-  Comm-cbs-doc : Contendrá toda la información del producto una vez se obtenga de la api  [Besmit-28022022]
    const [dataForm, setDataForm] = useState({});
    //-!-  Fun-cbs-doc : onChangeData  [Besmit-28022022]
    //---  d:Sirve para el manejo de los cambios en los inputs, se aplica para los inputs controlables (es una función de uso general)
    //---  p:val : Valor del input
    //---  p:path : ruta a donde debe guardar el valor dentro de dataForm, ejemplo: 'elem.elem.elem.elem' o permite elementos de array [0] (unidimencional) 'elem.elem[1].elem.elem[3]'    
    function onChangeData(val, path = '') {
        let objDatToChange = (path === '') ? val : processPathForInputChange(val, JSON.parse(JSON.stringify(dataForm)), path.split('.'));
        setDataForm(objDatToChange);
    };

    //-!-  Fun-cbs-doc : getData  [Besmit-28022022]
    //---  d:Sirve para obtener la información del producto de la api
    async function getData() {
        //-!-  Comm-cbs-doc : Se activa la vista de 'Cargando'  [Besmit-28022022]
        setLoading(true);
        //-!-  Comm-cbs-doc : Se hace la llamada Fetch para obtener el listado de productos  [Besmit-28022022]
        await fetchServer.call('products/' + props.productID, 'GET').then(data => {
            //-!-  Comm-cbs-doc : Se verifica que no halla dado error fetch, en caso de hacerlo arroja una excepción  [Besmit-28022022]
            if (!data.ok) throw new Error(fetchServer.getTextError(data, 'Error al obtener el dato'));
            //-!-  Comm-cbs-doc : Se establece la información del usuario con lo obtenido de fetch  [Besmit-28022022]
            setDataForm(data.data);
        }).catch(error => {
            //-!-  Comm-cbs-doc : Se activa la vista de 'Error'  [Besmit-28022022]
            let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
            let datError = {
                title: "Error",
                body: msgError,
                variant: "warning"
            };
            setToastMsg(datError);
            setShowToast(true);
        });
        //-!-  Comm-cbs-doc : Se desactiva la vista de 'Cargando'  [Besmit-28022022]
        setLoading(false);
    }

    //-!-  Comm-cbs-doc : Se ejecuta una sola vez, verifica que exista productID y en caso positivo obtiene la inormación del producto  [Besmit-28022022]
    useEffect(async () => {
        if (isSetNoEmpty(props.productID)) await getData();
    }, []);

    return (
        <>
            <div className="loading-full-screen" style={{ display: (loading) ? 'block' : 'none' }}>
                <Spinner animation="border" />
            </div>
            <Toast className='bes-toast' onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMsg.variant}>
                <Toast.Header>
                    <strong className="me-auto">{toastMsg.title}</strong>
                </Toast.Header>
                <Toast.Body>{toastMsg.body}</Toast.Body>
            </Toast>

            <Row>
                <Col xs={12} md={4}>
                    <div className='detail-product-list-img' style={{ backgroundImage: 'url(' + valueForInput('image', dataForm) + ')' }}></div>
                </Col>
                <Col xs={12} md={8}>
                    <div className="small-ratings">
                        <Badge bg="secondary">{valueForInput('category', dataForm)}</Badge> {' '}
                        <i className={(Math.round(valueForInput('rating.rate', dataForm)) >= 1) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                        <i className={(Math.round(valueForInput('rating.rate', dataForm)) >= 2) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                        <i className={(Math.round(valueForInput('rating.rate', dataForm)) >= 3) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                        <i className={(Math.round(valueForInput('rating.rate', dataForm)) >= 4) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                        <i className={(Math.round(valueForInput('rating.rate', dataForm)) >= 5) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                        <span className='rating-count'>({valueForInput('rating.count', dataForm)})</span>
                    </div>
                    <div className='detail-product-price'>$ {valueForInput('price', dataForm)}</div>
                    <div className='detail-product-description'>{valueForInput('description', dataForm)}</div>
                    <Row className='detail-product-add-carrito'>
                        <Col xs={12} md={5}>
                            <Form >
                                <Form.Group className="mb-3">
                                    <Form.Control type="number" placeholder="Cantidad" value={valueForInput('cantidad', dataForm)} onChange={e => onChangeData(e.target.value, 'cantidad')} />
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col xs={12} md={7}>
                            <div style={{ textAlign: 'right' }}>
                                <Button variant="dark" onClick={() => { }}> Añadir al carrito </Button>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </>
    );
}

export default DetalleProducto;