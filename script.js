function handleOperand(operand) {
    addOperand(operand);
    display.textContent = currentOperand.join('');
    removeSelected();
}

function handleOperator(operator) {
    let currentOperator = operator;
    if (currentOperand.length > 0) {
        if (currentOperation.length == 2) {
            if (total) {
                total = operate(
                                total, 
                                parseFloat(currentOperand.join('')), 
                                currentOperation[1]);
            } else {
                total = operate(
                                currentOperation[0], 
                                parseFloat(currentOperand.join('')), 
                                currentOperation[1]);
            }
            if (currentOperator !== '=')
            {
                currentOperation[0] = total;
                currentOperation[1] = currentOperator;
                select(operator);
            } else {
                currentOperation.splice(0, currentOperation.length);
                removeSelected();
            }
            display.textContent = total;
            currentOperand.splice(0, currentOperand.length);
        } else if (currentOperator !== '=') {
            total = null;
            currentOperation.push(parseFloat(currentOperand.join('')));
            currentOperation.push(currentOperator);
            currentOperand.splice(0, currentOperand.length);
            select(operator);
        }
    } else if (total) {
        if (currentOperator !== '=' && currentOperation.length === 0) {
            currentOperation.push(total);
            currentOperation.push(currentOperator);
            select(operator);
        } else if (currentOperator !== '=' && currentOperation.length === 2) {
            removeSelected();
            select(operator);
            currentOperation[1] = currentOperator;
        }
    } else if (currentOperation.length === 2) {
        removeSelected();
        select(operator);
        currentOperation[1] = currentOperator;
    }
}

function handleKeyDown(e) {
    console.log(e.key);
    if (e.code.indexOf('Digit') === 0 && e.key !== '*') {
        [trash, operand] = e.code.split('Digit');
        handleOperand(operand);
    } else if (e.code === 'Period'){ 
        operand = '.';
        handleOperand(operand);
    }
    switch (e.key) {
        case '+':
            handleOperator(e.key);
            break;
        case '-':
            handleOperator(e.key);
            break;
        case '*':
            handleOperator(e.key);
            break;
        case '/':
            handleOperator(e.key);
            break;
        case '=':
            handleOperator(e.key);
            break;
        case 'Enter':
            handleOperator('=');
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
    if (operand === '.') {
        if (currentOperand.find(c => c === '.')) 
        { 
            return;
        }
    }
    // Don't allow display to be cluttered with zeroes
    if (operand === '0' && currentOperand.length === 1 && currentOperand[0] === '0') {
        return;
    }
    if (operand === '.' && currentOperand.length === 0) {
        currentOperand.push('0');
    }

    // If the first number is zero, and it's not going to be followed by a 
    // decimal, set the first number to whatever is chosen that's not zero
    if (currentOperand.length === 1 && currentOperand[0] === '0' && operand !== '.'){
        currentOperand[0] = operand;
    } else {
        currentOperand.push(operand);
    }
}

function operate(a, b, operator) {
    console.log({a}, {b}, {operator});
    switch (operator) {
        case '+':
            return a + b;
        case '-':
            return a - b;
        case '*':
            return a * b;
        case '/':
            return a / b;
    }
}

function select(symbol) {
    const operators = document.querySelectorAll('.operator');
    for (operator of operators) {
        if (operator.textContent === symbol) {
            operator.classList.add('selected');
        }
    }
}

function removeSelected() {
    const selected = document.querySelector('.selected');
    if (selected) {
        selected.classList.remove('selected');
    }
}

function clearCalc() {
    total = null;
    currentOperation.splice(0, currentOperation.length);
    currentOperand.splice(0, currentOperand.length);
    display.textContent = '0';
    removeSelected();
}

function backspace() {
    if (currentOperand.length > 0) {
        if (currentOperand[0] === '0' && currentOperand[1] === '.') {
            currentOperand.splice(0, 2);
        } else {
            currentOperand.pop();
        }
    }

    if (display.textContent.length === 0 || currentOperand.length === 0)
    {
        display.textContent = '0';
    } else {
        display.textContent = currentOperand.join('');
    }
}

const currentOperand = [];
const currentOperation = [];
let total;

const operands = document.querySelectorAll('.operand');
const display = document.querySelector('.display');
for (operand of operands) {
    operand.addEventListener('click', (e) => {
        const operand = e.target.dataset.operand;
        handleOperand(operand);
    });
}

window.addEventListener('keydown', handleKeyDown);

const operators = document.querySelectorAll('.operator');
for (operator of operators) {
    operator.addEventListener('click', e => {
        const operator = e.target.dataset.operator;
        handleOperator(operator);
    });
}

const clear = document.querySelector('.clear');
clear.addEventListener('click', () => {
    clearCalc();
});

const back = document.querySelector('.backspace');
back.addEventListener('click', backspace);