document.addEventListener('DOMContentLoaded', () => {

  // ----------------- CART & PRODUCT STORAGE -----------------
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  let products = JSON.parse(localStorage.getItem('products') || '[]');

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
  }

  // ----------------- ADD TO CART -----------------
  function addToCart(name, price) {
    price = Number(price.toString().replace(/[^0-9.]/g, ''));
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.quantity += 1;
      existing.subtotal = existing.quantity * existing.price;
    } else {
      cart.push({ name, price, quantity: 1, subtotal: price });
    }

    saveCart();
    localStorage.setItem('cartMessage', 'Added to cart successfully!');
    window.location.href = 'cart.html';
  }

  // ----------------- SHOW ADD TO CART MESSAGE -----------------
  const message = localStorage.getItem('cartMessage');
  if (message) {
    alert(message);
    localStorage.removeItem('cartMessage');
  }

  // ----------------- UPDATE CART DISPLAY -----------------
  function updateCartDisplay() {
    const cartTableBody = document.querySelector('.cart tbody');
    const cartTotal = document.querySelector('.cart tfoot strong');
    if (!cartTableBody || !cartTotal) return;

    cartTableBody.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
      item.price = Number(item.price);
      item.quantity = Number(item.quantity);
      item.subtotal = item.price * item.quantity;

      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>₹${item.subtotal}</td>
      `;
      cartTableBody.appendChild(row);
      total += item.subtotal;
    });

    cartTotal.textContent = `₹${total}`;
  }

  // Update cart if on cart.html
  if (window.location.pathname.includes('cart.html')) {
    updateCartDisplay();
  }

  // ----------------- PRODUCT DISPLAY (products.html) -----------------
  function renderProducts() {
    const container = document.querySelector('.product-container');
    if (!container) return;

    container.innerHTML = '';

    const allProducts = [
      ...products,
      {
        name: 'Traditional Indian Thali',
        price: 499,
        image: 'assests/images/thali.jpeg'
      },
      {
        name: 'South Indian Feast',
        price: 399,
        image: 'assests/images/south indian.jpeg'
      },
      {
        name: 'North Indian Meal',
        price: 549,
        image: 'assests/images/north indian.jpg'
      },
      {
        name: 'Wedding Catering',
        price: 999,
        image: 'assests/images/wedding.jpg'
      }
    ];

    allProducts.forEach(p => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.innerHTML = `
        <img src="${p.image || 'default.jpg'}" alt="${p.name}">
        <h3>${p.name}</h3>
        <p class="price">₹${p.price}</p>
        <button>Add to Cart</button>
      `;
      container.appendChild(card);
    });

    // Add event listeners
    document.querySelectorAll('.product-card button').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.parentElement;
        const name = card.querySelector('h3').innerText;
        const price = card.querySelector('.price').innerText;
        addToCart(name, price);
      });
    });
  }

  if (window.location.pathname.includes('products.html')) {
    renderProducts();
  }

  // ----------------- UPLOAD PRODUCT -----------------
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.getElementById('productName').value.trim();
      const price = document.getElementById('productPrice').value.trim();
      const imageInput = document.getElementById('productImage');

      if (!name || !price) {
        alert('Please enter all product details.');
        return;
      }

      let imageURL = '';
      if (imageInput && imageInput.files.length > 0) {
        const file = imageInput.files[0];
        imageURL = URL.createObjectURL(file);
      }

      products.push({ name, price: Number(price), image: imageURL });
      saveProducts();

      alert('✅ Product uploaded successfully!');
      uploadForm.reset();
      window.location.href = 'products.html';
    });
  }

  // ----------------- PLACE ORDER BUTTON -----------------
  const placeOrderBtn = document.querySelector('.place-order');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('🛒 Your cart is empty. Please add items before placing an order.');
        return;
      }

      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const newOrder = {
        id: Date.now(),
        items: cart,
        date: new Date().toLocaleString(),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      };
      orders.push(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));

      localStorage.removeItem('cart');

      alert('✅ Order placed successfully! Thank you for ordering with us.');
      window.location.href = 'place-order.html';
    });
  }

  // ----------------- AUTH LOGIC -----------------
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', e => {
      e.preventDefault();
      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;

      if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill all fields');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      let users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
      }

      users.push({ fullName, email, password });
      localStorage.setItem('users', JSON.stringify(users));
      alert('Registration successful!');
      registerForm.reset();
      window.location.href = 'login.html';
    });
  }

  // ----------------- LOGIN -----------------
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      let users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        alert('Login successful!');
        window.location.href = 'index.html';
      } else {
        alert('Invalid email or password');
      }
    });
  }

    // ----------------- SHOW ORDER SUMMARY (place-order.html) -----------------
  if (window.location.pathname.includes('place-order.html')) {
    const orderTableBody = document.querySelector('.cart tbody');
    const orderTableFoot = document.querySelector('.cart tfoot tr td strong');

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length === 0) {
      orderTableBody.innerHTML = '<tr><td colspan="4">No order found.</td></tr>';
      if (orderTableFoot) orderTableFoot.textContent = '₹0';
      return;
    }

    // Get the most recent order
    const lastOrder = orders[orders.length - 1];
    orderTableBody.innerHTML = '';
    let total = 0;

    lastOrder.items.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.name}</td>
        <td>₹${item.price}</td>
        <td>${item.quantity}</td>
        <td>₹${item.subtotal}</td>
      `;
      orderTableBody.appendChild(row);
      total += item.subtotal;
    });

    if (orderTableFoot) {
      orderTableFoot.textContent = `₹${total}`;
    }

    // Add optional info below the table
    const summaryInfo = document.createElement('div');
    summaryInfo.classList.add('order-info');
    summaryInfo.innerHTML = `
      <p><strong>Order ID:</strong> ${lastOrder.id}</p>

      <p><strong>Date:</strong> ${lastOrder.date}</p>

      <p><strong>Total Amount:</strong> ₹${lastOrder.total}</p>
      
      <p><strong>Status:</strong> Confirmed ✅</p>
    `;
    document.querySelector('.cart').appendChild(summaryInfo);
  }


});
