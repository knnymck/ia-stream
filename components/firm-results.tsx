"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, MapPin } from "lucide-react"
import { useMemo } from "react"

// Mock data for demonstration - expanded to show at least 24 firms
const MOCK_FIRMS = [
  {
    id: 1,
    name: "Apex Capital Partners",
    location: "New York, NY",
    sector: "Private Equity",
    aum: 12500,
    employees: 145,
    isFundOfFunds: false,
  },
  {
    id: 2,
    name: "Meridian Investment Group",
    location: "San Francisco, CA",
    sector: "Hedge Fund",
    aum: 8300,
    employees: 87,
    isFundOfFunds: true,
  },
  {
    id: 3,
    name: "Sterling Credit Advisors",
    location: "Boston, MA",
    sector: "Private Credit",
    aum: 5600,
    employees: 62,
    isFundOfFunds: false,
  },
  {
    id: 4,
    name: "Horizon Real Estate Fund",
    location: "Austin, TX",
    sector: "Real Estate",
    aum: 3200,
    employees: 34,
    isFundOfFunds: false,
  },
  {
    id: 5,
    name: "Vanguard Alternative Investments",
    location: "Chicago, IL",
    sector: "Private Equity",
    aum: 18700,
    employees: 203,
    isFundOfFunds: true,
  },
  {
    id: 6,
    name: "Catalyst Hedge Strategies",
    location: "Greenwich, CT",
    sector: "Hedge Fund",
    aum: 9800,
    employees: 112,
    isFundOfFunds: false,
  },
  {
    id: 7,
    name: "Pinnacle Credit Solutions",
    location: "Dallas, TX",
    sector: "Private Credit",
    aum: 4200,
    employees: 48,
    isFundOfFunds: false,
  },
  {
    id: 8,
    name: "Metropolitan Property Group",
    location: "Los Angeles, CA",
    sector: "Real Estate",
    aum: 6800,
    employees: 76,
    isFundOfFunds: false,
  },
  {
    id: 9,
    name: "Blackstone Equity Partners",
    location: "New York, NY",
    sector: "Private Equity",
    aum: 25000,
    employees: 312,
    isFundOfFunds: false,
  },
  {
    id: 10,
    name: "Quantum Hedge Fund",
    location: "Miami, FL",
    sector: "Hedge Fund",
    aum: 7500,
    employees: 94,
    isFundOfFunds: true,
  },
  {
    id: 11,
    name: "Atlas Credit Partners",
    location: "Seattle, WA",
    sector: "Private Credit",
    aum: 3900,
    employees: 41,
    isFundOfFunds: false,
  },
  {
    id: 12,
    name: "Empire Realty Advisors",
    location: "New York, NY",
    sector: "Real Estate",
    aum: 8900,
    employees: 103,
    isFundOfFunds: false,
  },
  {
    id: 13,
    name: "Summit Capital Group",
    location: "Denver, CO",
    sector: "Private Equity",
    aum: 11200,
    employees: 128,
    isFundOfFunds: false,
  },
  {
    id: 14,
    name: "Fortress Hedge Strategies",
    location: "Boston, MA",
    sector: "Hedge Fund",
    aum: 15600,
    employees: 187,
    isFundOfFunds: false,
  },
  {
    id: 15,
    name: "Titan Credit Fund",
    location: "Charlotte, NC",
    sector: "Private Credit",
    aum: 5100,
    employees: 58,
    isFundOfFunds: true,
  },
  {
    id: 16,
    name: "Skyline Property Investments",
    location: "San Diego, CA",
    sector: "Real Estate",
    aum: 4700,
    employees: 52,
    isFundOfFunds: false,
  },
  {
    id: 17,
    name: "Redwood Equity Partners",
    location: "Portland, OR",
    sector: "Private Equity",
    aum: 9300,
    employees: 107,
    isFundOfFunds: false,
  },
  {
    id: 18,
    name: "Citadel Alternative Investments",
    location: "Chicago, IL",
    sector: "Hedge Fund",
    aum: 22000,
    employees: 276,
    isFundOfFunds: true,
  },
  {
    id: 19,
    name: "Anchor Credit Advisors",
    location: "Philadelphia, PA",
    sector: "Private Credit",
    aum: 6200,
    employees: 71,
    isFundOfFunds: false,
  },
  {
    id: 20,
    name: "Cornerstone Real Estate",
    location: "Atlanta, GA",
    sector: "Real Estate",
    aum: 5500,
    employees: 64,
    isFundOfFunds: false,
  },
  {
    id: 21,
    name: "Everest Capital Management",
    location: "San Francisco, CA",
    sector: "Private Equity",
    aum: 16800,
    employees: 195,
    isFundOfFunds: false,
  },
  {
    id: 22,
    name: "Maverick Hedge Fund",
    location: "Houston, TX",
    sector: "Hedge Fund",
    aum: 10500,
    employees: 124,
    isFundOfFunds: false,
  },
  {
    id: 23,
    name: "Lighthouse Credit Partners",
    location: "Nashville, TN",
    sector: "Private Credit",
    aum: 4500,
    employees: 49,
    isFundOfFunds: false,
  },
  {
    id: 24,
    name: "Gateway Property Fund",
    location: "Phoenix, AZ",
    sector: "Real Estate",
    aum: 3800,
    employees: 42,
    isFundOfFunds: true,
  },
]

interface FirmResultsProps {
  searchQuery: string
}

export function FirmResults({ searchQuery }: FirmResultsProps) {
  const filteredFirms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return MOCK_FIRMS

    return MOCK_FIRMS.filter((firm) => {
      return (
        firm.name.toLowerCase().includes(query) ||
        firm.location.toLowerCase().includes(query) ||
        firm.sector.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredFirms.length}</span> firms
        </p>
      </div>

      {filteredFirms.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No firms found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {filteredFirms.map((firm) => (
            <Card
              key={firm.id}
              className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer flex flex-col"
            >
              <div className="mb-3">
                <h3 className="text-base font-semibold text-card-foreground mb-2 text-balance">{firm.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{firm.location}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="bg-accent/10 text-accent-foreground border-accent/20 text-xs">
                    {firm.sector}
                  </Badge>
                  {firm.isFundOfFunds && (
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
                    <p className="text-sm font-medium text-card-foreground">${firm.aum.toLocaleString()}M</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-muted">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="text-sm font-medium text-card-foreground">{firm.employees}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
