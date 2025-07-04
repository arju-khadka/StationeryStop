// Mobile menu functionality
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar){
    bar.addEventListener('click', () =>{
        nav.classList.add('active');
    })
}

if (close){
    close.addEventListener('click', () =>{
        nav.classList.remove('active');
    })
}

// Cart functionality
const API_BASE_URL = 'http://localhost:3000/api';

// Add to cart function
async function addToCart(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            alert('Product added to cart successfully!');
            updateCartCount();
        } else {
            alert('Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart');
    }
}

// Update cart count in header
async function updateCartCount() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`);
        if (response.ok) {
            const cartItems = await response.json();
            const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            
            // Update cart icon with count (you can add this to your header)
            const cartIcon = document.querySelector('#lg-bag a');
            if (cartIcon && totalItems > 0) {
                cartIcon.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> (${totalItems})`;
            }
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Product data for each item (you can expand this)
const productData = {
    'sproduct1': {
        productId: 'f1',
        name: 'Colored Pencils',
        price: 350,
        image: 'img/product/f1.jpg',
        
    },
    'sproduct2': {
        productId: 'f2',
        name: 'Cute sticky notes',
        price: 80,
        image: 'img/product/f2.jpg',
        
    },
    'sproduct3': {
        productId: 'f3',
        name: 'Spiral Notebook',
        price: 150,
        image: 'img/product/f3.jpg',
        
    },
    'sproduct4': {
        productId: 'f4',
        name: 'Gel Pens',
        price: 100,
        image: 'img/product/f4.jpg',
        
    },
    'sproduct5': {
        productId: 'f5',
        name: 'A4 Size Papers',
        price: 500,
        image: 'img/product/f5.jpg',
        
    }
    ,
    'sproduct6': {
        productId: 'f6',
        name: 'Highlighter Pens',
        price: 50,
        image: 'img/product/f6.jpg',
        
    }
    
    ,
    'sproduct7': {
        productId: 'f7',
        name: 'Stationery Holder',
        price: 500,
        image: 'img/product/f7.jpg',
        
    }
    
    ,
    'sproduct8': {
        productId: 'f8',
        name: 'Eraser',
        price: 20,
        image: 'img/product/f8.jpg',
        
    }
    
    ,
    'sproduct9': {
        productId: 'n1',
        name: 'Clip Board',
        price: 175,
        image: 'img/product/n1.jpg',
        
    }
    
    ,
    'sproduct10': {
        productId: 'n2',
        name: 'Water Color',
        price: 250,
        image: 'img/product/n2.jpg',
        
    }
    
    ,
    'sproduct11': {
        productId: 'n3',
        name: 'Paper Clips',
        price: 40,
        image: 'img/product/n3.jpg',
        
    }
    
    ,
    'sproduct12': {
        productId: 'n4',
        name: 'Washi Tape',
        price: 100,
        image: 'img/product/n4.jpg',
        
    }
    
    ,
    'sproduct13': {
        productId: 'n5',
        name: 'Scissor',
        price: 150,
        image: 'img/product/n5.jpg',
        
    }
    
    ,
    'sproduct14': {
        productId: 'n6',
        name: 'Glitter Pen',
        price: 250,
        image: 'img/product/n6.jpg',
        
    }
    
    ,
    'sproduct15': {
        productId: 'n7',
        name: 'Glue Stick',
        price: 40,
        image: 'img/product/n7.jpg',
        
    }
    
    ,
    'sproduct16': {
        productId: 'n8',
        name: 'Stick Files',
        price: 20,
        image: 'img/product/n8.jpg',
        
    }
    
    ,
    'sproduct17': {
        productId: 'f9',
        name: 'Scientific Calculator',
        price: 650,
        image: 'img/product/f9.jpg',
        
    }
    
    ,
    'sproduct18': {
        productId: 'n9',
        name: 'Sharpner',
        price: 10,
        image: 'img/product/n9.jpg',
        
    }
    
    ,
    'sproduct19': {
        productId: 'g1',
        name: 'Notebook',
        price: 100,
        image: 'img/product/g1.jpg',
        
    }
    
    ,
    'sproduct20': {
        productId: 'g2',
        name: 'Ball-pen',
        price: 10,
        image: 'img/product/g2.jpg',
        
    }
    
    ,
    'sproduct21': {
        productId: 'm4',
        name: 'Pensils',
        price: 10,
        image: 'img/product/m4.jpg',
        
    }
    
    ,
    'sproduct22': {
        productId: 'm3',
        name: 'Corkboard Pins',
        price: 5,
        image: 'img/product/m3.jpg',
        
    }
    
    ,
    'sproduct23': {
        productId: 'm2',
        name: 'Quartet Cork Bulletin Board',
        price: 800,
        image: 'img/product/m2.jpg',
        
    }
    
    ,
    'sproduct24': {
        productId: 'm1',
        name: 'ID Holder',
        price: 40,
        image: 'img/product/m1.jpg',
        
    }
    
   

    

    // Add more products as needed
};

