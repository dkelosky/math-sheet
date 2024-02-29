import { writeFileSync } from "fs";

interface IProblem {
    symbol: string;
}

interface IDivisionProblem extends IProblem {
    dividend: number;
    divisor: number;
    quotient: number;
}

export function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max + 1);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export function getDividend(divisibleBy: number, min: number, max: number) {
    let num = getRandomInt(min, max);
    while (num % divisibleBy !== 0) {
        num = getRandomInt(min, max);
    }
    return num;
}

/**
 * dividend ÷ divisor = quotient
 * @param divisor - the divisor
 * @param divisorMaxFactor - dividend = divisor * divisorMaxFactor
 * @param min - min dividend, usually the same as divisor
 * @param rows - number of rows in output
 * @param cols - number of cols in output
 */
export function division(divisor: number, divisorMaxFactor: number, min = divisor, rows = 10, cols = 10) {
    const maxDividend = divisor * divisorMaxFactor;
    const problems: IDivisionProblem[] = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let dividend = getDividend(divisor, min, maxDividend);
            if (problems.length > 0) { // if at least 1 entry in array exists
                while (problems[problems.length - 1].dividend === dividend) { // while dividend is the same as the previous
                    dividend = getDividend(divisor, min, maxDividend); // prevent adjacent dups
                }
            }
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
        `<body>\n` +
        `<br>\n` +
        `<br>\n` +
        `<br>\n` +
        `<br>\n` +
        `<br>\n`
        ;

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

    let dividendRow = ``;
    let divisorRow = ``;
    let solutionRow = ``;
    problems.forEach((problem, index) => {
        // htmlDocument += rowHeader;

        let i = index + 1;

        dividendRow += topDataHeader + leftPad(problem.dividend) + topDataFooter;
        divisorRow += bottomDataHeader + problem.symbol + leftPad(problem.divisor, padLen - 1) + bottomDataFooter;
        solutionRow += topDataHeader + pad + topDataFooter;

        if (i % cols === 0) {
            htmlDocument += rowHeader + dividendRow + rowFooter;
            htmlDocument += rowHeader + divisorRow + rowFooter;
            htmlDocument += rowHeader + solutionRow + rowFooter;
            htmlDocument += rowHeader + solutionRow + rowFooter;
            dividendRow = ``;
            divisorRow = ``;
            solutionRow = ``;
        } else {
            dividendRow += emptyEntry;
            divisorRow += emptyEntry;
            solutionRow += emptyEntry;
        }

    });

    htmlDocument += tableFooterer + footer;
    writeFileSync(`problems.html`, htmlDocument);
    console.log(`wrote problems.html`);
}
