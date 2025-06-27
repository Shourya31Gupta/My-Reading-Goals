export function getBooksFromStorage() {
  const books = localStorage.getItem("readingGoals_books");
  return books ? JSON.parse(books) : [];
}

export function saveBooksToStorage(books) {
  localStorage.setItem("readingGoals_books", JSON.stringify(books));
}