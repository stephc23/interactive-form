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
    const selectedTheme = e.target.value;
    for (let i = 0; i < colorOptions.length; i++) {
        let option = colorOptions[i];
        let prevOption = colorOptions[i - 1];
        if (option.dataset.theme === selectedTheme) {
            option.hidden = false;
            if (option.dataset.theme !== prevOption.dataset.theme) { // Display the first color option of the selected design
                option.selected = true;
            }
        } else {
            option.hidden = true;
        }
    }
});

