import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { calculateDrillingPrice, UserCategory, DrillingCosts } from '@/lib/pricing';
import { getUserCategory } from '@/lib/user-utils';

export async function POST(req: Request) {
  try {
    const { userId, sessionId } = await req.json();

    if (!sessionId) {
        return NextResponse.json({ error: 'Session ID Required' }, { status: 400 });
    }

    // 1. Ambil Data Sesi Drilling (Untuk Costing)
    const sessionDoc = await db.collection('events').doc(sessionId).get();
    if (!sessionDoc.exists) return NextResponse.json({ error: 'Sesi tidak ditemukan' }, { status: 404 });
    
    const sessionData = sessionDoc.data();

    // Pastikan ini Drilling. Jika bukan, return standard price.
    if (sessionData?.type !== 'drilling') {
        const standardPrice = Number(sessionData?.price || 0);
        return NextResponse.json({
            success: true,
            data: {
                hpp: standardPrice,
                marginPercent: 0,
                finalPrice: standardPrice,
                category: 'normal',
                isDrilling: false
            }
        });
    }

    // Ambil Financials dari Event (Recommended) atau Default
    const fin = sessionData?.financials || {};
    const costs: DrillingCosts = {
      courtCost: Number(fin.courtCost) || 175000,
      shuttlecockCost: Number(fin.shuttlecockCost) || 166000, 
      toolCost: Number(fin.toolCost) || 20000,
      coachFee: Number(fin.coachFee) || 300000,
      capacity: Number(fin.capacity) || Number(sessionData?.quota) || 12
    };

    // 2. Tentukan Kategori User
    let category: UserCategory = 'drop_in'; // Default safest
    if (userId) {
       category = await getUserCategory(userId);
    }

    // 3. Hitung Harga
    // Cek apakah sudah ada pre-calculated di database (Optimization)
    let pricing;
    if (sessionData?.price_tier && sessionData.price_tier[category]) {
        // Use stored price to match what Admin saw
        // But we still need HPP for breakdown if needed
        const preCalcPrice = sessionData.price_tier[category];
        const recalc = calculateDrillingPrice(costs, category);
        pricing = {
            ...recalc,
            finalPrice: preCalcPrice, // Override with stored tier to be consistent
            category
        };
    } else {
        pricing = calculateDrillingPrice(costs, category);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...pricing,
        isDrilling: true,
        costs_breakdown: costs 
      }
    });

  } catch (error) {
    console.error("Price Check Error:", error);
    return NextResponse.json({ error: 'Gagal menghitung harga' }, { status: 500 });
  }
}
