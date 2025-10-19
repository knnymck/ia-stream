"use client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, MapPin } from "lucide-react"

interface Firm {
  id: number
  business_name: string
  legal_name: string
  total_employees: number
  part1a: any
  state_registrations: { state_cd: string; status: string }[]
  org_state: string | null // Added to fix type error for location fallback
}

interface FirmResultsProps {
  results: Firm[]
  searchQuery: string
}

export function FirmResults({ results, searchQuery }: FirmResultsProps) {
  if (results.length === 0) {
    return <div className="text-center py-12">
      <p className="text-muted-foreground">No firms found matching your search.</p>
    </div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{results.length}</span> firms
        </p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {results.map((firm) => {
          // Extract AUM from JSONB (from schema: part1a.Item5F.Q5F2C as string/number)
          const aum = Number(firm.part1a?.Item5F?.[0]?.Q5F2C?.[0] || 0)
          // Extract sector from Item5G flags (adjust based on your data; e.g., Q5G1 = 'Y' for Private Equity)
          let sector = "Unknown"
          if (firm.part1a?.Item5G?.[0]?.Q5G1?.[0] === "Y") sector = "Private Equity"
          else if (firm.part1a?.Item5G?.[0]?.Q5G2?.[0] === "Y") sector = "Hedge Fund"
          else if (firm.part1a?.Item5G?.[0]?.Q5G3?.[0] === "Y") sector = "Private Credit"
          else if (firm.part1a?.Item5G?.[0]?.Q5G4?.[0] === "Y") sector = "Real Estate"
          // Location from schema: state_registrations.state_cd or org_state
          const location = firm.state_registrations?.[0]?.state_cd || firm.org_state || "N/A"
          // Is Fund of Funds (example: Q5G5 = 'Y' from schema)
          const isFundOfFunds = firm.part1a?.Item5G?.[0]?.Q5G5?.[0] === "Y"

          return (
            <Card
              key={firm.id}
              className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col"
            >
              <div className="mb-3">
                <h3 className="text-base font-semibold text-card-foreground mb-2 text-balance">{firm.business_name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20 text-xs">
                    {sector}
                  </Badge>
                  {isFundOfFunds && (
                    <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                      FoF
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2.5 mt-auto">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">AUM</p>
                    <p className="text-sm font-medium text-card-foreground">${aum.toLocaleString()}M</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="text-sm font-medium text-card-foreground">{firm.total_employees}</p>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
