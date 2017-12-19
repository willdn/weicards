
var basePrice = 1.28
var arrayPrice = []

for(i = 1; i <= 127; i++) {
  var price = basePrice - (0.01 * i)
  arrayPrice.push(price)
}

console.log(arrayPrice)
var total = arrayPrice.reduce((acc, val) => { return acc + val }, 0)
console.log(total)