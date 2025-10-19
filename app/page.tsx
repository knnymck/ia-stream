"use client"
import { SearchFilters } from "@/components/search-filters"
import { FirmResults } from "@/components/firm-results"
import { SearchBar } from "@/components/search-bar"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase" // Your existing supabase client import

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    state: "",
    minAUM: null,
    maxAUM: null,
    minEmployees: null,
    maxEmployees: null,
    sectors: [],
    isFundOfFunds: false
  })
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

useEffect(() => {
  const fetchFirms = async () => {
    if (!searchQuery && !filters.state && !filters.minAUM && !filters.minEmployees && filters.sectors.length === 0 && !filters.isFundOfFunds) {
      setResults([])
      return
    }

    setLoading(true)
    setError(null)

    let queryBuilder = supabase
      .from('firms')
      .select(`
        *,
        state_registrations!inner (
          state_cd,
          status
        )
      `)
      .ilike('business_name', `%${searchQuery}%`)
      .order('business_name', { ascending: true })
      .limit(100) // Initial limit; implement pagination if needed

    // State filter (using inner join to filter by state_cd)
    if (filters.state && filters.state !== "All States") {
      queryBuilder = queryBuilder.eq('state_registrations.state_cd', filters.state.toUpperCase().slice(0, 2)) // e.g., 'CA' from 'California'
    }

    // AUM filter (adjust JSONB path to your actual AUM field, e.g., part1a->Item5F->>Q5F2C as numeric)
    if (filters.minAUM) {
      queryBuilder = queryBuilder.gte('part1a->Item5F->>Q5F2C::numeric', filters.minAUM)
    }
    if (filters.maxAUM) {
      queryBuilder = queryBuilder.lte('part1a->Item5F->>Q5F2C::numeric', filters.maxAUM)
    }

    // Employees filter
    if (filters.minEmployees) {
      queryBuilder = queryBuilder.gte('total_employees', filters.minEmployees)
    }
    if (filters.maxEmployees) {
      queryBuilder = queryBuilder.lte('total_employees', filters.maxEmployees)
    }

    // Sectors filter (map to JSONB flags in Item5G; adjust mappings)
    if (filters.sectors.length > 0) {
      filters.sectors.forEach(sector => {
        let sectorPath
        switch (sector) {
          case "private-equity":
            sectorPath = 'part1a->Item5G->>Q5G1'
            break
          case "hedge-fund":
            sectorPath = 'part1a->Item5G->>Q5G2'
            break
          case "private-credit":
            sectorPath = 'part1a->Item5G->>Q5G3'
            break
          case "real-estate":
            sectorPath = 'part1a->Item5G->>Q5G4'
            break
          default:
            return
        }
        queryBuilder = queryBuilder.eq(sectorPath, 'Y')
      })
    }

    // Fund of Funds filter (adjust to your JSONB path, e.g., Item5G->>Q5G5 = 'Y')
    if (filters.isFundOfFunds) {
      queryBuilder = queryBuilder.eq('part1a->Item5G->>Q5G5', 'Y')
    }

    const { data, error } = await queryBuilder

    if (error) {
      setError(error.message)
      console.error(error)
    } else {
      setResults(data || [])
    }
    setLoading(false)
  }

  fetchFirms()
}, [searchQuery, filters]) // Re-fetch on changes

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
