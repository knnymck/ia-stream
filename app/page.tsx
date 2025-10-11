"use client"

import { SearchFilters } from "@/components/search-filters"
import { FirmResults } from "@/components/firm-results"
import { SearchBar } from "@/components/search-bar"
import { useState } from "react"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className="w-80 border-r border-border bg-card p-6 min-h-screen sticky top-0">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Filter Firms</h2>
            <p className="text-sm text-muted-foreground">Refine your search results</p>
          </div>
          <SearchFilters />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Financial Firms Directory</h1>
              <p className="text-lg text-muted-foreground">Search and discover investment firms across sectors</p>
            </div>

            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {searchQuery && <FirmResults searchQuery={searchQuery} />}
          </div>
        </main>
      </div>
    </div>
  )
}
