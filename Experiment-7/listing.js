// Module responsible for rendering book listings
export function renderBookList(container, books, onAddToCart) {
    container.innerHTML = "";
    books.forEach(book => {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = book.title;

        const meta = document.createElement("p");
        meta.textContent = `${book.author} • ₹${book.price}`;

        const status = document.createElement("span");
        status.className = `status ${book.availability === "in stock" ? "in" : "out"}`;
        status.textContent = book.availability;

        const btn = document.createElement("button");
        btn.textContent = "Add to Cart";
        btn.disabled = book.availability !== "in stock";
        btn.addEventListener("click", () => onAddToCart(book));

        card.appendChild(title);
        card.appendChild(meta);
        card.appendChild(status);
        card.appendChild(btn);
        container.appendChild(card);
    });
}


