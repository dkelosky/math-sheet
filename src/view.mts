import $ from "jquery";
// import { everything } from "./math.mjs";
// window.$ = $;

console.log("this place")

// $.fn()
$(() => {

    $(`#mybutton`).on(`click`, () => {
        console.log(`you clicked the button`)
        // console.log(everything())
    });

});
