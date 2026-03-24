# Restaurant Website 

A responsive restaurant ordering website built using **HTML, Tailwind CSS, Bootstrap Icons, and JavaScript**.

## Data Structure

### JSON Format

All menu items are stored in a **JavaScript array of objects** (JSON-like structure).

Example:

```javascript
const menuItems = [
  {
    id: 1,
    name: "Royal Cheese Burger",
    price: 23.10,
    category: "burgers",
    desc: "Burger with fries and drink",
    img: "assets/burger.png"
  }
];
```

### Product Representation

Each product is represented as an **object** containing:

* `id`
* `name`
* `price`
* `category`
* `description`
* `image`

### Product Categories

Products are grouped into categories such as:

* Burgers
* Fries
* Cold Drinks

The **JavaScript render function filters items by category** and dynamically displays them in their respective sections.

---

# ⚙️ Dynamic Features

## Customer Reviews Slider

Customer reviews are displayed using a **JavaScript horizontal slider** with navigation buttons.

Users can scroll reviews left and right using arrow buttons.

---

## Similar Restaurants

A list of restaurants is stored as **objects in an array** and dynamically rendered using JavaScript.

Example:

```javascript
const restaurants = [
  { name: "McDonald's London", logo: "assets/mcd.png" },
  { name: "KFC West London", logo: "assets/kfc.png" }
];
```

---

# Responsive Design

The website is fully responsive using **Tailwind CSS utility classes**.

It adapts to:

* Mobile
* Tablet
* Desktop

---

# Cart Functionality

## Add to Cart

Each product contains a **"+" button**.

When clicked:

* The item is added to the cart
* The cart item count increases
* The cart badge updates dynamically

## Cart Badge

The cart icon displays the **number of items added** using a badge.

## Cart Modal (Planned Feature)

Clicking the cart icon will open a **modal popup showing all added products and total price**.

---

#  Technologies Used

* HTML5
* Tailwind CSS
* Bootstrap Icons
* JavaScript (DOM Manipulation)

---

# Author

**Mairah Nisar**
