import { addition, division, generateHtml, multiplication, subtraction } from "./math.mjs"

const rows = 3;
const cols = 3;
const loops = 1;

for (let i = 1; i <= loops; i++) {

    const problems = addition({
        primaryTerm: 10,
        rows,
        cols,
        randomOrder: true,
        min: 0,
        max: 10,
        oneThruFirst: true,
        // secondTerm: 5,
        print: true,
    });

    // const problems = subtraction({
    //     primaryTerm: 10,
    //     rows,
    //     cols,
    //     randomOrder: false,
    //     min: 0,
    //     max: 10,
    //     oneThruFirst: true,
    //     secondTerm: i,
    //     print: true,
    // });

    // generateHtml(problems, rows, cols, i.toString(), false);
}