import { writeFileSync } from "fs";

type operation = `addition` | `subtraction` | `multiplication` | `division`;
type operator = `+` | `-` | `x` | `÷`;
type answer = (first: number, second: number) => number;

const PAD_LEN = 4;

interface IProblem {
  symbol: operator;
  firstTerm: number;
  secondTerm: number;
  answer: number;
  type: operation;
}

interface options {
  min: number;
  max: number;
  rows: number;
  cols: number;
  randomOrder?: boolean;
  oneThruFirst?: boolean; // means first parm will be a random [int 1 - first parm]
  subtrahend?: number;
}

interface fullOptions extends options{
  tpye: operation;
  symbol: operator;
  answer: answer,
  primaryTerm: number,
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

function randomizeOrder(extraTerm: number, primaryTerm: number) {
  return (getRandomInt(0, 1) === 1) ? [primaryTerm, extraTerm] : [extraTerm, primaryTerm];
}

/**
 * addend + addend = sum
 * @param primaryTerm
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function addition(
  addend: number,
  min = 0,
  max = 12,
  rows = 10,
  cols = 10,
  oneThruFirst = false
) {
  const options: fullOptions = {
    symbol: `+`,
    tpye: `addition`,
    answer: (first, second) => first + second,
    primaryTerm: addend,
    min,
    max,
    rows,
    cols,
    oneThruFirst,
  };
  return mathCommon(
    options
  );
}

/**
 * multiplicand * multiplier = product
 * @param multiplier
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function multiplication(
  multiplier: number,
  min = 0,
  max = 12,
  rows = 10,
  cols = 10
) {
  const options: fullOptions = {
    symbol: `x`,
    tpye: `multiplication`,
    answer: (first, second) => first * second,
    primaryTerm: multiplier,
    min,
    max,
    rows,
    cols,
  };
  return mathCommon(
    options
  );
}

/**
 * minuend - subtrahend = difference
 * @param subtrahend
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function subtraction(
  minuend: number,
  min = minuend,
  max = 20,
  rows = 10,
  cols = 10,
  oneThruFirst = false,
  subtrahend?: number
) {
  const options: fullOptions = {
    symbol: `-`,
    tpye: `subtraction`,
    answer:  (first, second) => first - second,
    primaryTerm: minuend,
    min,
    max,
    rows,
    cols,
    randomOrder: false,
    oneThruFirst,
    subtrahend,
  };
  return mathCommon(
    options
  );
}

/**
 * dividend - divisor = quotient
 * @param divisor
 * @param min
 * @param max
 * @param rows
 * @param cols
 */
export function division(
  divisor: number,
  min = divisor,
  max = divisor * 12,
  rows = 10,
  cols = 10
) {
  const options: fullOptions = {
    symbol: `÷`,
    tpye: `division`,
    answer: (first, second) => first / second,
    primaryTerm: divisor,
    min,
    max,
    rows,
    cols,
    randomOrder: false,
  };
  return mathCommon(
    options
  );
}

function generateProblem(
  symbol: operator,
  type: operation,
  answer: answer,
  primaryTerm: number,
  options: options
) {
  let mainTerm = options.oneThruFirst ? getRandomInt(options.min, options.max) : primaryTerm; //alternative term is primary term or min - max if `oneThruFirst` specified
  let extraTerm;
  let firstTerm;
  let secondTerm;

  switch (type) {
    case `division`:
      extraTerm = getDividend(primaryTerm, options.min, options.max);
      [firstTerm, secondTerm] = [extraTerm, mainTerm];
      break;
    case `subtraction`:
      if (options.subtrahend) {
        extraTerm = options.subtrahend;
        [firstTerm, secondTerm] = [mainTerm, extraTerm];
        console.log(`mainterm is ${mainTerm} extra is ${extraTerm}`);
        console.log(`first ${firstTerm} second ${secondTerm}`)
      } else {
        const rando = getRandomInt(options.min, mainTerm);
        [firstTerm, secondTerm] = [mainTerm, rando];
      }
      break;
    case `addition`:
    case `multiplication`:
    default:
      extraTerm = getRandomInt(options.min, options.max);
      [firstTerm, secondTerm] = options.randomOrder ? randomizeOrder(extraTerm, mainTerm) : [mainTerm, extraTerm];
      break;
  }

  const problem: IProblem = {
    firstTerm,
    secondTerm,
    answer: answer(firstTerm, secondTerm),
    symbol,
    type,
  };

  return problem;
}

function validateOptions(options: fullOptions) {
  if (options.symbol === `+` && options.tpye !== `addition`) {
    throw new Error(`Error: symbol '${options.symbol}' does not match operation '${options.tpye}'.`)
  }
  if (options.symbol === `-` && options.tpye !== `subtraction`) {
    throw new Error(`Error: symbol '${options.symbol}' does not match operation '${options.tpye}'.`)
  }
  if (options.symbol === `x` && options.tpye !== `multiplication`) {
    throw new Error(`Error: symbol '${options.symbol}' does not match operation '${options.tpye}'.`)
  }
  if(options.tpye !== `subtraction` && options.subtrahend) {
    throw new Error(`Error: cannot use subtrahend unless using ${options.tpye}`)
  }
  console.log(options.subtrahend! + '----' +  options.min)
  if (options.subtrahend && options.min < options.subtrahend) {
    throw new Error(`Error: min cannot be less than subtrahend`);
  }
}

function mathCommon(
  options: fullOptions
) {
  const symbol = options.symbol;
  const type = options.tpye;
  const answer = options.answer;
  const primaryTerm = options.primaryTerm;

  options.randomOrder = options.randomOrder ?? true;
  options.oneThruFirst = options.oneThruFirst ?? false;

  validateOptions(options);

    const problems: IProblem[] = [];

    for (let i = 0; i < options.rows; i++) {
      for (let j = 0; j < options.cols; j++) {

        let newProblem = generateProblem(symbol, type, answer, primaryTerm, options);

        if (problems.length > 0) {
          // if at least 1 entry in array exists && new problem is the same as the last problem
          while (
            problems[problems.length - 1].firstTerm === newProblem.firstTerm &&
            problems[problems.length - 1].secondTerm === newProblem.secondTerm
          ) {
            // generate a new problem (no duplicates)
            newProblem = generateProblem(symbol, type, answer, primaryTerm, options);
          }
        }

        problems.push(newProblem);
      }
    }

    return problems;
    // console.log(problems);
    // generateHtml(problems, options.rows, options.cols, index, false);
    // if (options.includeAnswer) generateHtml(problems, options.rows, options.cols, index, true);
  // }
}

export function leftPad(digit: number, padLen = PAD_LEN, padChar = ` `) {
  let digitLen = digit.toString().length;
  if (digitLen > padLen) {
    console.log(`unexpected len`);
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

export function generateHtml(
  problems: IProblem[],
  rows = 10,
  cols = 10,
  suffix = '',
  includeAnswer = false
) {
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
    `<br>\n`;
  const tableHeader = `    <table>\n`;

  const rowHeader = `        <tr>\n`;

  const topDataHeader = `            <td><code><span style="white-space: pre;">`;

  const bottomDataHeader = `            <td><code><span style="text-decoration: underline; white-space: pre;">`;

  const emptyEntry = `            <td><code><span style="white-space: pre;">${pad}</span></td></code>\n`;

  const topDataFooter = `</span></td></code>\n`;

  const bottomDataFooter = topDataFooter;

  const rowFooter = `        </tr>\n`;

  const tableFooter = `    </table>\n`;

  const footer = `</html>\n` + `</body>\n`;

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
    secondTerm +=
      bottomDataHeader +
      problem.symbol +
      leftPad(problem.secondTerm, padLen - 1) +
      bottomDataFooter;
    solutionRow += includeAnswer
      ? topDataHeader + leftPad(problem.answer) + topDataFooter
      : topDataHeader + pad + topDataFooter;

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
  const file = includeAnswer ? `answers${suffix}.html` : `problems${suffix}.html`;
  writeFileSync(file, htmlDocument);
  console.log(`wrote ${file}`);
}
