export function everything() {

    const divisor = 3;
    const divisor_factor = 12;
    const max_dividend = divisor * divisor_factor;
    const rows = 10;
    const cols = 10;
    const spaces = `      `;
    const newLine = `\r\n`

    // get number <= max && >= min
    function getRandomInt(max: number, min = -1) {
        let num = min - 1;
        while (num < min) {
            num = Math.floor(Math.random() * max + 1);
        }
        return num;
    }

    function getDivisor(divisibleBy: number, max: number, min: number) {
        let num = 1;
        while (num % divisibleBy !== 0) {
            num = getRandomInt(max, min);
        }
        return num;
    }

    const dividends = [];

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            dividends.push(getDivisor(divisor, max_dividend, 2));
        }
    }

    let colCounter = 0;
    let line = '';
    let doc = ``;
    dividends.forEach((dividend) => {
        colCounter++;
        let digits = dividend.toString().length;

        switch (digits) {
            case 1:
                line += `   ` + dividend;
                break;
            case 2:
                line += `  ` + dividend;
                break;
            case 3:
                line += ` ` + dividend;
                break;
            default:
                break;
        }

        line += spaces;
        if (colCounter === cols) {
            line = line.trimEnd() + newLine
            doc += line;
            doc += addDivisorNextLine();
            doc += addBlankLine();
            doc += addSpaceline();
            // reset
            line = ``;
            colCounter = 0;
        }
    })

    function addDivisorNextLine() {

        let line = ``;
        // console.log(divisor)
        for (let i = 0; i < cols; i++) {
            line += `÷  ${divisor.toString()}${spaces}`;
        }
        line = line.trimEnd() + newLine;
        // console.log(line)
        return line;
    };

    function addBlankLine() {
        let line = ``;
        for (let i = 0; i < cols; i++) {
            line += `----${spaces}`;
        }
        line = line.trimEnd() + newLine;
        return line;
    }

    function addSpaceline() {
        let line = ``;
        // for (let i = 0; i < cols; i++) {
        // line += `   ${spaces}`;
        // }
        line += newLine;
        // for (let i = 0; i < cols; i++) {
        // line += `   ${spaces}`;
        // }
        line += newLine;
        // for (let i = 0; i < cols; i++) {
        // line += `   ${spaces}`;
        // }
        // line += newLine;
        return line;
    }

    console.log(doc);
}



// const line = [];

// for (let i = 0; i < cols; i++) {
//     for (let j = 0; j < rows; j++) {
//        push(getRandomInt(40, 2));
//     }
// }
