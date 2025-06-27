import { Button } from "@/components/ui/button"

export const BookFilters = ({ filter, setFilter }) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant={filter === "all" ? "default" : "outline"} 
        onClick={() => setFilter("all")}
        className="px-4 py-2"
      >
        All
      </Button>
      <Button 
        variant={filter === "read" ? "default" : "outline"} 
        onClick={() => setFilter("read")}
        className="px-4 py-2"
      >
        Read
      </Button>
      <Button 
        variant={filter === "unread" ? "default" : "outline"} 
        onClick={() => setFilter("unread")}
        className="px-4 py-2"
      >
        Unread
      </Button>
    </div>
  )
}