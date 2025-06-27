import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { getBooksFromStorage, saveBooksToStorage } from "@/lib/storage";

export const HomeRoute = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const storedBooks = getBooksFromStorage();
    setBooks(storedBooks);
  }, []);

  const updateStorage = (newBooks) => {
    saveBooksToStorage(newBooks);
    setBooks(newBooks);
  };

  const toggleReadStatus = (id) => {
    const updatedBooks = books.map((book) =>
      book.id === id ? { ...book, isRead: !book.isRead } : book
    );
    updateStorage(updatedBooks);
  };

  const handleDelete = (id) => {
    const updatedBooks = books.filter((book) => book.id !== id);
    updateStorage(updatedBooks);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === "read") return book.isRead && matchesSearch;
    if (filter === "unread") return !book.isRead && matchesSearch;
    return matchesSearch;
  });

  const getMessage = () => {
    if (books.length === 0) return "No books added yet.";
    if (books.length > 0 && books.every((book) => book.isRead))
      return "You’ve read all your books!";
    if (filteredBooks.length === 0) {
      if (filter === "read") return "You haven't completed any books yet.";
      if (filter === "unread") return "All books have been read!";
      return "No books match your search.";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
       
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search books..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setFilter("all")}
                className={`px-5 py-2 rounded-xl cursor-pointer border ${
                  filter === "all"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border-gray-300 text-gray-700 hover:bg-blue-100"
                }`}
                variant={filter === "all" ? "default" : "outline"}
              >
                All
              </Button>
              <Button
                onClick={() => setFilter("read")}
                className={`px-5 py-2 rounded-xl cursor-pointer border ${
                  filter === "read"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-green-100"
                }`}
                variant={filter === "read" ? "default" : "outline"}
              >
                Read
              </Button>
              <Button
                onClick={() => setFilter("unread")}
                className={`px-5 py-2 rounded-xl cursor-pointer border ${
                  filter === "unread"
                    ? "bg-yellow-500 text-white hover:bg-yellow-600"
                    : "border-gray-300 text-gray-700 hover:bg-yellow-100"
                }`}
                variant={filter === "unread" ? "default" : "outline"}
              >
                Unread
              </Button>
            </div>
          </div>
        </div>

       
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
            {getMessage()}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onToggleRead={toggleReadStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};