// Onglets dynamiques
const buttons = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.tab-content');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Supprimer active sur tous
    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.add('hidden'));

    // Ajouter active au bon bouton et afficher bon contenu
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.remove('hidden');
  });
});

// Menu burger mobile
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('men-toggle');
  const nav = document.getElementById('nav-links');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('show');
    });
  }
});

// PANIER LOCAL STORAGE
function getCart() {
  return JSON.parse(localStorage.getItem('panier')) || [];
}

function saveCart(cart) {
  localStorage.setItem('panier', JSON.stringify(cart));
}


function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(p => p.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({...product, qty: 1});
  }
  saveCart(cart);
  alert("Produit ajouté au panier !");
}

// BOUTIQUE — ajout au panier
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      id: button.dataset.id,
      name: button.dataset.name,
      price: parseFloat(button.dataset.price),
      image: button.dataset.image
    };
    addToCart(product);
  });
});

// PANIER — affichage dans panier.html
function displayCart() {
  const table = document.getElementById('cart-items');
  if (!table) return; // Ne rien faire si on n'est pas sur la page panier
  
  const total = document.getElementById('cart-total');
  let cart = JSON.parse(localStorage.getItem('panier')) || [];
  table.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    const price = parseFloat(item.price) || 0;
    const qty = parseInt(item.qty) || 1;
    const subtotal = price * qty;
    totalPrice += subtotal;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" style="height:50px;vertical-align:middle;"> ${item.name}</td>
      <td>${item.price.toFixed(2)} Fcfa</td>
      <td><input type="number" min="1" value="${item.qty}" data-index="${index}" class="qty-input" style="width:50px;"/></td>
      <td>${subtotal.toFixed(2)} Fcfa</td>
      <td><button class="remove-item" data-index="${index}">❌</button></td>
    `;
    table.appendChild(row);
  });

  total.textContent = `${totalPrice.toFixed(2)} Fcfa`;
}

// PANIER — mise à jour quantité & suppression
document.addEventListener('input', function(e) {
  if (e.target.classList.contains('qty-input')) {
    const cart = getCart();
    const index = e.target.dataset.index;
    cart[index].qty = parseInt(e.target.value) || 1;
    saveCart(cart);
    displayCart();
  }
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-item')) {
    let cart = getCart();
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    saveCart(cart);
    displayCart();
  }
});

// Charger automatiquement le panier si sur la page
document.addEventListener('DOMContentLoaded', displayCart);


// Témoignages Carousel automatique
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  const cards = Array.from(track.children);
  const prevButton = document.querySelector('.prev-btn');
  const nextButton = document.querySelector('.next-btn');
  let currentIndex = 0;

  function updateCarousel() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  function goToNextSlide() {
    currentIndex = (currentIndex + 1) % cards.length;
    updateCarousel();
  }

  function goToPrevSlide() {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateCarousel();
  }

  nextButton.addEventListener('click', goToNextSlide);
  prevButton.addEventListener('click', goToPrevSlide);

  // 🔁 Défilement automatique toutes les 5 secondes
  setInterval(goToNextSlide, 3000);

  // Mise à jour au redimensionnement
  window.addEventListener('resize', updateCarousel);

  // Initialisation au chargement
  updateCarousel();
});



