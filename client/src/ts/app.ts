//import styles
import "../scss/index.scss"
//iconify
import 'iconify-icon';

//main class
import Main from "./main";
import Exponent from "./handlers/Exponent";

document.addEventListener("DOMContentLoaded", () => {
    const main = new Main();
})

const a = new Exponent("3e1").parse()
const b = new Exponent("5e3").parse()

b.subtract(a)
console.log(b)
