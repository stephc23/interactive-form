/*
Treehouse Techdegree:
FSJS Project 3 - Interactive Form
*/ 

// Set default focus state to name field
document.querySelector('#name').focus();

// Display 'Other job role' text field only when 'Other' is selected
const jobRoleSelect = document.querySelector('#title');
const otherJobInput = document.querySelector('#other-job-role');
otherJobInput.style.display = 'none';
jobRoleSelect.addEventListener('change', () => {
    if (jobRoleSelect.value === 'other') {
        otherJobInput.style.display = 'block';
    } else {
        otherJobInput.style.display = 'none';
    }
});


