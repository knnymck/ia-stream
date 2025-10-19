import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!; // Add this to Vercel env (service role key for server)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const state = searchParams.get('state') || '';
    const minAUM = searchParams.get('minAUM');
    const maxAUM = searchParams.get('maxAUM');
    const minEmployees = searchParams.get('minEmployees');
    const maxEmployees = searchParams.get('maxEmployees');
    const sectors = searchParams.get('sectors')?.split(',') || [];
    const isFundOfFunds = searchParams.get('isFundOfFunds') === 'true';

    let queryBuilder = supabase
      .from('firms')
      .select(`
        *,
        state_registrations!inner (
          state_cd,
          status
        )
      `)
      .ilike('business_name', `%${query}%`)
      .order('business_name', { ascending: true })
      .limit(100);

    // State filter
    if (state && state !== "All States") {
      queryBuilder = queryBuilder.eq('state_registrations.state_cd', state.toUpperCase().slice(0, 2));
    }

    // AUM filter (adjust path)
    if (minAUM) queryBuilder = queryBuilder.gte('part1a->Item5F->>Q5F2C::numeric', Number(minAUM));
    if (maxAUM) queryBuilder = queryBuilder.lte('part1a->Item5F->>Q5F2C::numeric', Number(maxAUM));

    // Employees filter
    if (minEmployees) queryBuilder = queryBuilder.gte('total_employees', Number(minEmployees));
    if (maxEmployees) queryBuilder = queryBuilder.lte('total_employees', Number(maxEmployees));

    // Sectors (adjust paths)
    if (sectors.length > 0) {
      sectors.forEach(sector => {
        let sectorPath = '';
        switch (sector) {
          case "private-equity": sectorPath = 'part1a->Item5G->>Q5G1'; break;
          case "hedge-fund": sectorPath = 'part1a->Item5G->>Q5G2'; break;
          case "private-credit": sectorPath = 'part1a->Item5G->>Q5G3'; break;
          case "real-estate": sectorPath = 'part1a->Item5G->>Q5G4'; break;
        }
        if (sectorPath) queryBuilder = queryBuilder.eq(sectorPath, 'Y');
      });
    }

    // Fund of Funds
    if (isFundOfFunds) {
      queryBuilder = queryBuilder.eq('part1a->Item5G->>Q5G5', 'Y');
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
