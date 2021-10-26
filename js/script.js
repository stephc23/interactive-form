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
const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const ccInput = document.querySelector('#cc-num');
const zipInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');

// Stores validator functions in an object called `val`
const val = {
    isValidName: name => {
        if (name === '' || /^\s+$/.test(name)) {
            return false;
        } else {
            return true;
        }
    },
    isFilledEmail: email => {
        if (email === '' || /^\s+$/.test(email)) {
            return false;
        } else {
            return true;
        }
    },
    isFormattedEmail: email => {
        return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
    },
    isValidCCNum: ccNum => {
        return /^\d{13,16}$/.test(ccNum);
    },
    isValidZip: zip => {
        return /^\d{5}$/.test(zip);
    },
    isValidCVV: cvv => {
        return /^\d{3}$/.test(cvv);
    },
    isAtLeastOneActivity: () => {
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
    }
};

// Creates a listener to display or hide a real-time error message, to be used for all fields except email
function createListener(validator) {
    return e => {
        const input = e.target;
        const hint = input.nextElementSibling;
        const valid = validator(input.value);
        if (!valid) {
            hint.style.display = 'block';
        } else {
            hint.style.display = 'none';
        }
    }
}

// Creates a listener to display or hide two different real-time error messages depending on type of error, to be used for email field
function createEmailListener(filledValidator, formatValidator) {
    return e => {
        const input = e.target;
        const hint = input.nextElementSibling;
        const filled = filledValidator(input.value);
        const formatted = formatValidator(input.value);
        if (filled) {
            if (formatted) {
                hint.style.display = 'none';
            } else {
                hint.textContent = 'Email address must be formatted correctly';
                hint.style.display = 'block';
            }
        } else {
            hint.textContent = 'Email address field cannot be blank';
            hint.style.display = 'block';
        }
    }
}

nameInput.addEventListener('input', createListener(val.isValidName));
emailInput.addEventListener('input', createEmailListener(val.isFilledEmail, val.isFormattedEmail));
ccInput.addEventListener('input', createListener(val.isValidCCNum));
zipInput.addEventListener('input', createListener(val.isValidZip));
cvvInput.addEventListener('input', createListener(val.isValidCVV));

/*
 *
 * Form validation: form submission
 * 
 */

// Creates a multidimensional array that holds each validator function and an input value
function createValidatorsArray() { 
    return [
        [val.isValidName, nameInput.value],
        [val.isFormattedEmail, emailInput.value],
        [val.isAtLeastOneActivity, undefined],
        [val.isValidCCNum, ccInput.value],
        [val.isValidZip, zipInput.value],
        [val.isValidCVV, cvvInput.value] 
    ];
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

// Checks if each field is valid using the `valsAndArgs` array, and adjusts style and hides/displays the error message
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