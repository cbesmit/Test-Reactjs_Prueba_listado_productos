    function isSetNoEmpty(val) {
        if (val === undefined) return false;
        if (val === null) return false;
        if (val === '') return false;
        if (val.length === 0) return false;
        if (val.constructor === Object && Object.keys(val).length === 0) return false;
        return true;
    }

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