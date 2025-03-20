// js/default.js

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Fetch questions from the REST endpoint
    const response = await fetch('https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d');
    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }
    const questions = await response.json();

    // Render the form
    const form = renderForm(questions);
    document.body.appendChild(form);

    // Add form submission handler
    form.addEventListener('submit', handleFormSubmit);
  } catch (error) {
    console.error('Error:', error);
  }
});

function renderForm(questions) {
  const form = document.createElement('form');
  form.setAttribute('novalidate', true); // Disable browser default validation

  questions.forEach(question => {
    const fieldset = document.createElement('div');
    fieldset.classList.add('form-field');

    if (question.type === 'radio') {
      // Render radio buttons
      const legend = document.createElement('legend');
      legend.textContent = question.legend;
      fieldset.appendChild(legend);

      question.options.forEach(option => {
        const radioWrapper = document.createElement('div');
        const radioInput = document.createElement('input');
        radioInput.type = 'radio';
        radioInput.id = option.id;
        radioInput.name = question.name;
        radioInput.value = option.value;
        radioInput.required = question.required;

        const radioLabel = document.createElement('label');
        radioLabel.setAttribute('for', option.id);
        radioLabel.textContent = option.label;

        radioWrapper.appendChild(radioInput);
        radioWrapper.appendChild(radioLabel);
        fieldset.appendChild(radioWrapper);
      });
    } else {
      // Render other input types
      const label = document.createElement('label');
      label.setAttribute('for', question.id);
      label.textContent = question.label;

      const input = document.createElement('input');
      input.id = question.id;
      input.name = question.name;
      input.type = question.type;
      input.required = question.required;

      if (question.pattern) {
        input.pattern = question.pattern;
      }

      // Add validation event listeners
      input.addEventListener('blur', () => validateInput(input));
      input.addEventListener('input', () => validateInput(input));

      fieldset.appendChild(label);
      fieldset.appendChild(input);
    }

    form.appendChild(fieldset);
  });

  // Add submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Submit';
  form.appendChild(submitButton);

  return form;
}

function validateInput(input) {
  if (input.validity.valid) {
    input.setAttribute('aria-invalid', 'false');
    input.removeAttribute('aria-describedby');
  } else {
    input.setAttribute('aria-invalid', 'true');
    const errorId = `${input.id}-error`;
    input.setAttribute('aria-describedby', errorId);

    let errorMessage = '';
    if (input.validity.valueMissing) {
      errorMessage = 'This field is required.';
    } else if (input.validity.patternMismatch) {
      errorMessage = 'Please match the requested format.';
    }

    let errorElement = document.getElementById(errorId);
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.id = errorId;
      errorElement.classList.add('error-message');
      input.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = errorMessage;
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const inputs = Array.from(form.elements).filter(element => element.tagName === 'INPUT');

  // Validate all inputs
  inputs.forEach(input => validateInput(input));

  // Check if the form is valid
  const isFormValid = inputs.every(input => input.validity.valid);
  if (!isFormValid) {
    alert('Please correct the errors in the form.');
    return;
  }

  // Prepare submission data
  const submissionData = inputs.map(input => ({
    name: input.name,
    value: input.type === 'radio' ? (form.elements[input.name].value || '') : input.value,
  }));

  try {
    // Submit the form data
    const response = await fetch('https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    alert('Form submitted successfully!');
  } catch (error) {
    console.error('Submission error:', error);
    alert('There was an error submitting the form. Please try again.');
  }
}