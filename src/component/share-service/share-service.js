

export const checkLeftYear = (year) => {
    let ret = false;
    if ((!(year % 4) && year % 100) || !(year % 400)) {
        ret = true;
    }
    return ret;
}