import { addition, COLS, division, generateHtml, multiplication, ROWS, subtraction } from "./math.mjs"


// const rows = 3;
// const cols = 3;
const loops = 11;

for (let i = 1; i <= loops; i++) {

    // const problems = addition({
    //     primaryTerm: 10,
    //     rows,
    //     cols,
    //     randomOrder: true,
    //     min: 0,
    //     max: 10,
    //     oneThruFirst: true,
    //     // secondTerm: 5,
    //     print: true,
    // });

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

    // const problems = multiplication({
    //     primaryTerm: 10,
    //     rows,
    //     cols,
    //     randomOrder: false,
    //     min: 0,
    //     max: 10,
    //     oneThruFirst: true,
    //     secondTerm: 4,
    //     print: true,
    // });

    const problems = division({
        primaryTerm: 10,
        randomOrder: false,
        oneThruFirst: true,
        secondTerm: i,
        print: true,
    });

    generateHtml(problems, ROWS, COLS, i.toString(), false);
}