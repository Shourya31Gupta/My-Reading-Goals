import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBooksFromStorage, saveBooksToStorage } from "@/lib/storage";

export const AddBookRoute = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      setError("Both title and author are required");
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      title,
      author,
      isRead: false,
    };

    const currentBooks = getBooksFromStorage();
    const updatedBooks = [...currentBooks, newBook];
    saveBooksToStorage(updatedBooks);

    setSuccess(true);
    setError("");

    // Optional: wait 1 second then navigate back to home
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/25 animate-pulse-slow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full animate-pulse shadow-lg"></div>
          </div>
          <h1 className="text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Add New Book
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
            Expand your reading collection and discover new worlds
          </p>
        </div>

        {/* Form Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 rounded-3xl blur-xl opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-10 border border-slate-200/50 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <Label htmlFor="title" className="text-slate-700 font-semibold flex items-center gap-3 text-lg">
                                     <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 5.477 5.754 5 7.5 5s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.523 18.246 19 16.5 19c-1.746 0-3.332-.477-4.5-1.253" />
                    </svg>
                  </div>
                  Book Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter book title"
                  autoComplete="off"
                  className="w-full px-6 py-4 border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg placeholder-slate-500 rounded-2xl"
                />
              </div>

              <div className="space-y-4">
                <Label htmlFor="author" className="text-slate-700 font-semibold flex items-center gap-3 text-lg">
                                     <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Author Name
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Enter author name"
                  autoComplete="off"
                  className="w-full px-6 py-4 border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-lg placeholder-slate-500 rounded-2xl"
                />
              </div>

              {error && (
                <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-2xl text-sm border-2 border-red-200 flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-100 text-emerald-600 rounded-2xl text-sm border-2 border-emerald-200 flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  Book added successfully! Redirecting...
                </div>
              )}

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex-1 text-slate-700 border-2 border-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:border-slate-400 bg-white text-lg px-8 py-4 rounded-2xl transition-all duration-300 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white text-lg px-8 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 font-medium"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Book
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};