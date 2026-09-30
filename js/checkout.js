document.addEventListener('DOMContentLoaded', function () {

  renderOrderSummary();

  var form = document.getElementById('checkout-form');
  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      handleSubmit();
    });
  }

});

function getCart() {
  return getStoredList('cart');
}

function findProductById(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) {
      return PRODUCTS[i];
    }
  }
  return null;
}

function calculateTotal(cart) {
  var total = 0;
  for (var i = 0; i < cart.length; i++) {
    var product = findProductById(cart[i].id);
    if (product !== null) {
      total = total + (product.price * cart[i].quantity);
    }
  }
  return total;
}

function renderOrderSummary() {
  var cart = getCart();
  var itemsList = document.getElementById('summary-items');
  var totalElement = document.getElementById('summary-total');
  var checkoutContent = document.getElementById('checkout-content');
  var emptyCheckout = document.getElementById('empty-checkout');

  if (!checkoutContent || !emptyCheckout || !itemsList) {
    return;
  }

  if (cart.length === 0) {
    checkoutContent.hidden = true;
    emptyCheckout.hidden = false;
    return;
  }

  checkoutContent.hidden = false;
  emptyCheckout.hidden = true;
  itemsList.innerHTML = '';

  var shownItems = 0;
  for (var i = 0; i < cart.length; i++) {
    var product = findProductById(cart[i].id);
    if (product === null) {
      continue;
    }

    var subtotal = product.price * cart[i].quantity;

    var li = document.createElement('li');

    var nameSpan = document.createElement('span');
    nameSpan.className = 'summary-item-name';
    nameSpan.textContent = product.name;

    var qtySpan = document.createElement('span');
    qtySpan.className = 'summary-item-qty';
    qtySpan.textContent = 'x' + cart[i].quantity;

    var priceSpan = document.createElement('span');
    priceSpan.className = 'summary-item-price';
    priceSpan.textContent = '$' + subtotal.toFixed(2);

    li.appendChild(nameSpan);
    li.appendChild(qtySpan);
    li.appendChild(priceSpan);
    itemsList.appendChild(li);
    shownItems = shownItems + 1;
  }

  if (shownItems === 0) {
    checkoutContent.hidden = true;
    emptyCheckout.hidden = false;
    return;
  }

  var total = calculateTotal(cart);
  totalElement.textContent = '$' + total.toFixed(2);
}

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

function getPaymentMethod() {
  var radios = document.querySelectorAll('input[name="paymentMethod"]');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return '';
}

function validateForm() {
  clearErrors();
  var isValid = true;

  var fullName = document.getElementById('full-name').value.trim();
  var email = document.getElementById('email').value.trim();
  var address = document.getElementById('address').value.trim();
  var paymentMethod = getPaymentMethod();

  if (fullName === '') {
    showError('full-name', 'error-full-name', 'Full name is required.');
    isValid = false;
  }

  if (email === '') {
    showError('email', 'error-email', 'Email is required.');
    isValid = false;
  } else if (isValidEmail(email) === false) {
    showError('email', 'error-email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (address === '') {
    showError('address', 'error-address', 'Delivery address is required.');
    isValid = false;
  }

  if (paymentMethod === '') {
    showError('', 'error-payment', 'Please select a payment method.');
    isValid = false;
  }

  return isValid;
}

function buildOrder(fullName, email, address, paymentMethod) {
  var cart = getCart();
  var items = [];

  for (var i = 0; i < cart.length; i++) {
    var product = findProductById(cart[i].id);
    if (product !== null) {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: cart[i].quantity,
        subtotal: product.price * cart[i].quantity
      });
    }
  }

  return {
    date: new Date().toISOString(),
    fullName: fullName,
    email: email,
    address: address,
    paymentMethod: paymentMethod,
    items: items,
    total: calculateTotal(cart)
  };
}

function saveOrder(order) {
  var history = getStoredList('orderHistory');
  history.push(order);
  setStoredList('orderHistory', history);
}

function handleSubmit() {
  if (validateForm() === false) {
    return;
  }

  var cart = getCart();
  if (cart.length === 0) {
    return;
  }

  var fullName = document.getElementById('full-name').value.trim();
  var email = document.getElementById('email').value.trim();
  var address = document.getElementById('address').value.trim();
  var paymentMethod = getPaymentMethod();

  var order = buildOrder(fullName, email, address, paymentMethod);
  saveOrder(order);

  setStoredList('cart', []);

  document.getElementById('checkout-content').hidden = true;
  document.getElementById('success-message').hidden = false;
}
