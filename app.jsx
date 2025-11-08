const { useState, useEffect } = React;
const { createRoot } = ReactDOM;
const { HashRouter, Routes, Route, Link, useParams, useNavigate } = ReactRouterDOM;

function BookCard({ book }) {
    return (
        <Link to={`/book/${book.id}`} className="block border rounded p-3 hover:bg-gray-50">
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-gray-600">{book.author}</p>
        </Link>
    );
}

function BookDetail({ books }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const book = books.find(b => String(b.id) === String(id));

    if (!book) {
        return (
            <div className="bg-white rounded p-4 shadow">
                <p className="text-gray-600">Book not found.</p>
                <button className="mt-3 text-blue-600 underline" onClick={() => navigate(-1)}>Go Back</button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded p-4 shadow">
            <h2 className="text-xl font-bold mb-1">{book.title}</h2>
            <p className="text-gray-700 mb-2">by {book.author}</p>
            <p className="mb-2">{book.description}</p>
            <p className="font-semibold">Rating: {book.rating} / 5</p>
            <Link to="/" className="inline-block mt-4 text-blue-600 underline">Back to list</Link>
        </div>
    );
}

function Home({ books }) {
    return (
        <div className="grid gap-3">
            {books.map(book => (
                <BookCard key={book.id} book={book} />
            ))}
        </div>
    );
}

function App() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setBooks([
                { id: 1, title: "The Pragmatic Programmer", author: "Andrew Hunt", description: "A guide to pragmatic software craftsmanship.", rating: 4.7 },
                { id: 2, title: "Refactoring", author: "Martin Fowler", description: "Improving the design of existing code.", rating: 4.6 },
                { id: 3, title: "Design Patterns", author: "Erich Gamma et al.", description: "Elements of reusable object-oriented software.", rating: 4.5 },
            ]);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <p className="text-gray-600">Loading...</p>;
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Home books={books} />} />
                <Route path="/book/:id" element={<BookDetail books={books} />} />
            </Routes>
        </HashRouter>
    );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);


