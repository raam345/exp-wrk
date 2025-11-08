// Module to render cart UI and handle interactions
export function renderCart(container, cart, onRemove, onCheckout) {
    container.innerHTML = "";

    if (cart.items.length === 0) {
        container.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    const list = document.createElement("ul");
    cart.items.forEach(item => {
        const li = document.createElement("li");
        li.className = "cart-item";
        li.textContent = `${item.title} × ${item.qty} — ₹${item.price * item.qty}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "remove";
        removeBtn.addEventListener("click", () => onRemove(item.id));

        li.appendChild(removeBtn);
        list.appendChild(li);
    });

    const total = document.createElement("p");
    total.className = "total";
    total.textContent = `Total: ₹${cart.getTotal()}`;

    const checkout = document.createElement("button");
    checkout.textContent = "Proceed to Checkout";
    checkout.className = "checkout";
    checkout.addEventListener("click", onCheckout);

    container.appendChild(list);
    container.appendChild(total);
    container.appendChild(checkout);
}


