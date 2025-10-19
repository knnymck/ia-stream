"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

interface SearchBarProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}
export function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const debouncedQuery = useDebounce(localQuery, 300)

  useEffect(() => {
    setSearchQuery(debouncedQuery)
  }, [debouncedQuery, setSearchQuery])

  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search firms by name, location, or keywords..."
          className="pl-12 h-14 text-base bg-card border-border"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
        />
      </div>
    </div>
  )
}