// Handle add to cart button clicks
document.addEventListener('DOMContentLoaded', function() {
    // For individual product pages
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantityInput = document.querySelector('input[type="number"]');
            const quantity = parseInt(quantityInput.value) || 1;
            
            // Determine which product this is based on the page
            const currentPage = window.location.pathname.split('/').pop().split('.')[0];
            const product = productData[currentPage];
            
            if (product) {
                const cartItem = {
                    ...product,
                    quantity: quantity
                };
                addToCart(cartItem);
            }
        });
    }

    // For shop page cart icons
    const cartIcons = document.querySelectorAll('.cart');
    cartIcons.forEach((icon, index) => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get product data based on index or data attributes
            const productKeys = Object.keys(productData);
            if (productKeys[index]) {
                const product = productData[productKeys[index]];
                const cartItem = {
                    ...product,
                    quantity: 1
                };
                addToCart(cartItem);
            }
        });
    });

    // Load cart data if on cart page
    if (window.location.pathname.includes('cart.html')) {
        loadCartData();
    }

    // Update cart count on page load
    updateCartCount();
});

// Load cart data for cart page
async function loadCartData() {
    try {
        const response = await fetch(`${API_BASE_URL}/cart`);
        if (response.ok) {
            const cartItems = await response.json();
            displayCartItems(cartItems);
            updateCartTotal(cartItems);
        }
    } catch (error) {
        console.error('Error loading cart:', error);
    }
}

// Display cart items
function displayCartItems(cartItems) {
    const cartTableBody = document.querySelector('#cart table tbody');
    if (!cartTableBody) return;

    cartTableBody.innerHTML = '';

    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><a href="#" onclick="removeFromCart('${item._id}')"><i class="far fa-times-circle"></i></a></td>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td>${item.name}</td>
            <td>Rs ${item.price}</td>
            <td><input type="number" value="${item.quantity}" onchange="updateQuantity('${item._id}', this.value)"></td>
            <td>Rs ${item.price * item.quantity}</td>
        `;
        cartTableBody.appendChild(row);
    });
}

// Update cart total
function updateCartTotal(cartItems) {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subtotalElements = document.querySelectorAll('#subtotal table td');
    if (subtotalElements.length >= 2) {
        subtotalElements[1].textContent = `Rs ${total}`;
        subtotalElements[3].textContent = `Rs ${total}`;
    }
}

// Remove item from cart
async function removeFromCart(itemId) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadCartData(); // Reload cart data
            updateCartCount();
        }
    } catch (error) {
        console.error('Error removing item:', error);
    }
}

// Update quantity
async function updateQuantity(itemId, newQuantity) {
    try {
        const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity: parseInt(newQuantity) })
        });
        
        if (response.ok) {
            loadCartData(); // Reload cart data
            updateCartCount();
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}