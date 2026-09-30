document.addEventListener('DOMContentLoaded', function () {

  renderCart();

  var clearBtn = document.getElementById('clear-cart-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', clearCart);
  }

});

function getCart() {
  return getStoredList('cart');
}

function saveCart(cart) {
  setStoredList('cart', cart);
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

function updateQuantity(productId, change) {
  var cart = getCart();

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      cart[i].quantity = cart[i].quantity + change;

      if (cart[i].quantity <= 0) {
        cart.splice(i, 1);
      }
      break;
    }
  }

  saveCart(cart);
  renderCart();
}

function renderCart() {
  var cart = getCart();
  var itemsContainer = document.getElementById('cart-items');
  var totalElement = document.getElementById('cart-total');
  var emptyCart = document.getElementById('empty-cart');
  var cartContent = document.getElementById('cart-content');

  if (!itemsContainer) {
    return;
  }

  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    emptyCart.hidden = false;
    cartContent.hidden = true;
    return;
  }

  emptyCart.hidden = true;
  cartContent.hidden = false;

  var shownItems = 0;
  for (var i = 0; i < cart.length; i++) {
    var cartItem = cart[i];
    var product = findProductById(cartItem.id);

    if (product === null) {
      continue;
    }

    var subtotal = product.price * cartItem.quantity;
    var row = createCartItemRow(product, cartItem.quantity, subtotal);
    itemsContainer.appendChild(row);
    shownItems = shownItems + 1;
  }

  if (shownItems === 0) {
    emptyCart.hidden = false;
    cartContent.hidden = true;
    return;
  }

  var total = calculateTotal(cart);
  totalElement.textContent = '$' + total.toFixed(2);
}

function createCartItemRow(product, quantity, subtotal) {
  var row = document.createElement('div');
  row.className = 'cart-item';

  var img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name + ' product image';

  var details = document.createElement('div');
  details.className = 'cart-item-details';

  var name = document.createElement('h3');
  name.textContent = product.name;

  var unitPrice = document.createElement('p');
  unitPrice.className = 'cart-item-price';
  unitPrice.textContent = '$' + product.price.toFixed(2) + ' each';

  details.appendChild(name);
  details.appendChild(unitPrice);

  var qtyControls = document.createElement('div');
  qtyControls.className = 'quantity-controls';

  var minusBtn = document.createElement('button');
  minusBtn.className = 'qty-btn';
  minusBtn.type = 'button';
  minusBtn.textContent = '-';
  minusBtn.setAttribute('aria-label', 'Decrease quantity');
  minusBtn.addEventListener('click', function () {
    updateQuantity(product.id, -1);
  });

  var qtyDisplay = document.createElement('span');
  qtyDisplay.className = 'qty-value';
  qtyDisplay.textContent = quantity;

  var plusBtn = document.createElement('button');
  plusBtn.className = 'qty-btn';
  plusBtn.type = 'button';
  plusBtn.textContent = '+';
  plusBtn.setAttribute('aria-label', 'Increase quantity');
  plusBtn.addEventListener('click', function () {
    updateQuantity(product.id, 1);
  });

  qtyControls.appendChild(minusBtn);
  qtyControls.appendChild(qtyDisplay);
  qtyControls.appendChild(plusBtn);

  var subtotalEl = document.createElement('p');
  subtotalEl.className = 'cart-item-subtotal';
  subtotalEl.textContent = '$' + subtotal.toFixed(2);

  row.appendChild(img);
  row.appendChild(details);
  row.appendChild(qtyControls);
  row.appendChild(subtotalEl);

  return row;
}

function clearCart() {
  var confirmed = confirm('Are you sure you want to clear your cart?');
  if (confirmed) {
    saveCart([]);
    renderCart();
  }
}
