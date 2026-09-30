document.addEventListener('DOMContentLoaded', function () {

  var form = document.getElementById('feedback-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      handleSubmit();
    });
  }

  setupAccordion();

});

function clearErrors() {
  var errorFields = document.querySelectorAll('.error-text');
  for (var i = 0; i < errorFields.length; i++) {
    errorFields[i].textContent = '';
  }

  var inputs = document.querySelectorAll('.input-error');
  for (var j = 0; j < inputs.length; j++) {
    inputs[j].classList.remove('input-error');
  }
}

function showError(fieldId, errorId, message) {
  var field = document.getElementById(fieldId);
  var errorEl = document.getElementById(errorId);

  if (field) {
    field.classList.add('input-error');
  }
  if (errorEl) {
    errorEl.textContent = message;
  }
}

function isValidEmail(email) {
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validateForm() {
  clearErrors();
  var isValid = true;

  var name = document.getElementById('name').value.trim();
  var email = document.getElementById('email').value.trim();
  var message = document.getElementById('message').value.trim();

  if (name === '') {
    showError('name', 'error-name', 'Name is required.');
    isValid = false;
  }

  if (email === '') {
    showError('email', 'error-email', 'Email is required.');
    isValid = false;
  } else if (isValidEmail(email) === false) {
    showError('email', 'error-email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (message === '') {
    showError('message', 'error-message', 'Message is required.');
    isValid = false;
  }

  return isValid;
}

function saveFeedback(entry) {
  var list = getStoredList('feedbackList');
  list.push(entry);
  setStoredList('feedbackList', list);
}

function handleSubmit() {
  if (validateForm() === false) {
    return;
  }

  var entry = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
    date: new Date().toISOString()
  };

  saveFeedback(entry);

  document.getElementById('feedback-form').hidden = true;
  document.getElementById('success-message').hidden = false;
}

function setupAccordion() {
  var questions = document.querySelectorAll('.accordion-question');

  for (var i = 0; i < questions.length; i++) {
    questions[i].addEventListener('click', function () {
      var item = this.parentElement;
      var icon = this.querySelector('.accordion-icon');

      var isOpen = item.classList.contains('open');
      if (isOpen) {
        item.classList.remove('open');
        if (icon) {
          icon.textContent = '+';
        }
      } else {
        item.classList.add('open');
        if (icon) {
          icon.textContent = '-';
        }
      }
    });
  }
}
