import './productos.css';
import React, { useState, useEffect } from 'react';

import { Form, FloatingLabel, Row, Button, Spinner, Col, Toast, Badge } from 'react-bootstrap';
import fetchServer from '../../services/calls/fetchServer';
import { processPathForInputChange, valueForInput } from '../../services/supportInputs';
import { isSetNoEmpty, isNoSetOrEmpty } from '../../services/general';

function DetalleProducto(props) {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState({
        title: '',
        body: '',
        variant: 'success'
    });

    const [dataForm, setDataForm] = useState({});

    function onChangeData(val, path = '') {
        let objDatToChange = (path === '') ? val : processPathForInputChange(val, JSON.parse(JSON.stringify(dataForm)), path.split('.'));
        setDataForm(objDatToChange);
    };

    async function getData() {
        setLoading(true);
        await fetchServer.call('products/' + props.productID, 'GET').then(data => {
            if (!data.ok) throw new Error(fetchServer.getTextError(data, 'Error al obtener el dato'));
            setDataForm(data.data);
        }).catch(error => {
            let msgError = (error.message && error.message != '') ? error.message : (error.constructor === Object && Object.keys(error).length !== 0) ? JSON.stringify(error) : error;
            let datError = {
                title: "Error",
                body: msgError,
                variant: "warning"
            };
            setToastMsg(datError);
            setShowToast(true);
        });
        setLoading(false);
    }

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