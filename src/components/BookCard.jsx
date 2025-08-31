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
    <div className="group relative">
             <div className={`absolute inset-0 rounded-3xl blur-xl opacity-20 transition-opacity duration-300 ${
         isRead ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600' : 'bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600'
       } group-hover:opacity-30`}></div>
             <Card className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-200/50 hover:border-slate-300/50 hover:-translate-y-2 h-full group-hover:shadow-blue-500/10">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                {book.title}
              </CardTitle>
              <CardDescription className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                by <span className="font-semibold text-slate-700">{book.author}</span>
              </CardDescription>
            </div>
                         <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-1 shadow-lg ${
               isRead ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-gradient-to-r from-indigo-500 to-blue-500'
             }`}></div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
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
        </CardContent>

        <CardFooter className="flex gap-3 pt-4">
          <Button
            onClick={() => onToggleRead(book.id)}
                         className={`flex-1 text-sm border-2 cursor-pointer transition-all duration-300 rounded-2xl font-medium ${
               isRead
                 ? "border-indigo-500 text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-blue-500 hover:text-white hover:shadow-lg hover:shadow-indigo-500/25"
                 : "border-blue-500 text-blue-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/25"
             }`}
          >
            {isRead ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mark Unread
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Mark Read
              </>
            )}
          </Button>
          <Button
            onClick={() => onDelete(book.id)}
            className="flex-1 text-sm border-2 border-red-500 text-red-600 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white cursor-pointer transition-all duration-300 rounded-2xl font-medium hover:shadow-lg hover:shadow-red-500/25"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};