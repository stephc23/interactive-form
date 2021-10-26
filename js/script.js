/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/ 

document.querySelector('#name').focus();

/* 
 *
 * In `Job Role` drop down menu, display `Other job role` text field only when `Other` has been selected
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
 * In `T-Shirt Info` section, enable color drop down menu only when design has been selected, and display available colors
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
 * In `Register for Activities` section, set up `Total` to reflect the total cost of selected activities, and disable conflicting activities
 *
 */

const activitiesDiv = document.querySelector('#activities-box');
const activitiesLabels = activitiesDiv.children;
const activitiesCostP = document.querySelector('#activities-cost');

// Return an array of checkbox inputs for activities whose time conflicts with that of the selected activity
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

// Disable or enable the checkbox and label for each conflicting activity
function disableTimeConflicts(isDisabled, labelClass, selectedCheckbox, allLabels) {
    const conflictCheckboxes = findTimeConflicts(selectedCheckbox, allLabels);
    for (let i = 0; i < conflictCheckboxes.length; i++) {
        let checkbox = conflictCheckboxes[i];
        let label = checkbox.parentNode;
        checkbox.disabled = isDisabled;
        label.className = labelClass;
    }
}

// When a `change` event occurs on any checkbox, adjust total cost and call `disableTimeConflicts` function
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

// Make the focus states of the activties more apparent by adding or removing a `focus` class
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
 * In `Payment Info` section, make credit card the default option and display appropriate fields for the selected payment option
 *
 */

const paymentSelect = document.querySelector('#payment');
const paymentOptions = paymentSelect.children;
const creditCardOption = paymentOptions[1];
const creditCardDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');
const paymentArray = [creditCardDiv, paypalDiv, bitcoinDiv];

creditCardOption.selected = true;
paypalDiv.style.display = 'none';
bitcoinDiv.style.display = 'none';
paymentSelect.addEventListener('change', e => {
    const selectedOption = e.target.value;
    for (let i = 0; i < paymentArray.length; i++) {
        let paymentDiv = paymentArray[i];
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

// Return a function that checks if an input value is filled (not an empty string or a series of spaces)
function createIsFilled() {
    return function(inputValue) {
        if (inputValue === '' || /^\s+$/.test(inputValue)) {
            return false;
        } else {
            return true;
        }
    }
}

// Store input element, conditional error messages, and validator functions for each field in an array of objects called `fields`
const fields = [
    {
        name: 'name',
        input: document.querySelector('#name'),
        fillHint: 'Name field cannot be blank',
        formatHint: '',
        isFilled: createIsFilled(),
        isFormatted: () => {
            return true;
        }
    },
    {
        name: 'email',
        input: document.querySelector('#email'),
        fillHint: 'Email address field cannot be blank',
        formatHint: 'Email address must be formatted correctly',
        isFilled: createIsFilled(),
        isFormatted: email => {
            return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
        }
    }, 
    {
        name: 'activities',
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
        name: 'cc-num',
        input: document.querySelector('#cc-num'),
        fillHint: 'Card number field cannot be blank',
        formatHint: 'Credit card number must be between 13 - 16 digits',
        isFilled: createIsFilled(),
        isFormatted: ccNum => {
            return /^\d{13,16}$/.test(ccNum); 
        }
    },
    {
        name: 'zip',
        input: document.querySelector('#zip'),
        fillHint: 'Zip code field cannot be blank',
        formatHint: 'Zip Code must be 5 digits',
        isFilled: createIsFilled(),
        isFormatted: zip => {
            return /^\d{5}$/.test(zip);
        }
    }, 
    {
        name: 'cvv',
        input: document.querySelector('#cvv'),
        fillHint: 'CVV field cannot be blank',
        formatHint: 'CVV must be 3 digits',
        isFilled: createIsFilled(),
        isFormatted: cvv => {
            return /^\d{3}$/.test(cvv);
        },
    }
];

// Create a listener to display or hide a different real-time error message depending on type of error
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

// Add an event listener to each input element by calling `createListener` with values from the `fields` array of objects
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

// Get the appropriate validator and the input for each field from the `fields` array, and store them in a separate, two-dimensional array
function createValidatorsArray() { 
    const validatorsArray = [];
    let validator;
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let name = field.name;
        let input = field.input;
        if (name === 'name') {  
            validator = [field.isFilled, input.value];
        } else if (name === 'activities') { 
            validator = [field.isFilled, undefined];
        } else {
            validator = [field.isFormatted, input.value];
        }
        validatorsArray.push(validator);
    }
    return validatorsArray;
}

// function isValidField(arr, index) {

// }

// Return true if all input values in a selected portion of the validators array are valid
function isValidPortion(indexStart, indexEnd) {
    const validators = createValidatorsArray();
    for (let i = indexStart; i < indexEnd; i++) {
        let validator = validators[i][0];
        let inputValue = validators[i][1];
        let isValidField = validator(inputValue);
        if (!isValidField) {
            return false;
        }
    }
    return true;
}

// Return true if all relevant fields for the selected payment option are valid
function isValidForm() {
    const isValidBeforeCardInfo = isValidPortion(0, 3);
    const isValidCardInfo = isValidPortion(3, 6);
    if (paymentSelect.value === 'credit-card') {
        return isValidBeforeCardInfo && isValidCardInfo;
    } else {
        return isValidBeforeCardInfo;
    }    
}

// Loop through the validators array, check if each field is valid, and adjust style and hide/display error message accordingly
function setErrorStyle() {  
    const validators = createValidatorsArray(); 
    const hints = document.querySelectorAll('.hint');
    for (let i = 0; i < validators.length; i++) {
        let validator = validators[i][0];
        let inputValue = validators[i][1];
        let hint = hints[i];
        let parent = hint.parentNode;
        let isValidField = validator(inputValue);
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
        setErrorStyle();
    }
});