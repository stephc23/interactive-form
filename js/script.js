/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/ 

document.querySelector('#name').focus();

/* 
 *
 * In `Job Role` drop down menu, displays `Other job role` text field only when `Other` has been selected
 *
 */ 

const jobRoleSelect = document.querySelector('#title');
const otherJobInput = document.querySelector('#other-job-role');

otherJobInput.style.display = 'none';
jobRoleSelect.addEventListener('change', e => {
    const selectedJob = e.target.value;
    if (selectedJob === 'other') {
        otherJobInput.style.display = 'block';
    } else {
        otherJobInput.style.display = 'none';
    }
});

/*
 * 
 * In `T-Shirt Info` section, enables color drop down menu only when design has been selected, and displays available colors
 *
 */

const designSelect = document.querySelector('#design');
const colorSelect = document.querySelector('#color');
const colorOptions = colorSelect.children;

colorSelect.disabled = true;
designSelect.addEventListener('change', e => {
    colorSelect.disabled = false;
    const selectedDesign = e.target.value;
    for (let i = 0; i < colorOptions.length; i++) {
        let option = colorOptions[i];
        let prevOption = colorOptions[i - 1];
        if (option.dataset.theme === selectedDesign) {
            option.hidden = false;
            if (option.dataset.theme !== prevOption.dataset.theme) {
                option.selected = true;
            }
        } else {
            option.hidden = true;
        }
    }
});

/*
 *
 * In `Register for Activities` section, sets up `Total` to reflect the total cost of selected activities and disable conflicting activities
 *
 */

const activitiesDiv = document.querySelector('#activities-box');
const activitiesLabels = activitiesDiv.children;
const activitiesCostP = document.querySelector('#activities-cost');

// Returns an array of checkbox inputs for activities whose time conflicts with that of the selected activity
function findTimeConflicts(selectedCheckbox, allLabels) {
    const selectedTime = selectedCheckbox.dataset.dayAndTime;
    const selectedName = selectedCheckbox.name;
    const conflicts = [];
    for(let i = 0; i < allLabels.length; i++) {
        let label = allLabels[i];
        let checkbox = label.firstElementChild;
        let time = checkbox.dataset.dayAndTime;
        let name = checkbox.name;
        if (time === selectedTime && name !== selectedName) {
            conflicts.push(checkbox);
        } 
    }
    return conflicts;
}

// Disables or enables the checkbox and label for each conflicting activity
function disableTimeConflicts(isDisabled, labelClass, selectedCheckbox, allLabels) {
    const conflictCheckboxes = findTimeConflicts(selectedCheckbox, allLabels);
    for (let i = 0; i < conflictCheckboxes.length; i++) {
        let checkbox = conflictCheckboxes[i];
        let label = checkbox.parentNode;
        checkbox.disabled = isDisabled;
        label.className = labelClass;
    }
}

// When a `change` event occurs on any checkbox, adjusts total cost and calls `disableTimeConflicts` function
activitiesDiv.addEventListener('change', e => {
    const checkbox = e.target;
    const checked = checkbox.checked;
    const cost = parseInt(checkbox.dataset.cost);
    let totalCost = parseInt(activitiesCostP.textContent.slice(8));
    if (checked) {
        totalCost += cost; 
        disableTimeConflicts(true, 'disabled', checkbox, activitiesLabels);
    } else {
        totalCost -= cost;
        disableTimeConflicts(false, '', checkbox, activitiesLabels);
    }
    const totalCostDisplay = `Total: $${totalCost}`;
    activitiesCostP.textContent = totalCostDisplay;
});

// Makes the focus states of the activties more apparent by adding or removing a `focus` class
function addActivityFocusState(event, labelClass) {
    activitiesDiv.addEventListener(event, e => {
        const input = e.target;
        const label = input.parentNode;
        label.className = labelClass;
    });
}
addActivityFocusState('focusin', 'focus');
addActivityFocusState('focusout', '');

/*
 *
 * In `Payment Info` section, makes credit card the default option and displays appropriate elements for the selected payment option
 *
 */

const paymentSelect = document.querySelector('#payment');
const paymentOptions = paymentSelect.children;
const creditCardOption = paymentOptions[1];
const creditCardDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');

creditCardOption.selected = true;
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';
paymentSelect.addEventListener('change', e => {
    const selectedOption = e.target.value;
    const divsArray = [creditCardDiv, paypalDiv, bitcoinDiv];
    for (let i = 0; i < divsArray.length; i++) {
        let paymentDiv = divsArray[i];
        let payment = paymentDiv.className;
        if (payment === selectedOption) {
            paymentDiv.style.display = 'block';
        } else {
            paymentDiv.style.display = 'none';
        }
    }
});

/*
 *
 * Form validation: real-time error messages
 * 
 */

// Returns true if an input value is not an empty string or a series of spaces
function createIsFilled() {
    return function(inputValue) {
        if (inputValue === '' || /^\s+$/.test(inputValue)) {
            return false;
        } else {
            return true;
        }
    }
}

