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
 * In the `Register for Activities` section, set up `Total` to reflect the total cost of selected activities and disable conflicting activities
 *
 */
const activitiesDiv = document.querySelector('#activities-box');
const activitiesLabels = activitiesDiv.children;
const activitiesCostP = document.querySelector('#activities-cost');

// Return an array of checkbox input elements for activities whose time conflicts with that of the selected activity
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

// For each conflicting activity, disable or enable checkbox and label depending on arguments passed
function disableTimeConflicts(isDisabled, labelClass, selectedCheckbox, allLabels) {
    const conflictCheckboxes = findTimeConflicts(selectedCheckbox, allLabels);
    for (let i = 0; i < conflictCheckboxes.length; i++) {
        let checkbox = conflictCheckboxes[i];
        let label = checkbox.parentNode;
        checkbox.disabled = isDisabled;
        label.className = labelClass;
    }
}

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

/*
 *
 * In `Payment Info` section, make credit card the default and display appropriate elements for the selected payment option
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
 * Form validation
 * 
 */
const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const ccInput = document.querySelector('#cc-num');
const zipInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');

// Store validator functions in an object called `val`
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

// Create a listener to display or hide a real-time error message, to be used for all fields except email
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

// Create a listener to display or hide two different real-time error messages depending on type of error, to be used for email field
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

// Return true if all relevant fields are valid
function isValidForm() {
    if (paymentSelect.value === 'credit-card') {
        return val.isValidName(nameInput.value) &&
               val.isFormattedEmail(emailInput.value) &&
               val.isValidCCNum(ccInput.value) &&
               val.isValidZip(zipInput.value) &&
               val.isValidCVV(cvvInput.value) &&
               val.isAtLeastOneActivity();
    } else {
        return val.isValidName(nameInput.value) &&
               val.isFormattedEmail(emailInput.value) &&
               val.isAtLeastOneActivity();
    } 
}

nameInput.addEventListener('input', createListener(val.isValidName));
emailInput.addEventListener('input', createEmailListener(val.isFilledEmail, val.isFormattedEmail));
ccInput.addEventListener('input', createListener(val.isValidCCNum));
zipInput.addEventListener('input', createListener(val.isValidZip));
cvvInput.addEventListener('input', createListener(val.isValidCVV));

form.addEventListener('submit', e => {
    if (!isValidForm()) {
        e.preventDefault(); 
    }
});

// TO-DO: accessibility & readme