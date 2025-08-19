// Product data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        description: "Premium quality wireless headphones with noise cancellation",
        price: 99.99,
        image: "images/headphones.jpg",
        featured: true,
        reviews: [
            { rating: 5, text: "Amazing sound quality!" },
            { rating: 4, text: "Good battery life, comfortable to wear." }
        ]
    },
    {
        id: 2,
        name: "Smart Watch",
        description: "Feature-rich smartwatch with health tracking",
        price: 249.99,
        image: "images/smartwatch.jpg",
        featured: true,
        reviews: [
            { rating: 5, text: "Perfect for fitness tracking!" },
            { rating: 5, text: "Great battery life and features." }
        ]
    },
    {
        id: 3,
        name: "Laptop Backpack",
        description: "Durable laptop backpack with multiple compartments",
        price: 59.99,
        image: "images/backpack.jpg",
        featured: false,
        reviews: [
            { rating: 4, text: "Very spacious and comfortable." }
        ]
    },
    {
        id: 4,
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with powerful bass",
        price: 79.99,
        image: "images/speaker.jpg",
        featured: true,
        reviews: [
            { rating: 5, text: "Incredible sound for the size!" }
        ]
    },
    {
        id: 5,
        name: "USB-C Hub",
        description: "7-in-1 USB-C hub for all your connectivity needs",
        price: 39.99,
        image: "images/usbhub.jpg",
        featured: false,
        reviews: [
            { rating: 4, text: "Very useful for my MacBook." }
        ]
    },
    {
        id: 6,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking",
        price: 29.99,
        image: "images/mouse.jpg",
        featured: false,
        reviews: [
            { rating: 5, text: "Smooth and responsive!" }
        ]
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartCount = document.getElementById('cartCount');
const cartToggle = document.getElementById('cartToggle');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Load products based on page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        loadFeaturedProducts();
    } else if (window.location.pathname.includes('product.html')) {
        loadAllProducts();
    } else if (window.location.pathname.includes('cart.html')) {
        displayCartPage();
    }
    
    // Cart sidebar functionality
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            updateCartSidebar();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !cartToggle.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
});

// Load featured products
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    const featuredProducts = products.filter(p => p.featured);
    featuredContainer.innerHTML = featuredProducts.map(product => createProductCard(product)).join('');
}

// Load all products
function loadAllProducts() {
    const allProductsContainer = document.getElementById('allProducts');
    if (!allProductsContainer) return;
    
    allProductsContainer.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" onclick="showProductDetail(${product.id})">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=${encodeURIComponent(product.name)}'">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Show product detail modal
function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    if (!modal) return;
    
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').onerror = function() {
        this.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`;
    };
    document.getElementById('modalTitle').textContent = product.name;
    document.getElementById('modalDescription').textContent = product.description;
    document.getElementById('modalPrice').textContent = `$${product.price.toFixed(2)}`;
    
    // Load reviews
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
        reviewsList.innerHTML = product.reviews.map(review => `
            <div class="review">
                <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                <p class="review-text">${review.text}</p>
            </div>
        `).join('');
    }
    
    // Update add to cart button
    const modalAddBtn = document.getElementById('modalAddToCart');
    if (modalAddBtn) {
        modalAddBtn.onclick = () => {
            addToCart(productId);
            modal.style.display = 'none';
        };
    }
    
    modal.style.display = 'block';
    
    // Close modal functionality
    const closeModal = document.getElementById('closeModal');
    if (closeModal) {
        closeModal.onclick = () => {
            modal.style.display = 'none';
        };
    }
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    
    // Animate button
    event.target.classList.add('added');
    event.target.textContent = 'Added!';
    setTimeout(() => {
        event.target.classList.remove('added');
        event.target.textContent = 'Add to Cart';
    }, 1000);
    
    // Show cart sidebar briefly
    cartSidebar.classList.add('active');
    updateCartSidebar();
    setTimeout(() => {
        cartSidebar.classList.remove('active');
    }, 2000);
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Update cart sidebar
function updateCartSidebar() {
    const sidebarCartItems = document.getElementById('sidebarCartItems');
    if (!sidebarCartItems) return;
    
    if (cart.length === 0) {
        sidebarCartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        updateSidebarTotals(0, 0, 0);
        return;
    }
    
    sidebarCartItems.innerHTML = cart.map(item => `
        <div class="sidebar-cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60x60?text=${encodeURIComponent(item.name)}'">
            <div class="sidebar-item-details">
                <div class="sidebar-item-title">${item.name}</div>
                <div class="sidebar-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
        </div>
    `).join('');
    
    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    
    updateSidebarTotals(subtotal, gst, total);
}

// Update sidebar totals
function updateSidebarTotals(subtotal, gst, total) {
    const sidebarSubtotal = document.getElementById('sidebarSubtotal');
    const sidebarGST = document.getElementById('sidebarGST');
    const sidebarTotal = document.getElementById('sidebarTotal');
    
    if (sidebarSubtotal) sidebarSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (sidebarGST) sidebarGST.textContent = `$${gst.toFixed(2)}`;
    if (sidebarTotal) sidebarTotal.textContent = `$${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        if (confirm('Remove this item from cart?')) {
            removeFromCart(productId);
        } else {
            item.quantity = 1;
        }
    } else {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSidebar();
        if (window.location.pathname.includes('cart.html')) {
            displayCartPage();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    if (confirm('Are you sure you want to remove this item?')) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        updateCartSidebar();
        if (window.location.pathname.includes('cart.html')) {
            displayCartPage();
        }
    }
}

// Display cart page
function displayCartPage() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        document.querySelector('.cart-summary-box').style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }
    
    cartItemsList.style.display = 'block';
    document.querySelector('.cart-summary-box').style.display = 'block';
    if (emptyCart) emptyCart.style.display = 'none';
    
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=${encodeURIComponent(item.name)}'">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.name}</h3>
                <p>${item.description}</p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div>
                <p><strong>Total: $${(item.price * item.quantity).toFixed(2)}</strong></p>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    // Update summary
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    
    document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cartGST').textContent = `$${gst.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}


// Checkout functionality
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty! Please add items before checking out.');
        return;
    }

    // Simulate checkout process
    const confirmation = confirm('Are you sure you want to proceed with checkout?');
    if (confirmation) {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        updateCartSidebar();
        if (window.location.pathname.includes('cart.html')) {
            displayCartPage();
        }

        // Show success message
        alert('Thank you for your purchase! Your order has been placed successfully.');
        
        // Redirect to homepage
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// Add event listener for checkout button
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});

// Add this at the end of script.js

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // Simulate form submission
            console.log('Form submitted:', { name, email, subject, message });
            
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            contactForm.reset();
        });
    }
});