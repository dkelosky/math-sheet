import { writeFileSync } from "fs";

type operation = `addition` | `subtraction` | `multiplication` | `division`;
type answer = ((first: number, second: number) => number);

interface IProblem {
    symbol: string;
    firstTerm: number;
    secondTerm: number;
    answer: number;
    type: operation;

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

export interface ITerms {
    firstTerm: number;
    secondTerm: number;
}

export function randomizeOrder(primaryTerm: number, extraTerm: number): ITerms {
    let choice = getRandomInt(0, 1);

    // assume 0
    let terms: ITerms = {
        firstTerm: primaryTerm,
        secondTerm: extraTerm,
    };

    // flip if odd value
    if (choice === 1) {
        terms.firstTerm = extraTerm;
        terms.secondTerm = primaryTerm;
    }

    return terms;

}

/**
 * term x term = product
 * @param primaryTerm e.g. testing x 3, 3 would be in each problem
 * @param min - min number, usually 0
 * @param max - max number - usually 12 (unless x 11, then it's 19)
 * @param rows - output rows
 * @param cols - output cols
 */
export function multiplication(primaryTerm: number, min = 0, max = 12, rows = 10, cols = 10) {
    mathCommon(`x`, `multiplication`, ((first, second) => first * second), primaryTerm, min, max, rows, cols);
}

export function addition(primaryTerm: number, min = 0, max = 12, rows = 10, cols = 10) {
    mathCommon(`+`, `addition`, ((first, second) => first + second), primaryTerm, min, max, rows, cols);
}

function mathCommon(symbol: string, type: operation, answer: answer, primaryTerm: number, min = 0, max = 12, rows = 10, cols = 10) {
    const problems: IProblem[] = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let extraTerm = getRandomInt(min, max);
            let terms: ITerms = randomizeOrder(primaryTerm, extraTerm);
            let firstTerm = terms.firstTerm;
            let secondTerm = terms.secondTerm;

            if (problems.length > 0) { // if at least 1 entry in array exists
                while (problems[problems.length - 1].firstTerm === firstTerm &&
                    problems[problems.length - 1].secondTerm === secondTerm) { // while problem is the same as the previous
                    extraTerm = getRandomInt(min, max);
                    terms = randomizeOrder(primaryTerm, extraTerm);
                    firstTerm = terms.firstTerm;
                    secondTerm = terms.secondTerm;
                }
            }

            const problem: IProblem = {
                firstTerm,
                secondTerm,
                answer: answer(firstTerm, secondTerm),
                symbol,
                type,
            };
            problems.push(problem);
        }
    }

    generateHtml(problems, rows, cols);
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
    const problems: IProblem[] = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let dividend = getDividend(divisor, min, maxDividend);
            if (problems.length > 0) { // if at least 1 entry in array exists
                while (problems[problems.length - 1].firstTerm === dividend) { // while dividend is the same as the previous
                    dividend = getDividend(divisor, min, maxDividend); // prevent adjacent dups
                }
            }
            const problem: IProblem = {
                firstTerm: dividend,
                secondTerm: divisor,
                answer: dividend / divisor,
                symbol: `÷`,
                type: `division`
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

export function generateHtml(problems: IProblem[], rows = 10, cols = 10) {
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

    const tableFooter =
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

        dividendRow += topDataHeader + leftPad(problem.firstTerm) + topDataFooter;
        divisorRow += bottomDataHeader + problem.symbol + leftPad(problem.secondTerm, padLen - 1) + bottomDataFooter;
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

    htmlDocument += tableFooter + footer;
    writeFileSync(`problems.html`, htmlDocument);
    console.log(`wrote problems.html`);
}
