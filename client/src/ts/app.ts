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

const a = new Exponent(50).parse()
const b = new Exponent(6).parse()

console.log(a.divide(b))
