import { writeFileSync } from "fs";

type operation = `addition` | `subtraction` | `multiplication` | `division`;
type answer = ((first: number, second: number) => number);

const PAD_LEN = 4;

interface IProblem {
    symbol: string;
    firstTerm: number;
    secondTerm: number;
    answer: number;
    type: operation;
}

interface ITerms {
    firstTerm: number;
    secondTerm: number;
}

function getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max + 1);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getDividend(divisibleBy: number, min: number, max: number) {
    let num = getRandomInt(min, max);
    while (num % divisibleBy !== 0) {
        num = getRandomInt(min, max);
    }
    return num;
}

function randomizeOrder(extraTerm: number, primaryTerm: number): ITerms {
    let choice = getRandomInt(0, 1);

    let terms: ITerms = { // assume 0
        firstTerm: extraTerm,
        secondTerm: primaryTerm,
    };

    if (choice === 1) { // flip if odd
        terms.firstTerm = primaryTerm;
        terms.secondTerm = extraTerm;
    }

    return terms;

}

/**
 * addend + addend = sum
 * @param primaryTerm
 * @param sheetCount
 * @param includeAnswer
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function addition(addend: number, sheetCount = 1, includeAnswer = false, min = 0, max = 12, rows = 10, cols = 10, oneThruFirst = false) {
    const options = {
        sheetCount,
        includeAnswer,
        min,
        max,
        rows,
        cols,
        oneThruFirst,
    };
    mathCommon(`+`, `addition`, ((first, second) => first + second), addend, options);
}

/**
 * multiplicand * multiplier = product
 * @param multiplier
 * @param sheetCount
 * @param includeAnswer
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function multiplication(multiplier: number, sheetCount = 1, includeAnswer = false, min = 0, max = 12, rows = 10, cols = 10) {
    const options = {
        sheetCount,
        includeAnswer,
        min,
        max,
        rows,
        cols,
    };
    mathCommon(`x`, `multiplication`, ((first, second) => first * second), multiplier, options);
}

/**
 * subtrahend - minuend = difference
 * @param subtrahend
 * @param sheetCount
 * @param includeAnswer
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function subtraction(subtrahend: number, sheetCount = 1, includeAnswer = false, min = subtrahend, max = subtrahend * 12, rows = 10, cols = 10) {
    const options = {
        sheetCount,
        includeAnswer,
        min,
        max,
        rows,
        cols,
        randomOrder: false,
    };
    mathCommon(`-`, `subtraction`, ((first, second) => first - second), subtrahend, options);
}

/**
 * dividend - divisor = quotient
 * @param divisor
 * @param sheetCount
 * @param includeAnswer
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function division(divisor: number, sheetCount = 1, includeAnswer = false, min = divisor, max = divisor * 12, rows = 10, cols = 10) {
    const options = {
        sheetCount,
        includeAnswer,
        min,
        max,
        rows,
        cols,
        randomOrder: false,
    };
    mathCommon(`÷`, `division`, ((first, second) => first / second), divisor, options);
}

interface options {
    min: number;
    max: number;
    rows: number;
    cols: number;
    randomOrder?: boolean;
    sheetCount?: number;
    includeAnswer?: boolean;
    oneThruFirst?: boolean;
}

function mathCommon(symbol: string, type: operation, answer: answer, primaryTerm: number, options: options) {
    // function mathCommon(symbol: string, type: operation, randomOrder = true, answer: answer, primaryTerm: number, min = 0, max = 12, rows = 10, cols = 10) {

    const min = options.min;
    const max = options.max;
    const rows = options.rows;
    const cols = options.cols;
    const randomOrder = options.randomOrder ?? true;
    const sheetCount = options.sheetCount ?? 1;
    const includeAnswer = options.includeAnswer ?? false;
    const oneThruFirst = options.oneThruFirst ?? false;

    for (let index = 0; index < sheetCount; index++) {

        const problems: IProblem[] = [];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let altTerm = oneThruFirst ? getRandomInt(min, max) : primaryTerm;
                let extraTerm = type === `division` ? getDividend(primaryTerm, min, max) : getRandomInt(min, max);
                let terms: ITerms = randomOrder ? randomizeOrder(extraTerm, altTerm) : { firstTerm: extraTerm, secondTerm: altTerm };
                let firstTerm = terms.firstTerm;
                let secondTerm = terms.secondTerm;

                if (problems.length > 0) { // if at least 1 entry in array exists
                    while (problems[problems.length - 1].firstTerm === firstTerm &&
                        problems[problems.length - 1].secondTerm === secondTerm) { // while problem is the same as the previous
                        extraTerm = type === `division` ? getDividend(primaryTerm, min, max) : getRandomInt(min, max);; // try another
                        terms = randomOrder ? randomizeOrder(extraTerm, primaryTerm) : { firstTerm: extraTerm, secondTerm: primaryTerm };
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

        console.log(problems)
        generateHtml(problems, rows, cols, index, false);
        if (includeAnswer) generateHtml(problems, rows, cols, index, true);
    }

}

export function leftPad(digit: number, padLen = PAD_LEN, padChar = ` `) {
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

export function generateHtml(problems: IProblem[], rows = 10, cols = 10, index = 0, includeAnswer = false) {
    const padLen = PAD_LEN;
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

    let firstTerm = ``;
    let secondTerm = ``;
    let solutionRow = ``;
    problems.forEach((problem, index) => {
        // htmlDocument += rowHeader;

        let i = index + 1;

        firstTerm += topDataHeader + leftPad(problem.firstTerm) + topDataFooter;
        secondTerm += bottomDataHeader + problem.symbol + leftPad(problem.secondTerm, padLen - 1) + bottomDataFooter;
        solutionRow += (includeAnswer) ? topDataHeader + leftPad(problem.answer) + topDataFooter : topDataHeader + pad + topDataFooter;

        if (i % cols === 0) {
            htmlDocument += rowHeader + firstTerm + rowFooter;
            htmlDocument += rowHeader + secondTerm + rowFooter;

            htmlDocument += rowHeader + solutionRow + rowFooter;
            htmlDocument += emptyEntry;

            firstTerm = ``;
            secondTerm = ``;
            solutionRow = ``;
        } else {
            firstTerm += emptyEntry;
            secondTerm += emptyEntry;
            solutionRow += emptyEntry;
        }

    });

    htmlDocument += tableFooter + footer;
    const file = (includeAnswer) ? `answers${index}.html` : `problems${index}.html`;
    writeFileSync(file, htmlDocument);
    console.log(`wrote ${file}`);
}
