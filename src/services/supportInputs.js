    //-!-  Fun-cbs-doc : processPathInputChange  [Besmit-28012022]
    //---  d:Procesa la ruta para el cambio de los inputs, se aplica para los inputs controlables (es una función de uso general)
    //---  p:val : Valor del input
    //---  p:objDatToChange : Objeto donde se guardará el valor
    //---  p:positionsPath : ruta a donde debe guardar el valor dentro de objDatToChange, ejemplo: 'elem.elem.elem.elem' o permite elementos de array [0] (unidimencional) 'elem.elem[1].elem.elem[3]'
    //---  r:Objeto modificado donde se guardaro el valor
    function processPathForInputChange(val, objDatToChange, positionsPath) {
        let obDat = objDatToChange;
        positionsPath.forEach(function (pos, idx, array) {
            let idxPos = null;
            //si la posición es un array, se separa la cadena de la posición y el indice
            if (pos.indexOf('[') !== -1) {
                idxPos = pos.split('[');
                pos = idxPos[0];
                idxPos = idxPos[1].split(']');
                idxPos = idxPos[0];
            }

            if (idx < array.length - 1) {
                if (idxPos !== null) {
                    //es un array
                    if (obDat[pos] === undefined) {
                        obDat[pos] = [];
                        obDat[pos][idxPos] = {};
                    }
                    if (!Array.isArray(obDat[pos])) {
                        obDat[pos] = [];
                    }
                    if (obDat[pos][idxPos] === undefined) {
                        obDat[pos][idxPos] = {};
                    }
                    obDat = obDat[pos][idxPos];
                }
                else {
                    if (obDat[pos] === undefined) {
                        obDat[pos] = {};
                    }
                    obDat = obDat[pos];
                }
            }
            else {
                if (idxPos !== null) {
                    if (obDat[pos] === undefined) {
                        obDat[pos] = [];
                    }
                    if (!Array.isArray(obDat[pos])) {
                        obDat[pos] = [];
                    }
                    obDat[pos][idxPos] = val;
                } else {
                    obDat[pos] = val;
                }
            }
        });
        return objDatToChange;
    }

        //-!-  Fun-cbs-doc : valueForInput  [Besmit-28012022]
    //---  d:Sirve para el parametro value de los inputs, verifica que exista el valor y lo retorna, si no existe retorna un string vacio
    //---  p:path : ruta a donde debe buscar el valor, se separa por '.', es un string y debe ser la ruta a la propiedad, ejemplo: 'elem.elem.elem.elem' o permite elementos de array [0] (unidimencional) 'elem.elem[1].elem.elem[3]'
    //---  p:objToExplore : objeto donde se buscará el valor
    //---  r:valor de la ruta en el objeto a exporar o cadena vacia ''

    function valueForInput(path, objToExplore) {
        let positionsPath = path.split('.');
        let obDat = objToExplore;
        let valToReturn = '';
        try {
            positionsPath.forEach(function (pos, idx, array) {
                let idxPos = null;
                //si la posición es un array, se separa la cadena de la posición y el indice
                if (pos.indexOf('[') !== -1) {
                    idxPos = pos.split('[');
                    pos = idxPos[0];
                    idxPos = idxPos[1].split(']');
                    idxPos = idxPos[0];
                }
                if (obDat[pos] === undefined) {
                    throw 'Valor [' + pos + '] undefined';
                }
                if (idxPos !== null) {
                    if (obDat[pos][idxPos] === undefined) {
                        throw 'Valor [' + pos + '] con indice [' + idxPos + '] undefined';
                    }
                    else {
                        obDat = obDat[pos][idxPos];
                    }
                }
                else {
                    obDat = obDat[pos];
                }
            });
            valToReturn = obDat;
        } catch (e) {
            valToReturn = '';
            //console.log(e);
        }
        return valToReturn
    }

    export {
        processPathForInputChange,
        valueForInput
    }