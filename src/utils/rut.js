export function cleanRut(rut = '') {
return rut.replace(/\./g, '').replace(/-/g, '').trim().toUpperCase();
}


export function isValidRut(rut) {
const r = cleanRut(rut);
if (r.length < 2) return false;
const body = r.slice(0, -1);
let dv = r.slice(-1);
let sum = 0, mul = 2;
for (let i = body.length - 1; i >= 0; i--) {
sum += parseInt(body[i], 10) * mul;
mul = mul === 7 ? 2 : mul + 1;
}
const res = 11 - (sum % 11);
const dvCalc = res === 11 ? '0' : res === 10 ? 'K' : String(res);
return dv === dvCalc;
}