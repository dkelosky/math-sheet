import $ from "jquery";
import { everything } from "./math.mjs";
// window.$ = $;

console.log("fck this place")

// $.fn()
$(() => {

    $(`#fckingbutton`).on(`click`, () => {
        console.log(`you clicked the fcking button`)
        console.log(everything())
    });

});
