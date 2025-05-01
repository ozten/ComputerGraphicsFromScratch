export function interpolate(i0: number, d0: number, i1: number, d1: number): number[] {
    if (i0 == i1) {
        return [ d0 ];
    }
    var values = [];
    var a = (d1 - d0) / (i1 - i0);
    var d = d0;
    // TODO: < or <=
    for (var i=i0; i <= i1; i++) {
        values.push(d);
        d = d + a;
    }
    console.log('values', values);
    return values;
}