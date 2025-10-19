"use client"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

const US_STATES = [
  "All States",
  "California",
  "New York",
  "Texas",
  "Florida",
  "Illinois",
  "Massachusetts",
  "Connecticut",
  "Pennsylvania",
  "New Jersey",
  "Delaware",
]
const SECTORS = [
  { id: "private-equity", label: "Private Equity" },
  { id: "hedge-fund", label: "Hedge Fund" },
  { id: "private-credit", label: "Private Credit" },
  { id: "real-estate", label: "Real Estate" },
]

interface SearchFiltersProps {
  filters: any
  setFilters: (filters: any) => void
}

export function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const toggleSector = (sectorId: string) => {
    setFilters({
      ...filters,
      sectors: filters.sectors.includes(sectorId)
        ? filters.sectors.filter((id: string) => id !== sectorId)
        : [...filters.sectors, sectorId]
    })
  }

  return (
    <div className="space-y-6">
      {/* State Filter */}
      <div className="space-y-3">
        <Label htmlFor="state" className="text-sm font-medium text-foreground">
          State
        </Label>
        <Select
          value={filters.state}
          onValueChange={(value) => setFilters({ ...filters, state: value })}
        >
          <SelectTrigger id="state" className="bg-background border-border">
            <SelectValue placeholder="Select state" />
          </SelectTrigger>
          <SelectContent>
            {US_STATES.map((state) => (
              <SelectItem key={state} value={state}>
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator className="bg-border" />
      {/* Assets Under Management */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Assets Under Management</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              placeholder="Min (millions)" 
              className="bg-background border-border"
              value={filters.minAUM || ""}
              onChange={(e) => setFilters({ ...filters, minAUM: e.target.value ? Number(e.target.value) : null })}
            />
            <span className="text-muted-foreground">—</span>
            <Input 
              type="number" 
              placeholder="Max (millions)" 
              className="bg-background border-border"
              value={filters.maxAUM || ""}
              onChange={(e) => setFilters({ ...filters, maxAUM: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
          <p className="text-xs text-muted-foreground">Amount in USD millions</p>
        </div>
      </div>
      <Separator className="bg-border" />
      {/* Number of Employees */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Number of Employees</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Input 
              type="number" 
              placeholder="Min" 
              className="bg-background border-border"
              value={filters.minEmployees || ""}
              onChange={(e) => setFilters({ ...filters, minEmployees: e.target.value ? Number(e.target.value) : null })}
            />
            <span className="text-muted-foreground">—</span>
            <Input 
              type="number" 
              placeholder="Max" 
              className="bg-background border-border"
              value={filters.maxEmployees || ""}
              onChange={(e) => setFilters({ ...filters, maxEmployees: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        </div>
      </div>
      <Separator className="bg-border" />
      {/* Sector Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-foreground">Sector</Label>
        <div className="space-y-3">
          {SECTORS.map((sector) => (
            <div key={sector.id} className="flex items-center space-x-2">
              <Checkbox
                id={sector.id}
                checked={filters.sectors.includes(sector.id)}
                onCheckedChange={() => toggleSector(sector.id)}
              />
              <label
                htmlFor={sector.id}
                className="text-sm text-foreground cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {sector.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <Separator className="bg-border" />
      {/* Fund of Funds */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="fund-of-funds" className="text-sm font-medium text-foreground">
              Fund of Funds
            </Label>
            <p className="text-xs text-muted-foreground">Show only fund of funds</p>
          </div>
          <Switch 
            id="fund-of-funds" 
            checked={filters.isFundOfFunds} 
            onCheckedChange={(checked) => setFilters({ ...filters, isFundOfFunds: checked })} 
          />
        </div>
      </div>
    </div>
  )
}
