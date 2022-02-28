//-!-  Fun-cbs-doc : isSetNoEmpty  [Besmit-28022022]
//---  d:Sirve para verificar si un valor esta seteado y no vacio
//---  p:val : valor a verificar
//---  r:true si esta seteado y no vacio, false si no
function isSetNoEmpty(val) {
        if (val === undefined) return false;
        if (val === null) return false;
        if (val === '') return false;
        if (val.length === 0) return false;
        if (val.constructor === Object && Object.keys(val).length === 0) return false;
        return true;
    }

    //-!-  Fun-cbs-doc : isNoSetOrEmpty  [Besmit-28022022]
    //---  d:Sirve para verificar si un valor esta no seteado o vacio
    //---  p:val : valor a verificar
    //---  r:true si esta no seteado o vacio, false si no
    function isNoSetOrEmpty(val) {
        if (val === undefined) return true;
        if (val === null) return true;
        if (val === '') return true;
        if (val.length === 0) return true;
        if (val.constructor === Object && Object.keys(val).length === 0) return true;
        return false;
    }

    export {
        isSetNoEmpty,
        isNoSetOrEmpty
    }