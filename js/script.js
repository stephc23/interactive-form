/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/ 

document.querySelector('#name').focus();

/* 
 *
 * In 'Job Role' drop down menu, display 'Other job role' text field only when 'Other' has been selected
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
 * In 'T-Shirt Info' section, enable color drop down menu only when design has been selected and display available colors
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
 * In 'Register for Activities' section, calculate the total cost of selected activities and disable conflicting activities
 *
 */

const activitiesDiv = document.querySelector('#activities-box');
const activitiesLabels = activitiesDiv.children;
const activitiesCostP = document.querySelector('#activities-cost');

// Return an array of checkbox inputs for activities whose time conflicts with that of the selected activity
function findTimeConflicts(selectedCheckbox, labels) {
    const selectedTime = selectedCheckbox.dataset.dayAndTime;
    const selectedName = selectedCheckbox.name;
    const conflicts = [];
    for(let i = 0; i < labels.length; i++) {
        let label = labels[i];
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
function disableTimeConflicts(isDisabled, labelClass, selectedCheckbox, labels) {
    const conflictCheckboxes = findTimeConflicts(selectedCheckbox, labels);
    for (let i = 0; i < conflictCheckboxes.length; i++) {
        let checkbox = conflictCheckboxes[i];
        let label = checkbox.parentNode;
        checkbox.disabled = isDisabled;
        label.className = labelClass;
    }
}

// When a 'change' event occurs on any checkbox, adjust total cost and call `disableTimeConflicts` function
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

// Make the focus states of the activties more apparent by adding or removing a 'focus' class
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
 * In 'Payment Info' section, make credit card the default option and display appropriate fields for the selected payment option
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

// Return a function that checks if an input value is filled, not an empty string or a series of spaces
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
        element: document.querySelector('#name'),
        fillHint: 'Name field cannot be blank',
        formatHint: '',
        isFilled: createIsFilled(),
        isFormatted: () => {
            return true;
        }
    },
    {
        name: 'email',
        element: document.querySelector('#email'),
        fillHint: 'Email address field cannot be blank',
        formatHint: 'Email address must be formatted correctly',
        isFilled: createIsFilled(),
        isFormatted: email => {
            return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
        }
    }, 
    {
        name: 'activities',
        element: document.querySelector('#activities-box'),
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
        element: document.querySelector('#cc-num'),
        fillHint: 'Card number field cannot be blank',
        formatHint: 'Credit card number must be between 13 - 16 digits',
        isFilled: createIsFilled(),
        isFormatted: ccNum => {
            return /^\d{13,16}$/.test(ccNum); 
        }
    },
    {
        name: 'zip',
        element: document.querySelector('#zip'),
        fillHint: 'Zip code field cannot be blank',
        formatHint: 'Zip Code must be 5 digits',
        isFilled: createIsFilled(),
        isFormatted: zip => {
            return /^\d{5}$/.test(zip);
        }
    }, 
    {
        name: 'cvv',
        element: document.querySelector('#cvv'),
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
        let element = field.element;
        element.addEventListener('input', createListener(i, field.isFilled, field.isFormatted, field.fillHint, field.formatHint));
    }
}
addListeners();

/*
 *
 * Form validation: form submission
 * 
 */

const form = document.querySelector('form');

// Get the appropriate validator and input value for each field from the `fields` array, and store them in a separate, two-dimensional array
function createValidatorsArray() { 
    const validators = [];
    let validator;
    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];
        let name = field.name;
        let input = field.element;
        if (name === 'name') {  
            validator = [field.isFilled, input.value];
        } else if (name === 'activities') { 
            validator = [field.isFilled, undefined];
        } else {
            validator = [field.isFormatted, input.value];
        }
        validators.push(validator);
    }
    return validators;
}

// Return true if an individual field is valid; `array` refers to the array that will be created when `createValidatorsArray` is called
function isValidField(array, index) {
    let validator = array[index][0];
    let inputValue = array[index][1];
    return validator(inputValue);
}

// Return true if all fields in a selected portion of the form are valid
function isValidFormPortion(array, indexStart, indexEnd) {
    for (let i = indexStart; i < indexEnd; i++) {
        let isValid = isValidField(array, i);
        if (!isValid) {
            return false;
        }
    }
    return true;
}

// Return true if all fields before the payment section and all relevant payment fields are valid
function isValidForm(array) {
    const isValidBeforeCardInfo = isValidFormPortion(array, 0, 3);
    const isValidCardInfo = isValidFormPortion(array, 3, 6);
    if (paymentSelect.value === 'credit-card') {
        return isValidBeforeCardInfo && isValidCardInfo;
    } else {
        return isValidBeforeCardInfo;
    }    
}

// Hide a hint span and remove error style from its parent
function hideErrorStyle(hintSpan, hintParent) {
    hintParent.classList.add('valid');
    hintParent.classList.remove('not-valid');
    hintSpan.style.display = 'none';
}

// Show a hint span and add error style to its parent
function showErrorStyle(hintSpan, hintParent) {
    hintParent.classList.add('not-valid');
    hintParent.classList.remove('valid');
    hintSpan.style.display = 'block';
}

// Show or hide the error style of each field in a selected portion of the form, depending on validity
function setSomeErrorStyles(array, indexStart, indexEnd) {   
    const hints = document.querySelectorAll('.hint');
    for (let i = indexStart; i < indexEnd; i++) {
        let hint = hints[i];
        let parent = hint.parentNode;
        let isValid = isValidField(array, i);
        if (isValid) {
            hideErrorStyle(hint, parent);
        } else {
            showErrorStyle(hint, parent);
        }      
    }
}

// Set appropriate error styles for all fields before the payment section and all relevant payment fields
function setAllErrorStyles(array) {
    if (paymentSelect.value === 'credit-card') {
        setSomeErrorStyles(array, 0, 6);
    } else {
        setSomeErrorStyles(array, 0, 3);
    }
}

form.addEventListener('submit', e => {
    const validators = createValidatorsArray();
    const isValid = isValidForm(validators);
    if (!isValid) {
        e.preventDefault(); 
        setAllErrorStyles(validators);
    }
});