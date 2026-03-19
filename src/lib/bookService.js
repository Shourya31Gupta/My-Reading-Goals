import { supabase } from "./supabaseClient";

export const fetchBooks = async (userId) => {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
};

export const addBook = async (userId, book) => {
  const basePayload = {
    user_id: userId,
    title: book.title,
    author: book.author,
    is_read: book.isRead ?? false,
  };

  const coverImage = book.coverImage ?? "";

  const insertPayload = async (payload) => {
    const { data, error } = await supabase
      .from("books")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const isMissingColumn = (message, column) => {
    const m = String(message ?? "");
    return (
      m.toLowerCase().includes(String(column).toLowerCase()) &&
      /(does not exist|unknown column|undefined column|not a column)/i.test(m)
    );
  };

  try {
    // Preferred schema: `cover_image` (snake_case)
    return await insertPayload({
      ...basePayload,
      cover_image: coverImage,
    });
  } catch (error) {
    const message = error?.message ?? "";

    if (isMissingColumn(message, "cover_image")) {
      // Fallback schema: `coverImage` (camelCase)
      try {
        return await insertPayload({
          ...basePayload,
          coverImage: coverImage,
        });
      } catch (error2) {
        // eslint-disable-next-line no-console
        console.warn("Failed to insert cover image fields.", error2);
        // Keep the app working even if neither cover column exists.
        return await insertPayload({ ...basePayload });
      }
    }

    // If it's not a column mismatch, rethrow so you can see the real issue.
    // eslint-disable-next-line no-console
    console.warn("Failed to insert book.", error);
    throw error;
  }
};

export const updateBook = async (userId, bookId, patch) => {
  const dbPatch = {};
  if (patch.title !== undefined) dbPatch.title = patch.title;
  if (patch.author !== undefined) dbPatch.author = patch.author;
  if (patch.isRead !== undefined) dbPatch.is_read = patch.isRead;

  const { data, error } = await supabase
    .from("books")
    .update(dbPatch)
    .eq("id", bookId)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteBook = async (userId, bookId) => {
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .eq("user_id", userId);

  if (error) throw error;
};

