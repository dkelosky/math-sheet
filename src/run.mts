import { addition, division, generateHtml, multiplication, subtraction } from "./math.mjs"

// addition(10, 0, 10, 10, 10, true)
// division(5, 5, 5*12, 3, 3)
// subtrahend: number, sheetCount = 1, min = subtrahend, max = subtrahend * 12, rows = 10, cols = 10, oneThruFirst = false

for (let i = 1; i < 11; i++) {
    const rows = 10;
    const cols = 10;
    const problems = subtraction(10, i, 20, rows, cols, true, i);
    generateHtml(problems, rows, cols, i.toString(), false);
}