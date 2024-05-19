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

new Exponent("1551515115").parse()
