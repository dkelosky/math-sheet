import { writeFileSync } from "fs";

export function getRandomInt(max: number, min = -1) {
    let num = min - 1;
    while (num < min) {
        num = Math.floor(Math.random() * max + 1);
    }
    return num;
}

export function getDividend(divisibleBy: number, max: number, min: number) {
    let num = 1;
    while (num % divisibleBy !== 0) {
        num = getRandomInt(max, min);
    }
    return num;
}

interface IProblem {
    symbol: string;
}

interface IDivisionProblem extends IProblem {
    dividend: number;
    divisor: number;
    quotient: number;
}

export function division(divisor: number, divisorMaxFactor: number, min = divisor, rows = 10, cols = 10) {
    const maxDividend = divisor * divisorMaxFactor;
    const problems: IDivisionProblem[] = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const dividend = getDividend(divisor, maxDividend, min);
            const problem: IDivisionProblem = {
                dividend,
                divisor,
                quotient: dividend / divisor,
                symbol: `÷`,
            };
            problems.push(problem);
        }
    }

    generateHtml(problems, rows, cols);
}

export function leftPad(digit: number, padLen = 5, padChar = ` `) {
    let digitLen = digit.toString().length;
    if (digitLen > padLen) {
        console.log(`unexpected len`)
        process.exit(1);
    }
    const lenToPad = padLen - digitLen;
    let message = ``;
    for (let i = 0; i < lenToPad; i++) {
        message += padChar;
    }
    message += digit;
    return message;
}


export function generateHtml(problems: IDivisionProblem[], rows = 10, cols = 10) {
    const padLen = 5;
    const padChar = ` `;
    let pad = ``;
    for (let i = 0; i < padLen; i++) pad += padChar;

    const header =
        `<html>\n` +
        `<body>\n`;

    const tableHeader =
        `    <table>\n`;

    const rowHeader =
        `        <tr>\n`;

    const topDataHeader =
        `            <td><code><span style="white-space: pre;">`;

    const bottomDataHeader =
        `            <td><code><span style="text-decoration: underline; white-space: pre;">`;

    const emptyEntry =
        `            <td><code><span style="white-space: pre;">${pad}</span></td></code>\n`;

    const topDataFooter =
        `</span></td></code>\n`;

    const bottomDataFooter = topDataFooter;

    const rowFooter =
        `        </tr>\n`;

    const tableFooterer =
        `    </table>\n`;

    const footer =
        `</html>\n` +
        `</body>\n`;

    let htmlDocument = header + tableHeader;

    if (problems.length !== cols * rows) {
        console.log(`cols & rows must match number of problems`);
        process.exit(1);
    }

    for (let i = 0; i < rows; i++) {
        htmlDocument += rowHeader;
        let dividenRow = ``;
        let divisorRow = ``;
        let solutionRow = ``;
        for (let j = 0; j < cols; j++) {
            const index = i * j;
            dividenRow += topDataHeader + leftPad(problems[index].dividend) + topDataFooter;
            // console.log(dividenRow)
            // process.exit(3)
            if (j < cols - 1) dividenRow += emptyEntry;

            divisorRow += bottomDataHeader + problems[index].symbol + leftPad(problems[index].divisor, padLen - 1) + bottomDataFooter;
            if (j < cols - 1) divisorRow += emptyEntry;

            solutionRow += topDataHeader + pad + topDataFooter;
            if (j < cols - 1) solutionRow += emptyEntry;
        }
        htmlDocument += rowHeader + dividenRow + rowFooter;
        htmlDocument += rowHeader + divisorRow + rowFooter;
        htmlDocument += rowHeader + solutionRow + rowFooter;
    }

    htmlDocument += tableFooterer + footer;
    writeFileSync(`problems.html`, htmlDocument);

}

// dividend / divisor = quotient

export function everything() {

    const divisor = 3;
    const divisorMaxFactor = 12;
    const max_dividend = divisor * divisorMaxFactor;
    const rows = 10;
    const cols = 10;
    const spaces = `      `;
    const newLine = `\r\n`

    // get number <= max && >= min
    const dividends = [];

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            dividends.push(getDividend(divisor, max_dividend, 2));
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
