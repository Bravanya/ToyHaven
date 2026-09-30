var currentCategory = 'All';
var currentSearch = '';

document.addEventListener('DOMContentLoaded', function () {

  renderProducts();

  var filterButtons = document.querySelectorAll('.filter-btn');

  for (var i = 0; i < filterButtons.length; i++) {

    filterButtons[i].addEventListener('click', function () {

      for (var j = 0; j < filterButtons.length; j++) {
        filterButtons[j].classList.remove('active');
      }

      this.classList.add('active');

      currentCategory = this.getAttribute('data-category');

      renderProducts();

    });
  }

  var searchInput = document.getElementById('search-input');

  if (searchInput) {

    searchInput.addEventListener('input', function () {

      currentSearch = this.value.toLowerCase();

      renderProducts();

    });
  }

});


function getFilteredProducts() {

  var result = [];

  for (var i = 0; i < PRODUCTS.length; i++) {

    var product = PRODUCTS[i];

    var categoryMatch =
      (currentCategory === 'All') ||
      (product.category === currentCategory);

    var searchMatch = true;

    if (currentSearch.length > 0) {

      searchMatch =
        product.name.toLowerCase().indexOf(currentSearch) !== -1;

    }

    if (categoryMatch && searchMatch) {

      result.push(product);

    }

  }

  return result;

}


function renderProducts() {

  var grid = document.getElementById('products-grid');

  var noResults = document.getElementById('no-results');

  if (!grid) {
    return;
  }

  grid.innerHTML = '';

  var filtered = getFilteredProducts();

  if (filtered.length === 0) {

    if (noResults) {
      noResults.hidden = false;
    }

  } else {

    if (noResults) {
      noResults.hidden = true;
    }

  }

  for (var i = 0; i < filtered.length; i++) {

    var card = createProductCard(filtered[i]);

    grid.appendChild(card);

  }

}


function createProductCard(product) {

  var card = document.createElement('div');

  card.className = 'product-card';


  var img = document.createElement('img');

  img.src = product.image;

  img.alt = product.name + ' - ' + product.category;


  var body = document.createElement('div');

  body.className = 'product-card-body';


  var title = document.createElement('h3');

  title.textContent = product.name;


  var category = document.createElement('span');

  category.className = 'product-category';

  category.textContent = product.category;


  var price = document.createElement('p');

  price.className = 'product-price';

  price.textContent = '$' + product.price.toFixed(2);


  var cartButton = document.createElement('button');

  cartButton.className = 'btn btn-primary';

  cartButton.textContent = 'Add to Cart';

  cartButton.addEventListener('click', function () {

    addToCart(product.id, product.name);

  });


  var wishlistButton = document.createElement('button');

  wishlistButton.className = 'btn btn-secondary';

  wishlistButton.textContent = 'Add to Wishlist';

  wishlistButton.addEventListener('click', function () {

    addToWishlist(product.id, product.name);

  });


  body.appendChild(title);

  body.appendChild(category);

  body.appendChild(price);

  body.appendChild(cartButton);

  body.appendChild(wishlistButton);


  card.appendChild(img);

  card.appendChild(body);


  return card;

}


function addToCart(productId, productName) {

  var cart = getStoredList('cart');

  var found = false;


  for (var i = 0; i < cart.length; i++) {

    if (cart[i].id === productId) {

      cart[i].quantity = cart[i].quantity + 1;

      found = true;

      break;

    }

  }


  if (found === false) {

    cart.push({
      id: productId,
      quantity: 1
    });

  }


  setStoredList('cart', cart);


  showCartToast(productName + ' added to cart!');

}


function addToWishlist(productId, productName) {

  var wishlist = getStoredList('wishlist');


  for (var i = 0; i < wishlist.length; i++) {

    if (wishlist[i].id === productId) {


      /*

        If the product was previously marked

        as Not Interested, add it back as Interested.

      */

      if (wishlist[i].status === 'Not Interested') {

        wishlist[i].status = 'Interested';

        setStoredList('wishlist', wishlist);

        showCartToast(productName + ' added to wishlist!');

        return;

      }


      /*

        If the product is already Interested

        or Owned, do not add it again.

      */

      if (
        wishlist[i].status === 'Interested' ||
        wishlist[i].status === 'Owned'
      ) {

        showCartToast(
          productName + ' is already in your wishlist.'
        );

        return;

      }

    }

  }


  /*

    Product does not exist in the wishlist,

    so add it as Interested.

  */

  wishlist.push({

    id: productId,

    status: 'Interested'

  });


  setStoredList('wishlist', wishlist);


  showCartToast(productName + ' added to wishlist!');

}


function showCartToast(message) {

  var toast = document.getElementById('cart-toast');

  if (!toast) {

    return;

  }


  toast.textContent = message;

  toast.hidden = false;


  setTimeout(function () {

    toast.hidden = true;

  }, 2500);

}