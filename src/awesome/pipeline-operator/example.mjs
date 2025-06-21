//const chalk = require('chalk');
import chalk from 'chalk';

//console.log(chalk);
let value = 1;

function one(x) {
    return x + 1;
}
function two(x) {
    return x * 2;
}
function three(x) {
    return x ** 2;
}
// Status quo
console.log(
    value |> one(^^) |> two(^^) |> three(^^) // 16 == ((1 + 1) * 2) ** 2
); 

// 