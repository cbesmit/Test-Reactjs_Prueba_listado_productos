import { Pagination } from 'react-bootstrap';

//-!-  Fun-cbs-doc : tableOrderBy  [Besmit-28022022]
//---  d: Recibe una lista de objetos y una key y ordena la lista por esa key
//---  p:key : campo a ordenar (es un string)
//---  p:orderBy : objeto con el campo actual para ordenar y el orden (orderBy{campo,order})
//---  p:listItems : lista de items a ordenar (el contenido de la tabla, es un array de objetos)
//---  r:Lista de objetos ya ordenados
function tableOrderBy(key, orderBy, listItems) {
    if (orderBy.campo != key) {
        orderBy.order = 'asc';
    } else {
        orderBy.order = orderBy.order == 'asc' ? 'desc' : 'asc';
    }
    orderBy.campo = key;
    var list = [...listItems];

    if (orderBy.order == 'asc') {
        try {
            list.sort((a, b) => (a[key].toLowerCase() > b[key].toLowerCase()) ? 1 : ((b[key].toLowerCase() > a[key].toLowerCase()) ? -1 : 0));
        } catch (e) {
            list.sort((a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
        }
    } else {
        try {
            list.sort((a, b) => (a[key].toLowerCase() < b[key].toLowerCase()) ? 1 : ((b[key].toLowerCase() < a[key].toLowerCase()) ? -1 : 0));
        } catch (e) {
            list.sort((a, b) => (a[key] < b[key]) ? 1 : ((b[key] < a[key]) ? -1 : 0));
        }
    }
    let listReturn = {
        orderBy: orderBy,
        list: list
    }
    return listReturn;
}

//-!-  Fun-cbs-doc : generatePagination  [Besmit-28022022]
//---  d: Genera la paginación de la lista recibida
//---  p:pag : número de pagina a la que se cambiará (es un número entero)
//---  p:listItems : lista de items a paginar (el contenido de la tabla, es un array de objetos)
//---  p:filters : lista de campos que se deben filtrar (es un array)     ['firstname', 'username', 'admin']
//---  p:searchListItems : texto a buscar en la lista, se puede filtrar la lista por un texto (es un string)
//---  p:itemsPerPage : número de items por página (es un número entero)
//---  p:onPaginar : función que se ejecutará al cambiar de página (es una función)
//---  r:Listado de la paginación

function generatePagination(pag, listItems, filters, searchListItems, itemsPerPage = 10, onPaginar) {
    let items = []
    var list = listItems.filter(function (itemForFilter) {
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
    })
    for (let index = 0; index < Math.ceil(list.length / itemsPerPage); index++) {
        items.push(
            <Pagination.Item key={index + 1} active={(index + 1) == pag} onClick={() => { onPaginar(index + 1) }}>
                {index + 1}
            </Pagination.Item>
        );
    }
    return items;
}

export {
    tableOrderBy,
    generatePagination
}