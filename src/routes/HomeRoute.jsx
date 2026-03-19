import { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/authContext";
import { fetchBooks, updateBook, deleteBook as deleteBookRemote, addBook as addBookRemote } from "@/lib/bookService";
import { getBooksFromStorage, saveBooksToStorage } from "@/lib/storage";

export const HomeRoute = () => {
  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadBooks = async () => {
      setError("");
      setLoading(true);

      try {
        if (user) {
          const remoteBooks = await fetchBooks(user.id);

          const mappedRemote = remoteBooks.map((b) => ({
            id: b.id,
            title: b.title,
            author: b.author,
            isRead: b.is_read,
            cover_image: b.cover_image ?? b.coverImage ?? "",
            coverImage: b.cover_image ?? b.coverImage ?? "",
          }));

          setBooks(mappedRemote);

          const localBooks = getBooksFromStorage();
          if (localBooks.length > 0 && remoteBooks.length === 0) {
            try {
              const created = await Promise.all(
                localBooks.map((book) =>
                  addBookRemote(user.id, {
                    title: book.title,
                    author: book.author,
                    isRead: book.isRead,
                    coverImage: book.coverImage ?? "",
                  })
                )
              );

              const mappedCreated = created.map((b) => ({
                id: b.id,
                title: b.title,
                author: b.author,
                isRead: b.is_read,
                cover_image: b.cover_image ?? b.coverImage ?? "",
                coverImage: b.cover_image ?? b.coverImage ?? "",
              }));

              setBooks(mappedCreated);
              saveBooksToStorage([]);
            } catch (migrationError) {
              // eslint-disable-next-line no-console
              console.warn("Failed to migrate local books:", migrationError);
            }
          }
        } else {
          const storedBooks = getBooksFromStorage();
          setBooks(
            (storedBooks ?? []).map((b) => ({
              ...b,
              cover_image: b.cover_image ?? b.coverImage ?? "",
              coverImage: b.coverImage ?? b.cover_image ?? "",
            }))
          );
        }
      } catch (err) {
        setError(err.message ?? "Failed to load books.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      loadBooks();
    }
  }, [user, authLoading]);

  const updateStorage = (newBooks) => {
    if (!user) {
      saveBooksToStorage(newBooks);
    }
    setBooks(newBooks);
  };

  const toggleReadStatus = async (id) => {
    const target = books.find((book) => book.id === id);
    if (!target) return;

    const nextIsRead = !target.isRead;

    if (user) {
      try {
        await updateBook(user.id, id, { isRead: nextIsRead });
        const updatedBooks = books.map((book) =>
          book.id === id ? { ...book, isRead: nextIsRead } : book
        );
        setBooks(updatedBooks);
      } catch (err) {
        setError(err.message ?? "Failed to update book.");
      }
    } else {
      const updatedBooks = books.map((book) =>
        book.id === id ? { ...book, isRead: nextIsRead } : book
      );
      updateStorage(updatedBooks);
    }
  };

  const handleDelete = async (id) => {
    if (user) {
      try {
        await deleteBookRemote(user.id, id);
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
      } catch (err) {
        setError(err.message ?? "Failed to delete book.");
      }
    } else {
      const updatedBooks = books.filter((book) => book.id !== id);
      updateStorage(updatedBooks);
    }
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
    if (loading) return "Loading your books...";

    if (!user && books.length === 0)
      return "No books added yet. Log in to sync across devices or start adding as a guest.";

    if (books.length > 0 && books.every((book) => book.isRead))
      return "You've read all your books!";
    if (filteredBooks.length === 0) {
      if (filter === "read") return "You haven't completed any books yet.";
      if (filter === "unread") return "All books have been read!";
      return "No books match your search.";
    }
    return null;
  };

  const readCount = books.filter(book => book.isRead).length;
  const unreadCount = books.filter(book => !book.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
                Your Reading Library
              </span>
            </h1>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 rounded-full"></div>
          </div>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track your reading progress, discover new worlds, and celebrate your literary achievements
          </p>
        </div>

        {/* Statistics Cards */}
        {books.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="group relative">
                             <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
               <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                 <div className="flex items-center gap-4 sm:gap-6">
                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse-slow">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-slate-800">{books.length}</p>
                    <p className="text-slate-600 font-medium">Total Books</p>
                  </div>
                </div>
              </div>
            </div>
            
                         <div className="group relative">
               <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
               <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                 <div className="flex items-center gap-4 sm:gap-6">
                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-slate-800">{readCount}</p>
                    <p className="text-slate-600 font-medium">Completed</p>
                  </div>
                </div>
              </div>
            </div>
            
                         <div className="group relative">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
               <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                 <div className="flex items-center gap-4 sm:gap-6">
                   <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-slate-800">{unreadCount}</p>
                    <p className="text-slate-600 font-medium">To Read</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="relative mb-8 sm:mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 rounded-3xl blur-xl opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-xl">
            <div className="flex flex-col md:flex-row gap-6 md:items-center">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search books by title or author..."
                  className="w-full px-4 py-3 sm:px-6 sm:py-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-base sm:text-lg placeholder-slate-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute right-6 top-5 h-6 w-6 text-slate-400"
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
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl cursor-pointer border transition-all duration-300 text-sm sm:text-base font-medium ${
                    filter === "all"
                      ? "bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                      : "border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 bg-white"
                  }`}
                  variant={filter === "all" ? "default" : "outline"}
                >
                  All Books
                </Button>
                <Button
                  onClick={() => setFilter("read")}
                  className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl cursor-pointer border transition-all duration-300 text-sm sm:text-base font-medium ${
                    filter === "read"
                      ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                      : "border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 bg-white"
                  }`}
                  variant={filter === "read" ? "default" : "outline"}
                >
                  Completed
                </Button>
                <Button
                  onClick={() => setFilter("unread")}
                  className={`px-4 py-3 sm:px-8 sm:py-4 rounded-2xl cursor-pointer border transition-all duration-300 text-sm sm:text-base font-medium ${
                    filter === "unread"
                      ? "bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30"
                      : "border-slate-300 text-slate-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 hover:border-indigo-300 bg-white"
                  }`}
                  variant={filter === "unread" ? "default" : "outline"}
                >
                  To Read
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mt-4 mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-2xl text-sm border-2 border-red-200">
            {error}
          </div>
        )}

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-500 to-slate-600 rounded-3xl blur-xl opacity-10"></div>
            <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 sm:p-16 text-center border border-slate-200/50 shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.343a4 4 0 00-5.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{getMessage()}</h3>
              <p className="text-slate-600 text-lg">Start building your reading collection</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book, index) => (
              <div key={book.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <BookCard
                  book={book}
                  onToggleRead={toggleReadStatus}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};