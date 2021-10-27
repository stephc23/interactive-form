# interactive-form
 Treehouse Techdegree Project 3 enhances an interactive registration form by adding conditional behavior and validating user input.

## Features

#### Real-time error message
* The program validates user input in real time as the user interacts with a field.
* This is achieved by adding an event listener to each input element, or, in the case of activities, to the 'activities-box' div.
* An error message is displayed or hidden when the 'input' event occurs.
* Real-time error messages are provided for the name, email, activities, card number, zip code, and cvv fields.

#### Conditional error message
* The real-time error message that displays differs depending on the nature of the invalid user input.
    * If a field is left blank, the error message indicates that the field cannot be blank.
    * If a field is filled but formatted incorrectly, the error message references the required format.
* Two validators are created for each field, one checking that it is not blank and another checking that it is formatted correctly.
* The listener function returned by `createListener` checks input values using these validators and uses the results as conditions in a conditional statement.
* Conditional error messages are provided for the email, card number, zip code, and cvv fields. 