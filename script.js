function handleOperand(operand) {
    addOperand(operand);
    display.textContent = currentOperand.join('');
    removeSelected();
}

function handleOperator(operator) {
    let n = parseFloat(currentOperand.join(''));
    if (!isNaN(n)) {
        if (isFinite(operation.prev) && operation.operator) {
            operation.prev = operate(operation.prev, n, operation.operator);
            operation.operator = operator;
            display.textContent = operation.prev;
            currentOperand.splice(0, currentOperand.length);
            removeSelected();
            select(operator)
        } else {
            operation.prev = n;
            operation.operator = operator;
            currentOperand.splice(0, currentOperand.length);
            select(operator)
        }
    } else if (isFinite(operation.prev)) {
        removeSelected();
        operation.operator = operator;
        select(operator)
    }
}

function handleEquals() {
    let n = parseFloat(currentOperand.join(''));
    if (!isNaN(n) && operation.operator) {
        operation.prev = operate(operation.prev, n, operation.operator);
        operation.operator = null;
        currentOperand.splice(0, currentOperand.length);
        display.textContent = operation.prev;
    }
}

function handleKeyDown(e) {
    console.log(e.key);
    if (e.code.indexOf('Digit') === 0 && e.key !== '*') {
        const [trash, operand] = e.code.split('Digit');
        handleOperand(operand);
    } else if (e.code === 'Period'){ 
        const operand = '.';
        handleOperand(operand);
    }
    switch (e.key) {
        case '+':
            handleOperator('+');
            break;
        case '-':
            handleOperator('-');
            break;
        case '*':
            handleOperator('*');
            break;
        case '/':
            handleOperator('/');
            break;
        case '=':
            handleEquals();
            break;
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
    let str;
    let dotIndex;
    if (a > 10e11 || b > 10e11) {
        return "TOO BIG";
    }
    console.log({a}, {b}, {operator});
    switch (operator) {
        case '+':
            str = String(a + b);
            return truncateDecimals(str);
        case '-':
            str = String(a - b);
            return truncateDecimals(str)
        case '*':
            str = String(a * b);
            return truncateDecimals(str);
        case '/':
            if (b === 0) {
                return "Nah B";
            }
            str = String(a / b);
            return truncateDecimals(str);
    }
}

function truncateDecimals(str) {
    if (str.length > 12) {
        str = str.split('');
        dotIndex = str.findIndex((c) => c === '.');
        if(dotIndex < 12 && dotIndex !== -1) {
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
    operation.prev = null;
    operation.operator = null;
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

function toggleNeg() {
    if (currentOperand.length >= 1)
    {
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

const currentOperand = [];
const operation = {
    prev: null,
    operator: null,
}

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

const neg = document.querySelector('.neg');
neg.addEventListener('click', toggleNeg);

const equals = document.querySelector('.equals');
equals.addEventListener('click', handleEquals);
