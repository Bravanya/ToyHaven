document.addEventListener('DOMContentLoaded', function () {
  setupNav();
  setupNewsletter();
  registerServiceWorker();
});

function setupNav() {
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (!navToggle || !navMenu) {
    return;
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.classList.toggle('is-open');
    navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  var navLinks = navMenu.querySelectorAll('a');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
      navToggle.classList.remove('is-open');
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      navToggle.classList.remove('is-open');
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

function setupNewsletter() {
  var forms = document.querySelectorAll('.newsletter-form');
  for (var i = 0; i < forms.length; i++) {
    forms[i].addEventListener('submit', function (event) {
      event.preventDefault();
      var input = this.querySelector('input[type="email"]');
      if (input) {
        input.value = '';
        input.placeholder = 'Thanks for subscribing!';
      }
    });
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(function () {
        console.log('Service worker registered.');
      })
      .catch(function (error) {
        console.log('Service worker registration failed:', error);
      });
  }
}
