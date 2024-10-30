import { addition, COLS, division, generateHtml, mixed, multiplication, ROWS, subtraction } from "./math.mjs"


// const rows = 3;
// const cols = 3;
const loops = 5;

for (let i = 1; i <= loops; i++) {

    // const problems = addition({
    //     primaryTerm: 10,
    //     rows,
    //     cols,
    //     randomOrder: true,
    //     min: 0,
    //     max: 10,
    //     primaryMinThruMax: true,
    //     // secondTerm: 5,
    //     print: true,
    // });

    const problems = mixed({
        primaryTerm: 10,
        rows: 10,
        cols: 10,
        randomOrder: false,
        min: 0,
        max: 10,
        primaryMinThruMax: true,
        // secondTerm: i,
        print: true,
    });

    // const problems = multiplication({
    //     primaryTerm: 10,
    //     rows,
    //     cols,
    //     randomOrder: false,
    //     min: 0,
    //     max: 10,
    //     primaryMinThruMax: true,
    //     secondTerm: 4,
    //     print: true,
    // });

    // const problems = division({
    //     primaryTerm: 10,
    //     randomOrder: false,
    //     primaryMinThruMax: true,
    //     secondTerm: i,
    //     print: true,
    // });

    generateHtml(problems, ROWS, COLS, i.toString(), false);
}