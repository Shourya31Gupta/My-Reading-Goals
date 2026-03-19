import { useEffect, useState } from "react";

export const BookDetailsModal = ({ open, book, onClose }) => {
  const [render, setRender] = useState(open);
  const [visible, setVisible] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    if (open) {
      setRender(true);
      // Next frame for transition.
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);
    const t = setTimeout(() => setRender(false), 200);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Compute cover URL without conditional hooks (keep hook order stable).
  const rawCoverUrl = book?.cover_image ?? "";
  const placeholderSrc = "/placeholder.png";
  const normalizedCoverUrl = rawCoverUrl
    ? rawCoverUrl.startsWith("http://")
      ? rawCoverUrl.replace(/^http:\/\//, "https://")
      : rawCoverUrl.startsWith("//")
        ? `https:${rawCoverUrl}`
        : rawCoverUrl
    : "";

  useEffect(() => {
    // Reset broken image state when opening/selecting a new book.
    setImgFailed(false);
  }, [open, normalizedCoverUrl, book?.id]);

  if (!render || !book) return null;

  const statusText = book.isRead ? "Completed" : "To Read";

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Close only when the overlay itself is clicked (outside the modal).
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-[min(760px,96vw)] rounded-3xl bg-white/95 backdrop-blur-sm border border-slate-200/50 shadow-2xl p-4 sm:p-8 transform transition-all duration-200 ${
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 bg-white/70 hover:bg-white border border-slate-200/70 hover:border-slate-300 transition-all duration-200"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-32 h-44 sm:w-44 sm:h-60 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-slate-200/70 shadow-lg flex items-center justify-center overflow-hidden">
            <img
              src={normalizedCoverUrl && !imgFailed ? normalizedCoverUrl : placeholderSrc}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={() => setImgFailed(true)}
            />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-slate-200/70 bg-white/70 shadow-sm">
              {book.isRead ? (
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {statusText}
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {book.title}
            </h2>
            <p className="text-slate-600 text-lg">{book.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

