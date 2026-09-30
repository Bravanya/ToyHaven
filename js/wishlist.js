document.addEventListener('DOMContentLoaded', function () {

  renderWishlist();

});

function getWishlist() {
  return getStoredList('wishlist');
}

function saveWishlist(wishlist) {
  setStoredList('wishlist', wishlist);
}

function findProductById(id) {
  for (var i = 0; i < PRODUCTS.length; i++) {
    if (PRODUCTS[i].id === id) {
      return PRODUCTS[i];
    }
  }
  return null;
}

function updateStatus(productId, newStatus) {
  var wishlist = getWishlist();

  for (var i = 0; i < wishlist.length; i++) {
    if (wishlist[i].id === productId) {
      wishlist[i].status = newStatus;
      break;
    }
  }

  saveWishlist(wishlist);

  renderWishlist();
}

function renderWishlist() {
  var wishlist = getWishlist();
  var grid = document.getElementById('wishlist-grid');
  var emptyMessage = document.getElementById('empty-wishlist');

  if (!grid) {
    return;
  }

  grid.innerHTML = '';

  var shownItems = 0;

  for (var i = 0; i < wishlist.length; i++) {

    var item = wishlist[i];

    if (item.status === 'Not Interested') {
      continue;
    }

    var product = findProductById(item.id);

    if (product === null) {
      continue;
    }

    var card = createWishlistCard(product, item.status);
    grid.appendChild(card);

    shownItems = shownItems + 1;
  }

  if (shownItems === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }
}

function createWishlistCard(product, status) {
  var card = document.createElement('div');
  card.className = 'wishlist-card';

  var img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name + ' - ' + product.category;

  var body = document.createElement('div');
  body.className = 'wishlist-card-body';

  var title = document.createElement('h3');
  title.textContent = product.name;

  var label = document.createElement('label');
  label.className = 'status-label';
  label.textContent = 'Status';
  label.setAttribute('for', 'status-' + product.id);

  var select = document.createElement('select');
  select.className = 'status-select';
  select.id = 'status-' + product.id;

  var statuses = ['Interested', 'Owned', 'Not Interested'];

  for (var i = 0; i < statuses.length; i++) {

    var option = document.createElement('option');

    option.value = statuses[i];
    option.textContent = statuses[i];

    if (statuses[i] === status) {
      option.selected = true;
    }

    select.appendChild(option);
  }

  select.addEventListener('change', function () {
    updateStatus(product.id, this.value);
  });

  body.appendChild(title);
  body.appendChild(label);
  body.appendChild(select);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}