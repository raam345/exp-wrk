import { books } from "./data.js";
import { Cart } from "./cart.js";
import { renderBookList } from "./listing.js";
import { renderCart } from "./ui.js";

const bookListEl = document.getElementById("book-list");
const cartEl = document.getElementById("cart");

const cart = new Cart();

function updateCartUI() {
    renderCart(cartEl, cart, (id) => {
        cart.removeItem(id);
        updateCartUI();
    }, () => {
        alert("This is a mock checkout. Thank you!");
        cart.clear();
        updateCartUI();
    });
}

function handleAddToCart(book) {
    cart.addItem(book);
    updateCartUI();
}

renderBookList(bookListEl, books, handleAddToCart);
updateCartUI();


