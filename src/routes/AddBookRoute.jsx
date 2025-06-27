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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h1>

        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-700 font-medium">
                Title
              </Label>
              <Input
  id="title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Enter book title"
  autoComplete="off" // <-- Add this line
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-gray-700 font-medium">
                Author
              </Label>
              <Input
  id="author"
  value={author}
  onChange={(e) => setAuthor(e.target.value)}
  placeholder="Enter author name"
  autoComplete="off" // <-- Add this line
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
/>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                Book added successfully! Redirecting...
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 cursor-pointer"
              >
                Add Book
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};