// Stores input element, conditional error messages, and validator functions for each field in an array of objects called `fields`
const fields = [
    {
        input: document.querySelector('#name'),
        fillHint: 'Name field cannot be blank',
        formatHint: '',
        isFilled: createIsFilled(),
        isFormatted: () => {
            return true;
        }
    },
    {
        input: document.querySelector('#email'),
        fillHint: 'Email address field cannot be blank',
        formatHint: 'Email address must be formatted correctly',
        isFilled: createIsFilled(),
        isFormatted: email => {
            return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
        }
    }, 
    {
        input: document.querySelector('#activities-box'),
        fillHint: 'Choose at least one activity',
        formatHint: '',
        isFilled: () => {
            const activitiesDiv = document.querySelector('#activities-box');
            const activitiesLabels = activitiesDiv.children;
            for (let i = 0; i < activitiesLabels.length; i++) {
                let label = activitiesLabels[i];
                let checkbox = label.firstElementChild;
                if (checkbox.checked) {
                    return true;
                }
            }
            return false;
        },
        isFormatted: () => {
            return true;
        }
    },
    {
        input: document.querySelector('#cc-num'),
        fillHint: 'Card number field cannot be blank',
        formatHint: 'Credit card number must be between 13 - 16 digits',
        isFilled: createIsFilled(),
        isFormatted: ccNum => {
            return /^\d{13,16}$/.test(ccNum); 
        }
    },
    {
        input: document.querySelector('#zip'),
        fillHint: 'Zip code field cannot be blank',
        formatHint: 'Zip Code must be 5 digits',
        isFilled: createIsFilled(),
        isFormatted: zip => {
            return /^\d{5}$/.test(zip);
        }
    }, 
    {
        input: document.querySelector('#cvv'),
        fillHint: 'CVV field cannot be blank',
        formatHint: 'CVV must be 3 digits',
        isFilled: createIsFilled(),
        isFormatted: cvv => {
            return /^\d{3}$/.test(cvv);
        },
    }
];

// Creates a listener to display or hide two different real-time error messages depending on type of error
function createListener(index, filledValidator, formattedValidator, fillHint, formatHint) {
    return e => {
        const input = e.target;
        const hints = document.querySelectorAll('.hint');
        const hint = hints[index];
        const isFilled = filledValidator(input.value);
        const isFormatted = formattedValidator(input.value);
        if (isFilled) {
            if (isFormatted) {
                hint.style.display = 'none';
            } else {
                hint.textContent = formatHint;
                hint.style.display = 'block';
            }
        } else {
            hint.textContent = fillHint;
            hint.style.display = 'block';
        }
    }
}

// Loops through the objects of the `fields` array, adding an event listener to each input element by calling `createListener`
function addListeners() {
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let input = field.input;
        input.addEventListener('input', createListener(i, field.isFilled, field.isFormatted, field.fillHint, field.formatHint));
    }
}

addListeners();

/*
 *
 * Form validation: form submission
 * 
 */

const form = document.querySelector('form');

// Creates a multidimensional array that holds each validator function and an input value
function createValidatorsArray() { 
    const validatorsArray = [];
    let valAndArg;
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let input = field.input;
        if (i === 0) {
            valAndArg = [field.isFilled, input.value];
        } else if (i === 2) {
            valAndArg = [field.isFilled, undefined];
        } else {
            valAndArg = [field.isFormatted, input.value];
        }
        validatorsArray.push(valAndArg);
    }
    return validatorsArray;
}

// Returns true if a selection of validators from the array all return true
function isValidPortion(indexStart, indexEnd) {
    const valsAndArgs = createValidatorsArray();
    for (let i = indexStart; i < indexEnd; i++) {
        let validator = valsAndArgs[i][0];
        let argument = valsAndArgs[i][1];
        let isValid = validator(argument);
        if (!isValid) {
            return false;
        }
    }
    return true
}

// Returns true if all relevant fields for the selected payment option are valid
function isValidForm() {
    const isValidBeforeCardInfo = isValidPortion(0, 3);
    const isValidCardInfo = isValidPortion(3, 6);
    if (paymentSelect.value === 'credit-card') {
        return isValidBeforeCardInfo && isValidCardInfo;
    } else {
        return isValidBeforeCardInfo;
    }    
}

// Checks if each field is valid using the validators array, and adjusts style and hides/displays the error message accordingly
function changeErrorStyle() {  
    const valsAndArgs = createValidatorsArray(); 
    const hints = document.querySelectorAll('.hint');
    for (let i = 0; i < valsAndArgs.length; i++) {
        let validator = valsAndArgs[i][0];
        let argument = valsAndArgs[i][1];
        let hint = hints[i];
        let parent = hint.parentNode;
        let isValidField = validator(argument);
        if (isValidField) {
            parent.classList.add('valid');
            parent.classList.remove('not-valid');
            hint.style.display = 'none';
        } else {
            parent.classList.add('not-valid');
            parent.classList.remove('valid');
            hint.style.display = 'block';
        }      
    }
}

form.addEventListener('submit', e => {
    if (!isValidForm()) {
        e.preventDefault(); 
        changeErrorStyle();
    }
});