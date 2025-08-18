console.log("fetching data...");
const productList = document.getElementById("product-list");
let url = "https://dummyjson.com/products";

let ProductsOnPage = [];
let products = [];
let currentPage = 1;
let limit = 7;
let totalProduts=0;

let fetchData = async () => {
    let response = await fetch(url);
    let data = await response.json();
    products = data.products;
    originalProducts = [...data.products];
    let totalProducts=products.length;
    onPage(currentPage);


}

function onPage(page) {
    const start = (page - 1) * limit;
    const end = start + limit;
    ProductsOnPage = products.slice(start, end);
    
    if (page === 1) {
        prevBtn.style.display = "none";
    } else {
        prevBtn.style.display = "inline-block";
    }
    
    if (start + limit >= products.length) {
        nextBtn.style.display = "none";
    } else {
        nextBtn.style.display = "inline-block";
    }
    createCard(ProductsOnPage);
}

function createCard(products) {
    productList.innerHTML = "";
    products.forEach(product => {
        const container = document.createElement("div");
        container.classList.add("container");

        const imgDiv = document.createElement("div");
        imgDiv.classList.add("img");

        container.appendChild(imgDiv);
        const image = document.createElement("img");
        imgDiv.appendChild(image);
        image.src = product.thumbnail;
        image.alt = product.title;

        const productDesc = document.createElement("div");
        productDesc.classList.add("desc");
        container.appendChild(productDesc);

        const title = document.createElement("p");
        title.classList.add("title");
        title.textContent = product.title;
        productDesc.appendChild(title);

        const description = document.createElement("p")
        description.classList.add("descText");
        description.textContent = product.description;
        productDesc.appendChild(description);

        const price = document.createElement("p");
        price.textContent = `Price:${product.price}`;
        productDesc.appendChild(price);

        const category = document.createElement("p");
        category.textContent = `Category:${product.category}`;
        category.classList.add("categoryText");
        productDesc.appendChild(category);

        const rating = document.createElement("p");
        rating.textContent = `Rating:${product.rating}`;
        productDesc.appendChild(rating);
        rating.classList.add("ratingText");

        const cartDiv = document.createElement("div");
        cartDiv.classList.add("toCart");
        container.appendChild(cartDiv);
        const cartButton = document.createElement("button");
        cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping icon"></i>`;
        cartButton.addEventListener("click", () => addToCart(product.id));
        cartDiv.appendChild(cartButton);

        productList.appendChild(container);
    });
}

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".previous");
nextBtn.addEventListener("click", () => {
    currentPage++;
    onPage(currentPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
})
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        onPage(currentPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
})


document.querySelector(".cart i").addEventListener("click", () => {
    document.querySelector(".cartSidebar").classList.add("open");
});

document.querySelector(".cartHeader button").addEventListener("click", () => {
    document.querySelector(".cartSidebar").classList.remove("open");
});

let cartSidebar = document.querySelector(".cartSidebar");
let cartItemsContainer = document.querySelector(".cartItems");
let totalPrice = document.querySelector(".cartFooter p");

let cart = JSON.parse(localStorage.getItem("cart") || "[]");
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function formatMoney(amount) {
    return `$${amount.toFixed(2)}`;
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id: product.id, title: product.title, price: product.price, thumbnail: product.thumbnail, quantity: 1 });
        alert(`${product.title} has been added to your cart!`);
    }
    saveCart();
    showCart();
    cartSidebar.classList.add("open");
}

function showCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartContainer = document.createElement("div");
        cartContainer.classList.add("cartContainer");

        const cartContainerImg = document.createElement("div");
        cartContainerImg.classList.add("cartContainerImg");
        const cartImg = document.createElement("img");
        cartImg.src = item.thumbnail;
        cartImg.alt = item.title;
        cartImg.classList.add("cartImg");
        cartContainerImg.appendChild(cartImg);

        const cartDesc = document.createElement("div");
        cartDesc.classList.add("cartDesc");
        const descTitle = document.createElement("p");
        descTitle.textContent = item.title;
        const descPrice = document.createElement("p");
        descPrice.textContent = item.price;
        cartDesc.appendChild(descTitle);
        cartDesc.appendChild(descPrice);

        const cartQuantity = document.createElement("div");
        cartQuantity.classList.add("quantity");
        const btnInc = document.createElement("button");
        btnInc.textContent = "+";
        btnInc.addEventListener("click", () => increaseQuantity(index));

        const quantityPara = document.createElement("p");
        quantityPara.textContent = item.quantity;

        const btnDec = document.createElement("button");
        btnDec.textContent = "-";
        btnDec.addEventListener("click", () => decreaseQuantity(index));


        const btnRemove = document.createElement("button");
        btnRemove.textContent = "x";
        btnRemove.addEventListener("click", () => removeItem(index));

        cartQuantity.appendChild(btnInc);
        cartQuantity.appendChild(quantityPara);
        cartQuantity.appendChild(btnDec);
        cartQuantity.appendChild(btnRemove);

        cartContainer.appendChild(cartContainerImg);
        cartContainer.appendChild(cartDesc);
        cartContainer.appendChild(cartQuantity);

        cartItemsContainer.appendChild(cartContainer);
    });

    totalPrice.textContent = `Total: ${formatMoney(total)}`;
}

function increaseQuantity(index) {
    cart[index].quantity++;
    saveCart();
    showCart();
}

function decreaseQuantity(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
    showCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    showCart();
}


fetchData();
showCart();

const sortEle = document.getElementById("sort");
sortEle.addEventListener("change", () => {
    const value = sortEle.value;
    if (value == "priceInc") {
        products.sort((a, b) => a.price - b.price);
    }
    else if (value == "priceDec") {
        products.sort((a, b) => b.price - a.price);
    }
    else if (value == "ratingDec") {
        products.sort((a, b) => b.rating - a.rating);
    }
    else if (value == "ratingInc") {
        products.sort((a, b) => a.rating - b.rating);
    }
    else if (value == "default") {
        products = [...originalProducts];
    }
    currentPage=1;
    onPage(currentPage);
})

const categoryOfElement = document.getElementById("category-select");
categoryOfElement.addEventListener("change", () => {
    let value = categoryOfElement.value;
    if (value == "default") {
        products = [...originalProducts];
    }
    else {
        products = originalProducts.filter(product => product.category === value);
    }
    currentPage=1;
    onPage(currentPage);
})

const searchInput = document.getElementById("search");

searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();

    if (query === "") {
        products = [...originalProducts];
    } else {
        products = originalProducts.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    }

    currentPage = 1;      
    onPage(currentPage);
});

