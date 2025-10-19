"use client"
import { SearchFilters } from "@/components/search-filters"
import { FirmResults } from "@/components/firm-results"
import { SearchBar } from "@/components/search-bar"
import { useState, useEffect } from "react"

interface Firm {
  id: number
  business_name: string
  legal_name: string
  total_employees: number
  part1a: any
  state_registrations: { state_cd: string; status: string }[]
}

interface Filters {
  state: string
  minAUM: number | null
  maxAUM: number | null
  minEmployees: number | null
  maxEmployees: number | null
  sectors: string[]
  isFundOfFunds: boolean
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<Filters>({
    state: "",
    minAUM: null,
    maxAUM: null,
    minEmployees: null,
    maxEmployees: null,
    sectors: [],
    isFundOfFunds: false
  })
  const [results, setResults] = useState<Firm[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFirms = async () => {
      if (!searchQuery && !filters.state && !filters.minAUM && !filters.minEmployees && filters.sectors.length === 0 && !filters.isFundOfFunds) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        query: searchQuery,
        state: filters.state,
      })

      if (filters.minAUM !== null) params.append('minAUM', filters.minAUM.toString())
      if (filters.maxAUM !== null) params.append('maxAUM', filters.maxAUM.toString())
      if (filters.minEmployees !== null) params.append('minEmployees', filters.minEmployees.toString())
      if (filters.maxEmployees !== null) params.append('maxEmployees', filters.maxEmployees.toString())
      if (filters.sectors.length > 0) params.append('sectors', filters.sectors.join(','))
      if (filters.isFundOfFunds) params.append('isFundOfFunds', 'true')

      const response = await fetch(`/api/search?${params}`)

      if (!response.ok) {
        const err = await response.json()
        setError(err.error || 'Failed to fetch')
        console.error(err)
        setLoading(false)
        return
      }

      const { data } = await response.json()
      setResults(data || [])
      setLoading(false)
    }

    fetchFirms()
  }, [searchQuery, filters])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Left Sidebar - Filters */}
        <aside className="w-80 border-r border-border bg-card p-6 min-h-screen sticky top-0">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-card-foreground mb-1">Filter Firms</h2>
            <p className="text-sm text-muted-foreground">Refine your search results</p>
          </div>
          <SearchFilters filters={filters} setFilters={setFilters} />
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-3 text-balance">Financial Firms Directory</h1>
              <p className="text-lg text-muted-foreground">Search and discover investment firms across sectors</p>
            </div>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            {loading && <p className="text-center text-muted-foreground">Loading results...</p>}
            {error && <p className="text-red-500 text-center">Error: {error}</p>}
            {(searchQuery || Object.values(filters).some(v => v)) && !loading && <FirmResults results={results} searchQuery={searchQuery} />}
            {!searchQuery && Object.values(filters).every(v => !v) && (
              <p className="text-center text-muted-foreground mt-8">Enter a search term or apply filters to see results.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
