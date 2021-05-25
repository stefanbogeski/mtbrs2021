export const customRound = (arg, pos) => {
    var divider = 1;
    for (var i = 0; i < pos; i++) {
        divider *= 10;
    }

    var result = arg * divider;
    result = Math.round(result) / divider;
    return result;
}