import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { BookDetailsModal } from "@/components/BookDetailsModal";

export const BookCard = ({ book, onToggleRead, onDelete }) => {
  const isRead = book.isRead;
  const [selectedBook, setSelectedBook] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const openModal = () => {
    setSelectedBook(book);
    setShowModal(true);
  };

  useEffect(() => {
    if (!showModal) return;
    if (!selectedBook) return;
    if (selectedBook.id !== book.id) return;
    // Keep modal content in sync with latest prop updates (e.g., read/unread toggle).
    setSelectedBook(book);
  }, [book, showModal, selectedBook]);

  const rawCoverUrl = book?.cover_image ?? book?.coverImage ?? "";
  const placeholderSrc = "/placeholder.png";
  const normalizedCoverUrl = rawCoverUrl
    ? rawCoverUrl.startsWith("http://")
      ? rawCoverUrl.replace(/^http:\/\//, "https://")
      : rawCoverUrl.startsWith("//")
        ? `https:${rawCoverUrl}`
        : rawCoverUrl
    : "";

  useEffect(() => {
    setImgFailed(false);
  }, [book?.id, normalizedCoverUrl]);

  return (
    <div
      className="group relative cursor-pointer transition-transform duration-200"
      role="button"
      tabIndex={0}
      onClick={openModal}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      }}
    >
      <div
        className={`absolute inset-0 rounded-3xl blur-xl opacity-20 transition-opacity duration-300 ${
          isRead
            ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600"
            : "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600"
        } group-hover:opacity-30`}
      />

      <Card className="w-full relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 border border-slate-200/50 hover:border-slate-300/50 group-hover:shadow-blue-500/10 group-hover:-translate-y-1 group-hover:scale-[1.01] h-60 sm:h-72 overflow-hidden">
        <div className="h-full w-full flex flex-col">
          {/* 1) Top → Title + Author */}
          <div className="p-3.5 sm:p-5 flex-none">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-xl overflow-hidden border border-slate-200/70 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm flex-shrink-0">
                  <img
                    src={normalizedCoverUrl && !imgFailed ? normalizedCoverUrl : placeholderSrc}
                    alt={book.title}
                    className="w-full h-full object-cover"
                    onError={() => setImgFailed(true)}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                    {book.title}
                  </CardTitle>

                  <CardDescription className="text-sm text-slate-600 mt-2 flex items-center gap-2 line-clamp-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    by <span className="font-semibold text-slate-700">{book.author}</span>
                  </CardDescription>
                </div>
              </div>

              <div
                className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 shadow-lg ${
                  isRead
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                    : "bg-gradient-to-r from-indigo-500 to-blue-500"
                }`}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* 2) Middle → Status badge (fixed positioning) */}
          <div className="flex-1 flex items-center justify-center px-3.5 sm:px-5">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border-2 ${
                isRead
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border-blue-300 shadow-lg shadow-blue-500/20"
                  : "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-800 border-indigo-300 shadow-lg shadow-indigo-500/20"
              }`}
            >
              {isRead ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Completed
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  To Read
                </>
              )}
            </div>
          </div>

          {/* 3) Bottom → Buttons (pinned to bottom) */}
          <div className="p-3.5 sm:p-5 flex-none mt-auto">
            <div className="flex gap-2 mt-3 w-full min-w-0">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleRead(book.id);
                }}
                className="w-full flex-1 min-w-0 py-2 px-2.5 sm:px-4 text-[11px] sm:text-sm rounded-lg font-medium transition-all duration-200 transform bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-700 hover:scale-[1.02]"
              >
                {isRead ? (
                  <>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="truncate">Mark Unread</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="truncate">Mark Read</span>
                  </>
                )}
              </Button>

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(book.id);
                }}
                className="w-full flex-1 min-w-0 py-2 px-2.5 sm:px-4 text-[11px] sm:text-sm rounded-lg font-medium transition-all duration-200 transform bg-gradient-to-r from-red-500 via-rose-600 to-pink-600 text-white shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30 hover:from-red-600 hover:via-rose-700 hover:to-pink-700 hover:scale-[1.02]"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="truncate">Delete</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <BookDetailsModal
        open={showModal}
        book={selectedBook}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};