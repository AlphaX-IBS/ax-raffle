export function negativePowerOfTen(number = "0", power = 0) {
  const offset = number.length - Math.abs(power);
  let result = number;
  if (offset > 0) {
    const tmp = number.substring(offset - 1, offset);
    result = tmp.concat(".", number.substring(offset, number.length));
  } else {
    const missing = "0".repeat(Math.abs(offset));
    result = "0.".concat(missing, number);
  }

  let marker = result.length;
  for (let i = 0; i < result.length; i++) {
    const nth = result.length - i - 1;
    const digit = result[nth];
    if (digit === ".") {
      marker = nth;
      break;
    } else if (digit === "0") {
      marker = nth;
    } else {
      break;
    }
  }

  return result.substring(0, marker);
}
