import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export const BookCard = ({ book, onToggleRead, onDelete }) => {
  const isRead = book.isRead;

  return (
    <Card className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {book.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          by <span className="font-medium">{book.author}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
            isRead ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {isRead ? "Completed" : "To Read"}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between gap-2 pt-2">
        <Button
          onClick={() => onToggleRead(book.id)}
          className={`w-full text-sm border cursor-pointer transition ${
            isRead
              ? "border-yellow-500 text-yellow-600 hover:bg-yellow-500 hover:text-white"
              : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
          }`}
        >
          {isRead ? "Mark as Unread" : "Mark as Read"}
        </Button>
        <Button
          onClick={() => onDelete(book.id)}
          className="w-full text-sm border border-red-500 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer transition"
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};