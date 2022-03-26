function handleOperand(operand) {
    addOperand(operand);
    deselect();
    display.textContent = currentOperand.join('');
}

function handleOperator(operator) {
    let n = parseFloat(currentOperand.join(''));
    if (!isNaN(n)) {
        if (operation.operator) {
            // If there is a previous number and an operator, it means this is being calculated after 2 numbers have been entered, and an operator has been clicked again, so it's calculating the operation and showing the completed operation

            // Checking for operation.operator because this always calculates via the last operator entered, not the current one
            operation.prev = operate(operation.prev, n, operation.operator);
            operation.operator = operator;
            display.textContent = operation.prev;
            deselect();
            select(operator);
            currentOperand.splice(0, currentOperand.length);
        } else {
            // This is for when there are no numbers entered yet, and an operation has been selected

            // Also if a previous total is saved, but the user wants to start a new calculation, this will get rid of the saved previous total
            operation.prev = n;
            operation.operator = operator;
            select(operator);
            currentOperand.splice(0, currentOperand.length);
        }
    // If a number has previous been calculated, but one hasn't been entered, this allows the user to swap the current operation
    } else {
        operation.operator = operator;
        deselect();
        select(operator);
    }
}

function handleEquals() {
    let n = parseFloat(currentOperand.join(''));
    if (!isNaN(n) && operation.operator) {
        operation.prev = operate(operation.prev, n, operation.operator);
        operation.operator = null;
        display.textContent = operation.prev;
        currentOperand.splice(0, currentOperand.length);
    }

    deselect();
}

function handleKeyDown(e) {
    if (e.code.indexOf('Digit') === 0 && e.key !== '*') {
        const [trash, operand] = e.code.split('Digit');
        handleOperand(operand);
    } else if (e.code === 'Period') { 
        const operand = '.';
        handleOperand(operand);
    }

    switch (e.key) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(e.key);
            break;
        case '=':
        case 'Enter':
            handleEquals();
            break;
        case 'c':
            clearCalc();
            break;
        case 'Backspace':
            backspace();
            break;
    }
}

function addOperand(operand) {
    // Only one decimal place allowed per operand
    if (operand === '.' && currentOperand.find(c => c === '.')) {
        return;
    }
    // Don't allow display to be cluttered with zeroes
    if (operand === '0' && currentOperand.length === 1 && currentOperand[0] === '0') {
        return;
    }
    if (operand === '.' && currentOperand.length === 0) {
        currentOperand.push('0');
        currentOperand.push('.');
        return;
    }

    // If the first number is zero, and it's not going to be followed by a 
    // decimal, set the first number to whatever is chosen that's not zero
    if (currentOperand.length === 1 && currentOperand[0] === '0' && operand !== '.') {
        currentOperand[0] = operand;
    } else {
        currentOperand.push(operand);
    }
}

function operate(a, b, operator) {
    if (a > 10e11 || b > 10e11) {
        return "TOO BIG!";
    }

    switch (operator) {
        case '+':
            return truncateDecimals(String(a + b));
        case '-':
            return truncateDecimals(String(a - b))
        case '*':
            return truncateDecimals(String(a * b));
        case '/':
            if (b === 0) {
                return "Nah B";
            }
            return truncateDecimals(String(a / b));
    }
}

function truncateDecimals(str) {
    if (str.length > 12) {
        str = str.split('');
        const dotIndex = str.findIndex((c) => c === '.');
        if (dotIndex <= 12 && dotIndex !== -1) {
            str.splice(12, str.length);
        }

        if (str.length > 12){
            return "TOO BIG!";
        }

        return parseFloat(str.join(''));
    }
    return (parseFloat(str));
}

function select(symbol) {
    const operators = document.querySelectorAll('.operator');
    operators.forEach((operator) => {
        if (operator.dataset.operator === symbol) {
            operator.classList.add('selected');
        }
    });
}

function deselect() {
    const selected = document.querySelector('.selected');
    if (selected) {
        selected.classList.remove('selected');
    }
}

function clearCalc() {
    operation.prev = 0;
    operation.operator = null;
    currentOperand.splice(0, currentOperand.length);
    display.textContent = '0';
    deselect();
}

function backspace() {
    if (currentOperand.length > 0) {
        if (currentOperand[0] === '0' && currentOperand[1] === '.') {
            currentOperand.splice(0, 2);
        } else {
            currentOperand.pop();
        }
    }

    if (display.textContent.length === 0 || currentOperand.length === 0) {
        display.textContent = '0';
    } else {
        display.textContent = currentOperand.join('');
    }
}

function toggleNeg() {
    if (currentOperand.length >= 1) {
        if (currentOperand[0] === '-') {
            currentOperand.splice(0, 1);
        } else {
            currentOperand.splice(0, 0, '-');
        }
        display.textContent = currentOperand.join('');
    } else if (operation.prev) {
        operation.prev = 0 - operation.prev;
        display.textContent = operation.prev;
    }
}

const display = document.querySelector('.display');
const currentOperand = [];
const operation = {
    prev: 0,
    operator: null,
}

window.addEventListener('keydown', handleKeyDown);

const operands = document.querySelectorAll('.operand');
operands.forEach((operand) => {
    operand.addEventListener('click', (e) => handleOperand(e.target.dataset.operand));
});

const operators = document.querySelectorAll('.operator');
operators.forEach((operator) => {
    operator.addEventListener('click', e => handleOperator(e.target.dataset.operator));
});

const clear = document.querySelector('.clear');
clear.addEventListener('click', clearCalc);

const back = document.querySelector('.backspace');
back.addEventListener('click', backspace);

const negToggle = document.querySelector('.neg');
negToggle.addEventListener('click', toggleNeg);

const equals = document.querySelector('.equals');
equals.addEventListener('click', handleEquals);
