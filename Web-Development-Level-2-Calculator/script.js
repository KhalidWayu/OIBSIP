
// Calculator state
let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetScreen = false;

// Display elements
const currentOperand = document.getElementById("current-operand");
const previousOperand = document.getElementById("previous-operand");

// Update calculator display
function updateDisplay() {
  currentOperand.textContent = currentInput;

  if (previousInput !== null && operator !== null) {
    previousOperand.textContent =
      `${previousInput} ${getOperatorSymbol(operator)}`;
  } else {
    previousOperand.textContent = "";
  }
}

// Display-friendly operator symbols
function getOperatorSymbol(op) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[op];
}

// Add a number
function appendNumber(number) {
  if (currentInput === "Error") {
    clearCalculator();
  }

  if (shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else {
    if (currentInput === "0") {
      currentInput = number;
    } else if (currentInput.length < 15) {
      currentInput += number;
    }
  }

  updateDisplay();
}

// Add a decimal point
function appendDecimal() {
  if (currentInput === "Error") {
    clearCalculator();
  }

  if (shouldResetScreen) {
    currentInput = "0";
    shouldResetScreen = false;
  }

  if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

// Choose an operator
function chooseOperator(selectedOperator) {
  if (currentInput === "Error") return;

  if (operator !== null && !shouldResetScreen) {
    calculate();
  }

  previousInput = currentInput;
  operator = selectedOperator;
  shouldResetScreen = true;

  updateDisplay();
}

// Perform calculation
function calculate() {
  if (
    previousInput === null ||
    operator === null ||
    currentInput === "Error"
  ) {
    return;
  }

  const firstNumber = Number(previousInput);
  const secondNumber = Number(currentInput);

  if (
    !Number.isFinite(firstNumber) ||
    !Number.isFinite(secondNumber)
  ) {
    showError();
    return;
  }

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":
      if (secondNumber === 0) {
        showError();
        return;
      }

      result = firstNumber / secondNumber;
      break;

    default:
      return;
  }

  if (!Number.isFinite(result)) {
    showError();
    return;
  }

  // Reduce floating-point precision errors
  result = Number(result.toPrecision(12));

  currentInput = String(result);
  previousInput = null;
  operator = null;
  shouldResetScreen = true;

  updateDisplay();
}

// Show an error
function showError() {
  currentInput = "Error";
  previousInput = null;
  operator = null;
  shouldResetScreen = true;

  updateDisplay();
}

// Delete the last character
function deleteNumber() {
  if (currentInput === "Error" || shouldResetScreen) {
    clearCalculator();
    return;
  }

  currentInput =
    currentInput.length > 1
      ? currentInput.slice(0, -1)
      : "0";

  if (currentInput === "-") {
    currentInput = "0";
  }

  updateDisplay();
}

// Clear everything
function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetScreen = false;

  updateDisplay();
}

// Handle button clicks
document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) return;

  if (button.dataset.number !== undefined) {
    appendNumber(button.dataset.number);
    return;
  }

  if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
    return;
  }

  switch (button.dataset.action) {
    case "clear":
      clearCalculator();
      break;

    case "delete":
      deleteNumber();
      break;

    case "decimal":
      appendDecimal();
      break;

    case "equals":
      calculate();
      break;
  }
});

// Initial display
updateDisplay();

// Keyboard support
document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) {
    appendNumber(event.key);
    return;
  }

  if (event.key === ".") {
    appendDecimal();
    return;
  }

  if (["+", "-", "*", "/"].includes(event.key)) {
    chooseOperator(event.key);
    return;
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    calculate();
    return;
  }

  if (event.key === "Backspace") {
    deleteNumber();
    return;
  }

  if (event.key === "Escape") {
    clearCalculator();
  }
});

