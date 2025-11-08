// Simple cart module to manage items and totals
export class Cart {
    constructor() {
        this.items = [];
    }

    addItem(book) {
        const existing = this.items.find(i => i.id === book.id);
        if (existing) {
            existing.qty += 1;
        } else {
            this.items.push({ id: book.id, title: book.title, price: book.price, qty: 1 });
        }
    }

    removeItem(bookId) {
        this.items = this.items.filter(i => i.id !== bookId);
    }

    getTotal() {
        return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
    }

    clear() {
        this.items = [];
    }
}


