function createButton(data, value) {
    let button = document.createElement('button');
    button.textContent = value;
    button.dataset[data] = value;
    button.classList.add(data);
    return button;
}

const operations = [];
let total = 0;
const currentOperand = [];

const body = document.querySelector('body');

for (let i = 0; i <= 9; i++) {
    let button = createButton('operand', i);
    body.appendChild(button);
}
body.appendChild(createButton('operand', '.'));
body.appendChild(createButton('operator', '+'));
body.appendChild(createButton('operator', '-'));
body.appendChild(createButton('operator', '/'));
body.appendChild(createButton('operator', '*'));
body.appendChild(createButton('operator', '='));

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

    // If the first number is zero, and it's not going to be followed by a 
    // decimal, set the first number to whatever is chosen that's not zero
    if (currentOperand.length === 1 && currentOperand[0] === '0' && operand !== '.'){
        currentOperand[0] = operand;
    } else {
        currentOperand.push(operand);
    }
}

function operate(operand, operator, total) {
    console.log({operand}, {operator}, {total});
    switch (operator) {
        case '+':
            return total + operand;
        case '-':
            return total - operand;
        case '*':
            return total * operand;
        case '/':
            return total / operand;
        default:
            return total;
    }
}

const operands = document.querySelectorAll('.operand');
for (operand of operands) {
    operand.addEventListener('click', (e) => {
        addOperand(e.target.dataset.operand);
        console.log(currentOperand);
    });
}

const operators = document.querySelectorAll('.operator');
for (operator of operators) {
    operator.addEventListener('click', e => {
        n = parseFloat(currentOperand.join(''));
        if (n) {
            if (e.target.dataset.operator === '=' && operations[operations.length - 1] === '=') {
                return;
            }
            operations.push(n);
            operations.push(e.target.dataset.operator);
            if (operations.length > 2) {
                total = operate(operations[operations.length - 2], operations[operations.length - 3], total);
            } else {
                total = operations[0];
            }
            if (e.target.dataset.operator !== '=') {
                currentOperand.splice(0, currentOperand.length);
            }
            console.table(operations);
            console.log(total);
        }
    });
}