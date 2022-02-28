import './productos.css';
import React, { useState, useEffect } from 'react';
import fetchServer from '../../services/calls/fetchServer';
import { tableOrderBy, generatePagination } from '../../services/orderAndPagination';

import DetalleProducto from './detalle';

import { Row, Card, Badge, Col, Form, DropdownButton } from 'react-bootstrap';
import { Navbar, Container, Dropdown, Modal, Spinner, Pagination, Toast } from 'react-bootstrap';

function ListadoProductos(props) {

    //-!-  Comm-cbs-doc : Se usan para mostrar el modal del detalle del producto  [Besmit-28022022]
    const [showDetail, setShowDetail] = useState(false);
    const handleCloseNew = (reload) => { setShowDetail(false); if (reload) { setListItems([]); getList(); } };
    //-!-  Comm-cbs-doc : Para mostrar la vista de carga y el error en llamadas fetch  [Besmit-28022022]
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMsg, setToastMsg] = useState({
        title: '',
        body: '',
        variant: 'success'
    });
    //-!-  Comm-cbs-doc : Se usa para el ordenamiento y la paginación  [Besmit-28022022]
    const [orderBy, setOrderBy] = useState({
        campo: '',
        order: 'asc'
    });
    const [itemsPagination, setItemsPagination] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(12);
    const [pagina, setPagina] = useState(1);
    //-!-  Comm-cbs-doc : Se usa para el listado de productos  [Besmit-28022022]
    const [listItems, setListItems] = useState([]);
    //-!-  Comm-cbs-doc : Se usa para cuando se selecciona un producto se le pase por referencia el identificador al modal  [Besmit-28022022]
    const [itemID, setItemID] = useState('');
    const [nameProduct, setNameProduct] = useState('');
    //-!-  Comm-cbs-doc : Es la cadena que se usa para la busqueda de productos en el listado  [Besmit-28022022]
    const [searchListItems, setSearchListItems] = useState('');

    //-!-  Fun-cbs-doc : onEditar  [Besmit-28022022]
    //---  d:Función que se dispara al seleccionar un producto, abre el modal para ver el detalle
    //---  p:id : identificador del producto
    function onEditar(id) {
        let oFound = listItems.find(item => item.id === id);
        setNameProduct(oFound.title);
        setItemID(id);
        setShowDetail(true);
    }

    //-!-  Fun-cbs-doc : getList  [Besmit-28022022]
    //---  d:Obtiene la lista de productos
    async function getList() {
        //-!-  Comm-cbs-doc : Se activa la vista de 'Cargando'  [Besmit-28022022]
        setLoading(true);
        //-!-  Comm-cbs-doc : Se hace la llamada Fetch para obtener el listado de productos  [Besmit-28022022]
        await fetchServer.call('products', 'GET').then(data => {
            //-!-  Comm-cbs-doc : Se verifica que no halla dado error fetch, en caso de hacerlo arroja una excepción  [Besmit-28022022]
            if (!data.ok) throw new Error(fetchServer.getTextError(data, 'Error al listar'));
            //-!-  Comm-cbs-doc : Se establece la página inicial (paginación), el ordenamiento y se coloca el listado  [Besmit-28022022]                
            setPagina(1);
            setOrderBy({ campo: '', order: 'asc' });
            setListItems(data.data);
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

    //-!-  Fun-cbs-doc : onOrderBy  [Besmit-28022022]
    //---  d:Función que se dispara al seleccionar el ordenamiento por nombre o por precio
    //---  p:key : nombre del parametro por el cual ordenar    
    function onOrderBy(key) {
        let listReturn = tableOrderBy(key, orderBy, listItems);
        setOrderBy(listReturn.orderBy);
        setListItems(listReturn.list);
    }

    //-!-  Fun-cbs-doc : onGeneratePagination  [Besmit-28022022]
    //---  d:Función que se dispara cuando se actualiza el listado, esto es para que genere el nuevo paginado
    //---  p:pag : número de página actual
    function onGeneratePagination(pag) {
        let filters = ['title', 'category'];
        let items = generatePagination(pag, listItems, filters, searchListItems, itemsPerPage, onPaginar);
        setItemsPagination(items);
    }

    //-!-  Fun-cbs-doc : onPagina  [Besmit-28022022]
    //---  d:Función que se dispara al seleccionar una página del paginado
    //---  p:val : Número de página seleccionada    
    function onPaginar(val) {
        setPagina(val);
        onGeneratePagination(val);
    }

    //-!-  Comm-cbs-doc : Se ejecuta una sola vez al cargar el componente y obtiene el listado de productos  [Besmit-28022022]
    useEffect(async () => {
        await getList();
    }, []);

    //-!-  Comm-cbs-doc : Se ejecuta cada que se actualiza el listado de productos, y lo que hace es llamar a la función para generar el paginado  [Besmit-28022022]
    useEffect(async () => {
        onGeneratePagination(pagina);
    }, [listItems]);

    //-!-  Comm-cbs-doc : Se ejecuta cada que se escribe en el input de 'Buscar' esto lo hace para actualizar el páginado, ya que la lista se puede reducir por el texto de busqueda puesto  [Besmit-28022022]
    useEffect(async () => {
        onPaginar(1);
    }, [searchListItems]);

    return (
        <div>
            <div className="loading-full-screen" style={{ display: (loading) ? 'block' : 'none' }}>
                <Spinner animation="border" />
            </div>
            <Toast className='bes-toast' onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMsg.variant}>
                <Toast.Header>
                    <strong className="me-auto">{toastMsg.title}</strong>
                </Toast.Header>
                <Toast.Body>{toastMsg.body}</Toast.Body>
            </Toast>


            <div className="dashboard-content">
                <Card>
                    <Card.Body>
                        <Card.Title>

                            <Navbar bg="light" expand="lg">
                                <Container>
                                    <Navbar.Brand onClick={getList} style={{ cursor: 'pointer' }}>
                                        Listado de Productos ⟳
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                                    <Navbar.Collapse className="justify-content-end">
                                        <Navbar.Text>
                                            <Form.Control className="me-auto" placeholder="Buscar" onChange={e => setSearchListItems(e.target.value)} /> {''}
                                        </Navbar.Text>
                                    </Navbar.Collapse>
                                    <Navbar.Collapse className="justify-content-end">
                                        <Navbar.Text>

                                            <DropdownButton title="Ordenar" variant="secondary">
                                                <Dropdown.Item onClick={() => { onOrderBy('title') }}>Nombre {(orderBy.campo == 'title') ? ((orderBy.order == 'asc') ? '🡩' : '🡣') : ''}</Dropdown.Item>
                                                <Dropdown.Item onClick={() => { onOrderBy('price') }}>Precio {(orderBy.campo == 'price') ? ((orderBy.order == 'asc') ? '🡩' : '🡣') : ''}</Dropdown.Item>
                                            </DropdownButton>

                                        </Navbar.Text>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>

                        </Card.Title>


                        <Row xs={1} md={4} className="g-4">
                            {listItems.filter(function (itemForFilter) {
                                //-!-  Comm-cbs-doc : En esta parte se hace el filtrado de los parametros de title y category del listado de productos [Besmit-28022022]                                
                                let filters = ['title', 'category'];
                                if (searchListItems != '') {
                                    let validItem = false;
                                    Object.keys(itemForFilter).forEach(function (keyFilter) {
                                        let found = filters.find(function (element) {
                                            return element == keyFilter;
                                        });
                                        if (found && itemForFilter[keyFilter].toString().toLowerCase().indexOf(searchListItems.toLowerCase()) != -1) {
                                            validItem = true;
                                        }
                                    });
                                    return validItem;
                                }
                                return true;
                            }).slice(((pagina - 1) * itemsPerPage), ((pagina - 1) * itemsPerPage) + itemsPerPage).map(function (item, idx) {
                                return (<Col key={idx}>
                                    <Card className='container-product-list' onClick={() => { onEditar(item.id) }}>
                                        <div className='container-product-list-img' style={{ backgroundImage: 'url(' + item.image + ')' }}>
                                            <div className='container-product-list-price'>$ {item.price}</div>
                                        </div>
                                        <Card.Body>
                                            <Card.Title>{item.title} </Card.Title>
                                            <Badge bg="secondary">{item.category}</Badge>
                                            <div className="small-ratings">
                                                <i className={(Math.round(item.rating.rate) >= 1) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                                                <i className={(Math.round(item.rating.rate) >= 2) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                                                <i className={(Math.round(item.rating.rate) >= 3) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                                                <i className={(Math.round(item.rating.rate) >= 4) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                                                <i className={(Math.round(item.rating.rate) >= 5) ? 'fa fa-star rating-color' : 'fa fa-star'}></i>
                                                <span className='rating-count'>({item.rating.count})</span>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                )
                            })}
                        </Row>


                    </Card.Body>
                    <Card.Footer>
                        <Pagination>
                            {itemsPagination}
                        </Pagination>
                    </Card.Footer>
                </Card>
            </div>

            <Modal
                show={showDetail}
                onHide={handleCloseNew}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{nameProduct}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DetalleProducto productID={itemID} />
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default ListadoProductos;