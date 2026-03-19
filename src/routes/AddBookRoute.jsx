import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBooksFromStorage, saveBooksToStorage } from "@/lib/storage";
import { useAuth } from "@/lib/authContext";
import { addBook as addBookRemote } from "@/lib/bookService";

export const AddBookRoute = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const normalizeCoverUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://")) return url.replace(/^http:\/\//, "https://");
    if (url.startsWith("//")) return `https:${url}`;
    return url;
  };

  // Title autocomplete state
  const [query, setQuery] = useState(""); // Book Title input value
  const [suggestions, setSuggestions] = useState([]); // API results (mapped)
  const [showDropdown, setShowDropdown] = useState(false);
  const [autocompleteMessage, setAutocompleteMessage] = useState(""); // e.g. "No books found"
  const blurTimeoutRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Author input state
  const [author, setAuthor] = useState("");
  // Selected book cover image URL (used when saving)
  const [coverImage, setCoverImage] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      // still allow guest users to add to localStorage,
      // but if you prefer to force login, uncomment below:
      // navigate("/login");
    }
  }, [authLoading, user, navigate]);

  // Debounced Google Books suggestions fetch
  useEffect(() => {
    const trimmed = query.trim();

    // Empty input => hide dropdown
    if (!trimmed) {
      setSuggestions([]);
      setShowDropdown(false);
      setAutocompleteMessage("");
      setCoverImage("");
      return;
    }

    // Avoid calling API for very short inputs.
    if (trimmed.length < 3) {
      setSuggestions([]);
      setAutocompleteMessage("Type at least 3 characters");
      setShowDropdown(false);
      return;
    }

    let isActive = true;
    const controller = new AbortController();

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(async () => {
      const q = encodeURIComponent(trimmed);
      const url = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=5`;

      try {
        setAutocompleteMessage("");

        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Google Books API error (${res.status})`);
        }

        const json = await res.json();
        const items = Array.isArray(json.items) ? json.items : [];

        const mapped = items.map((item) => {
            const volumeInfo = item?.volumeInfo ?? {};
            const title = volumeInfo?.title ?? "";
            const authors = Array.isArray(volumeInfo?.authors)
              ? volumeInfo.authors
              : [];
            const thumbnail = volumeInfo?.imageLinks?.thumbnail ?? "";

            return {
              id: item?.id ?? title,
              title,
              author: authors[0] ?? "Unknown author",
              coverImage: normalizeCoverUrl(thumbnail),
              volumeInfo,
            };
          }).filter((x) => x.title);

        if (!isActive) return;
        setSuggestions(mapped);

        if (mapped.length === 0) {
          setAutocompleteMessage("No books found");
        } else {
          setAutocompleteMessage("");
        }

        setShowDropdown(true);
      } catch (err) {
        if (!isActive) return;
        if (err?.name === "AbortError") return;
        // Fail gracefully: keep the dropdown but show a message.
        // (Also hides suggestions to avoid confusing stale results.)
        // eslint-disable-next-line no-console
        console.warn("Autocomplete fetch failed:", err);
        setSuggestions([]);
        if (err?.message?.includes("(429)")) {
          setAutocompleteMessage("Too many requests, please wait...");
        } else {
          setAutocompleteMessage("Could not load book suggestions");
        }
        setShowDropdown(true);
      }
    }, 500);

    return () => {
      isActive = false;
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      controller.abort();
    };
  }, [query]);

  const handleSelectSuggestion = (book) => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
    setQuery(book.title);
    setAuthor(book.author);
    const image = book.volumeInfo.imageLinks?.thumbnail;
    // eslint-disable-next-line no-console
    console.log("IMAGE URL:", image);
    setCoverImage(image?.replace("http://", "https://") || "");
    setSuggestions([]);
    setAutocompleteMessage("");
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!query.trim() || !author.trim()) {
      setError("Both title and author are required");
      return;
    }

    setSaving(true);
    // eslint-disable-next-line no-console
    console.log("SAVING IMAGE:", coverImage);

    const finish = () => {
      setSuccess(true);
      setError("");
      setQuery("");
      setAuthor("");
      setCoverImage("");
      setSuggestions([]);
      setAutocompleteMessage("");
      setShowDropdown(false);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    };

    const run = async () => {
      try {
        if (user) {
          await addBookRemote(user.id, {
            title: query,
            author,
            isRead: false,
            coverImage,
          });
        } else {
          const newBook = {
            id: Date.now().toString(),
            title: query,
            author,
            isRead: false,
            coverImage,
            cover_image: coverImage,
          };
          const currentBooks = getBooksFromStorage();
          const updatedBooks = [...currentBooks, newBook];
          saveBooksToStorage(updatedBooks);
        }

        finish();
      } catch (err) {
        setError(err.message ?? "Failed to add book. Please try again.");
      } finally {
        setSaving(false);
      }
    };

    run();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6">
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
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Add New Book
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-md mx-auto leading-relaxed">
            Expand your reading collection and discover new worlds
          </p>
        </div>

        {/* Form Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-500 rounded-3xl blur-xl opacity-10"></div>
          <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-10 border border-slate-200/50 shadow-2xl">
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
                <div className="relative">
                  <Input
                    id="title"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      // If the user edits manually after selecting, clear the selected cover.
                      setCoverImage("");
                    }}
                    placeholder="Enter book title"
                    autoComplete="off"
                    onFocus={() => {
                      if (query.trim()) setShowDropdown(true);
                    }}
                    onBlur={() => {
                      // Delay closing to allow clicking a dropdown item.
                      blurTimeoutRef.current = setTimeout(() => setShowDropdown(false), 120);
                    }}
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-base sm:text-lg placeholder-slate-500 rounded-2xl"
                  />

                  {showDropdown && (
                    <div className="absolute z-20 left-0 right-0 mt-2 rounded-2xl border border-slate-200/50 bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden">
                      <div className="max-h-72 overflow-auto">
                        {suggestions.length > 0 ? (
                          <div className="p-1 space-y-1">
                            {suggestions.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onMouseDown={(e) => {
                                  // Prevent blur from firing before the click.
                                  e.preventDefault();
                                }}
                                onClick={() => handleSelectSuggestion(item)}
                                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md hover:-translate-y-[1px]"
                              >
                                {item.coverImage ? (
                                  <img
                                    src={item.coverImage}
                                    alt={item.title}
                                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
                                    <svg
                                      className="w-5 h-5 text-slate-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 7h10M7 11h10M7 15h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"
                                      />
                                    </svg>
                                  </div>
                                )}

                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-800 text-sm leading-tight truncate">
                                    {item.title}
                                  </div>
                                  <div className="text-slate-500 text-xs leading-tight truncate mt-1">
                                    {item.author}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="px-5 py-4 text-slate-600 text-sm">
                            {autocompleteMessage || "No books found"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
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
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-base sm:text-lg placeholder-slate-500 rounded-2xl"
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
                  className="flex-1 text-slate-700 border-2 border-slate-300 hover:bg-gradient-to-r hover:from-slate-50 hover:to-slate-100 hover:border-slate-400 bg-white text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 font-medium"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 text-white text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 font-medium disabled:opacity-80 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {saving ? "Saving..." : "Add Book"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};