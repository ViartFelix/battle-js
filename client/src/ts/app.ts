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

const a = new Exponent("5.556e3").parse()
const b = new Exponent("5.555e3").parse()


console.log(b.subtract(a))
