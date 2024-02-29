import $ from "jquery";

// window.$ = $;

console.log("fck this place")

// $.fn()
$(() => {

    $(`#fckingbutton`).on(`click`, () => {
        console.log(`you clicked the fcking button`)
    });

});
