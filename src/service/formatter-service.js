

export const numberFormatter = (value) => {
    let ret = '';
    if (typeof (value) === 'number') {
        value = value.toString();
    }

    value = value.split("").reverse().join("");

    const numberOfComma = Math.floor(value.length / 3);

    if (numberOfComma === 1 && value.length === 3) {
        ret = value;
    } else if (numberOfComma > 0) {
        for (let i = 0; i < numberOfComma; i++) {
            ret = ret + value.slice(i * 3, 3 * (i + 1)) + ',';
            if (i + 1 === numberOfComma) {
                ret = ret + value.slice((i + 1) * 3, 3 * ((i + 1) + 1));
            }
        }
    } else {
        ret = value;
    }



    ret = ret.split("").reverse().join("");
    return ret;
}