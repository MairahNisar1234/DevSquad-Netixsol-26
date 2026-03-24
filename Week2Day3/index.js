
console.log("1. Script loaded successfully!");

const menuItems = [

    { id: 1, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "burgers", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/burger.png" },
    {id: 2, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "burgers", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/burger.png"},
    {id: 3, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "burgers", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/burger.png"},
    {id: 4, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "burgers", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/burger.png"},
    {id: 5, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "burgers", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/burger.png"},
    {id: 6, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "burgers", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/burger.png"},
    {id: 7, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "fries", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/fries.png"},
    {id: 8, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "fries", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/fries.png"},
    {id: 9, name: "Royal Cheese Burger with extra Fries", price: 23.10, category: "fries", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/fries.png"},
    {id: 10, name: "The Classic for 3", price: 23.10, category: "fries", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/fries3.png"},
    {id: 11, name: "The Classic for 3", price: 23.10, category: "fries", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/fries3.png"},
    {id:12, name:"The Classic for 3", price: 23.10, category: "fries", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/fries3.png"},
    {id:13, name:"Royal Cheese Burger with extra Fries", price: 23.10, category: "cold-drinks", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/pink.png"},
    {id:14, name:"The Classic for 3", price: 23.10, category: "cold-drinks", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/blue.png"},
    {id:15, name:"The Classic for 3", price: 23.10, category: "cold-drinks", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/white.png"},
    {id:16, name:"The Classic for 3", price: 23.10, category: "cold-drinks", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/white.png"},
    {id:17, name:"The Classic for 3", price: 23.10, category: "cold-drinks", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/small.png"},
    {id:18, name:"The Classic for 3", price: 23.10, category: "cold-drinks", desc: "1 McDonald's™, 1 Big Mac™, 1 Royal Cheeseburger...", img: "assets/juice.png"}
];

function renderMenu() {
    const categories = ['burgers', 'fries', 'cold-drinks'];
    
    categories.forEach(cat => {
        const grid = document.getElementById(`${cat}Grid`);
        if (!grid) return;

        const filtered = menuItems.filter(item => item.category === cat);
        
        grid.innerHTML = filtered.map(item => `
            <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex justify-between items-center h-44 hover:shadow-md transition-shadow">
                <div class="flex flex-col justify-between h-full py-1 pr-4">
                    <div>
                        <h4 class="font-bold text-base text-[#03081F] leading-tight">${item.name}</h4>
                        <p class="text-[11px] text-gray-500 mt-2 line-clamp-2">${item.desc}</p>
                    </div>
                    <span class="font-bold text-sm text-[#03081F]">GBP ${item.price.toFixed(2)}</span>
                </div>
                
                <div class="relative w-32 h-32 flex-shrink-0">
                    <img src="${item.img}" class="w-full h-full object-cover rounded-xl" alt="${item.name}">
                    <button onclick="addToCart(${item.id})" class="absolute bottom-0 right-0 bg-[#03081F] text-white w-9 h-9 rounded-tl-2xl rounded-br-xl flex items-center justify-center hover:bg-gray-800">
                        <span class="text-xl font-light">+</span>
                    </button>
                </div>
            </div>
        `).join('');
    });
}

let cartQuantity = 0;

function addToCart(itemId) {
  
    cartQuantity++;
    updateCartBadge();
    const item = menuItems.find(i => i.id === itemId);
    console.log(`Added to cart: ${item.name}`);
}
function updateCartBadge() {
    const badge = document.getElementById('cart-count'); 
    if (cartQuantity > 0) {
        badge.innerText = cartQuantity;
        badge.classList.remove('hidden'); 
    } else {
        badge.classList.add('hidden'); 
    }
}

window.addEventListener('load', renderMenu);
const restaurants = [
    {name:"McDonald's London", logo:"assets/mcd.png", color: "bg-[#E51212]"},
    {name:"KFC West London", logo:"assets/KFC.png", color: "bg-[#FC8A06]"},
    {name:"Papa Johns", logo:"assets/papa.png", color: "bg-[#00A6ED]"},    
    {name:"Texas Chicken London", logo:"assets/texas.png", color: "bg-[#FFC107]"},
    {name:"Burger King", logo:"assets/burgerking.png", color: "bg-[#FF5722]"},
    {name:"Shaurma 1", logo:"assets/shaurma.png", color: "bg-[#4CAF50]"},
];

window.addEventListener('load', () => {
    const grid = document.getElementById('restaurantGrid');

    if (grid) {
        grid.innerHTML = restaurants.map(res => `
            <div class="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
                
                <div class="w-40 h-40  p-4">
                    <img src="${res.logo}" 
                         class="w-full h-full object-contain filter " 
                         alt="${res.name}">
                </div>

                <div class="w-full bg-[#FC8A06] py-3 px-2 rounded-b-2xl mt-[-2px]">
                    <p class="text-white text-[12px] font-bold text-center truncate">
                        ${res.name}
                    </p>
                </div>
                
            </div>
        `).join('');
    }
});

// slider function 

function slide(direction) {
    const slider = document.getElementById('slider');
    
    const scrollAmount = 474; 

    if (direction === 'left') {
      slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}





window.onload = () => filterMenu('burgers');