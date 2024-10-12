import { writeFileSync } from "fs";

type operation = `addition` | `subtraction` | `multiplication` | `division`;
type operator = `+` | `-` | `x` | `÷`;
type answer = (first: number, second: number) => number;

export const ROWS = 10;
export const COLS = 10;
export const MIN = 0;
export const MAX = 10;

const PAD_LEN = 4;

interface IProblem {
  symbol: operator;
  firstTerm: number;
  secondTerm: number;
  answer: number;
  type: operation;
}

interface options {
  min?: number;
  max?: number;
  rows?: number;
  cols?: number;
  randomOrder?: boolean;
  primaryMinThruMax?: boolean; // means first parm will be a random [int 1 - first parm]
  primaryTerm: number;
  secondTerm?: number;
  type?: operation;
  symbol?: operator;
  print?: boolean;
  answer?: answer;
}

function getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max + 1);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

/**
 * Can return a dividend divisible by the first input number within the minimum to maximum bounds
 * @deprecated
 * @param divisibleBy
 * @param min
 * @param max
 * @returns
 */
function getDividend(divisibleBy: number, min: number, max: number) {
  let num = getRandomInt(min, max);
  while (num % divisibleBy !== 0) {
    num = getRandomInt(min, max);
  }
  return num;
}

function randomizeOrder(mainTerm: number, extraTerm: number) {
  return getRandomInt(0, 1) === 1 ? [mainTerm, extraTerm] : [extraTerm, mainTerm];
}

export function addition(options: options) {
  options.symbol = `+`;
  options.type = `addition`;
  options.answer = (first, second) => first + second;
  const problems = mathCommon(options);
  if (options.print) console.log(problems);
  return problems;
}

export function subtraction(options: options) {
  let oldPrintOption = options.print;
  options.print = false;
  const problems = inverseProblem(addition(options), `-`, `subtraction`);
  if (oldPrintOption) console.log(problems);
  return problems;
}

export function multiplication(options: options) {
  options.symbol =  `x`;
  options.type = `multiplication`;
  options.answer = (first, second) => first * second;

  const problems = mathCommon(options);
  if (options.print) console.log(problems);
  return problems;
}

export function division(options: options) {
  let oldPrintOption = options.print;
  options.print = false;
  const problems = inverseProblem(multiplication(options), `÷`, `division`);
  if (oldPrintOption) console.log(problems);
  return problems;
}

function mathCommon(options: options) {
  options.randomOrder = options.randomOrder ?? true;
  options.primaryMinThruMax = options.primaryMinThruMax ?? false;
  options.rows = options.rows ?? ROWS;
  options.cols = options.cols ?? COLS;
  options.min = options.min ?? MIN;
  options.max = options.max ?? MAX;

  validateOptions(options);

  const problems: IProblem[] = [];

  for (let i = 0; i < options.rows; i++) {
    for (let j = 0; j < options.cols; j++) {

      let newProblem = generateProblem(options);

      if (problems.length > 0) {
        // if at least 1 entry in array exists && new problem is the same as the last problem
        while (
          problems[problems.length - 1].firstTerm === newProblem.firstTerm &&
          problems[problems.length - 1].secondTerm === newProblem.secondTerm
        ) {
          // generate a new problem (no duplicates)
          newProblem = generateProblem(options);
        }
      }

      problems.push(newProblem);
    }
  }
  return problems;
}

/**
 * Flip input addition problems to be subtraction problems
 * @param problems
 * @returns
 */
function inverseProblem(problems: IProblem[], symbol: operator, type: operation) {
  return problems.map<IProblem>((problem: IProblem) => {
    return {
      type,
      symbol,
      firstTerm: problem.answer,
      secondTerm: problem.secondTerm,
      answer: problem.firstTerm,
    };
  });
}

function generateProblem(options: options) {
  // primaryTerm or min - max if `primaryMinThruMax` specified
  const mainTerm = options.primaryMinThruMax ? getRandomInt(options.min!, options.max!) : options.primaryTerm;
  const extraTerm = options.secondTerm ?? getRandomInt(options.min!, options.max!);

  const [firstTerm, secondTerm] = options.randomOrder ? randomizeOrder(mainTerm, extraTerm) : [mainTerm, extraTerm];

  const problem: IProblem = {
    firstTerm,
    secondTerm,
    answer: options.answer!(firstTerm, secondTerm),
    symbol: options.symbol!,
    type: options.type!,
  };

  return problem;
}

function validateOptions(options: options) {
  if (!options.rows) {
    throw new Error(`Error: rows is required`);
  }
  if (!options.cols) {
    throw new Error(`Error: cols is required`);
  }
  if (options.min == null) {
    throw new Error(`Error: min is required`);
  }
  if (!options.max) {
    throw new Error(`Error: max is required`);
  }
  if (!options.type) {
    throw new Error(`Error: type is required`);
  }
  if (!options.symbol) {
    throw new Error(`Error: symbol is required`);
  }
  if (!options.answer) {
    throw new Error(`Error: answer is required`);
  }
  if (options.symbol === `+` && options.type !== `addition`) {
    throw new Error(`Error: symbol '${options.symbol}' does not match operation '${options.type}'.`);
  }
  if (options.symbol === `-` && options.type !== `subtraction`) {
    throw new Error(`Error: symbol '${options.symbol}' does not match operation '${options.type}'.`);
  }
  if (options.symbol === `x` && options.type !== `multiplication`) {
    throw new Error(`Error: symbol '${options.symbol}' does not match operation '${options.type}'.`);
  }
  if (options.secondTerm && options.primaryMinThruMax === false) {
    throw new Error(`Error: cannot generate sheet of the same problem`);
  }
}

export function leftPad(digit: number, padLen = PAD_LEN, padChar = ` `) {
  let digitLen = digit.toString().length;
  if (digitLen > padLen) {
    console.log(`Error: unexpected len '${digitLen}' !> ${padLen}`);
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
  rows = ROWS,
  cols = COLS,
  suffix = "",
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
  const file = includeAnswer
    ? `answers${suffix}.html`
    : `problems${suffix}.html`;
  writeFileSync(file, htmlDocument);
  console.log(`wrote ${file}`);
}
