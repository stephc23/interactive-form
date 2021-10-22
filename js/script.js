/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/ 

/* 
Set default focus state to `Name` field
*/
document.querySelector('#name').focus();

/* 
In `Job Role` drop down menu, display `Other job role` text field only when `Other` has been selected
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
In `T-Shirt Info` section, enable color drop down menu only when design has been selected, and display available colors
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
            if (option.dataset.theme !== prevOption.dataset.theme) { // Display the first color option of the selected design
                option.selected = true;
            }
        } else {
            option.hidden = true;
        }
    }
});

/*
In the `Register for Activities` section, set up `Total` to reflect the total cost of selected activities and disable conflicting activities
*/
const activitiesDiv = document.querySelector('#activities-box');
const activitiesLabels = activitiesDiv.children;
const activitiesCostP = document.querySelector('#activities-cost');

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
In `Payment Info` section, make credit card the default and display appropriate elements for the selected payment option
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
        if (selectedOption === payment) {
            paymentDiv.style.display = 'block';
        } else {
            paymentDiv.style.display = 'none';
        }
    }
});

/*
Form validation
*/
const form = document.querySelector('form');
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const ccNumInput = document.querySelector('#cc-num');
const zipInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');

function isValidName(name) {
    if (name === '' || /^\s+$/.test(name)) {
        return false;
    } else {
        return true;
    }
}

function isValidEmail(email) {
    return /^[^@]+@[^@.]+\.[a-z]+$/i.test(email);
}

function isAtLeastOneActivity() {
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

function isValidCCNum(ccNum) {
    return /^\d{13,16}$/.test(ccNum);
}

function isValidZip(zip) {
    return /^\d{5}$/.test(zip);
}

function isValidCVV(cvv) {
    return /^\d{3}$/.test(cvv);
}





// form.addEventListener('submit', e => {
//     e.preventDefault();
// });