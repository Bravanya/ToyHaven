document.addEventListener('DOMContentLoaded', function () {

  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dot');
  var currentSlide = 0;

  function showSlide(index) {
    if (slides.length === 0) {
      return;
    }
    if (index >= slides.length) {
      index = 0;
    }
    if (index < 0) {
      index = slides.length - 1;
    }

    for (var i = 0; i < slides.length; i++) {
      slides[i].classList.remove('active');
      if (dots[i]) {
        dots[i].classList.remove('active');
      }
    }

    slides[index].classList.add('active');
    if (dots[index]) {
      dots[index].classList.add('active');
    }

    currentSlide = index;
  }

  if (slides.length > 0) {
    setInterval(function () {
      showSlide(currentSlide + 1);
    }, 4000);
  }

  for (var d = 0; d < dots.length; d++) {
    dots[d].addEventListener('click', function () {
      var dotIndex = 0;
      for (var j = 0; j < dots.length; j++) {
        if (dots[j] === this) {
          dotIndex = j;
          break;
        }
      }
      showSlide(dotIndex);
    });
  }

  var featuredContainer = document.getElementById('featured-products');

  if (!featuredContainer) {
    return;
  }

  var featuredProducts = [];
  for (var p = 0; p < PRODUCTS.length; p++) {
    if (PRODUCTS[p].featured === true) {
      featuredProducts.push(PRODUCTS[p]);
    }
  }

  for (var f = 0; f < featuredProducts.length; f++) {
    var product = featuredProducts[f];
    var card = createProductCard(product);
    featuredContainer.appendChild(card);
  }

});

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

  var price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = '$' + product.price.toFixed(2);

  var button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.textContent = 'Add to Cart';
  button.addEventListener('click', function () {
    addToCart(product.id, product.name);
  });

  body.appendChild(title);
  body.appendChild(price);
  body.appendChild(button);

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
    cart.push({ id: productId, quantity: 1 });
  }

  setStoredList('cart', cart);

  showToast(productName + ' added to cart!');
}

function showToast(message) {
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
