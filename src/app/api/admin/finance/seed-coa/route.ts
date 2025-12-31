
import { NextResponse } from 'next/server';
import { db } from "@/lib/firebase-admin";

const INITIAL_COA = [
  // 1-000 ASET (HARTA)
  { code: '1-000', name: 'ASET (HARTA)', type: 'HEADER', is_cash_out: false },
  { code: '1-101', name: 'Kas Bank Operasional', type: 'ASSET', is_cash_out: false, description: 'BCA/Mandiri Utama' },
  { code: '1-102', name: 'Kas Payment Gateway', type: 'ASSET', is_cash_out: false, description: 'Saldo di Midtrans/Xendit' },
  { code: '1-201', name: 'Piutang (Receivable)', type: 'ASSET', is_cash_out: false, description: 'Invoice Corporate yang belum bayar' },
  { code: '1-301', name: 'Persediaan (Inventory)', type: 'ASSET', is_cash_out: true, description: 'Nilai stok Shuttlecock/Jersey' },
  { code: '1-401', name: 'Aset Tetap - Peralatan', type: 'ASSET', is_cash_out: true, description: 'Mesin Drilling, Net, Tiang' },
  { code: '1-402', name: 'Akumulasi Penyusutan', type: 'ASSET', is_cash_out: false, description: 'Pengurang nilai alat', normal_balance: 'CREDIT' },

  // 2-000 KEWAJIBAN (UTANG)
  { code: '2-000', name: 'KEWAJIBAN (UTANG)', type: 'HEADER', is_cash_out: false },
  { code: '2-101', name: 'Utang Gaji / Komisi', type: 'LIABILITY', is_cash_out: false, description: 'Fee Coach belum transfer' },
  { code: '2-102', name: 'Pendapatan Diterima Dimuka', type: 'LIABILITY', is_cash_out: false, description: 'Membership/Pre-order Jersey' },
  { code: '2-103', name: 'Utang Reimbursement', type: 'LIABILITY', is_cash_out: false, description: 'Utang ke Admin/Host' },

  // 3-000 MODAL (EQUITY)
  { code: '3-000', name: 'MODAL (EQUITY)', type: 'HEADER', is_cash_out: false },
  { code: '3-100', name: 'Modal Pemilik', type: 'EQUITY', is_cash_out: false, description: 'Investasi awal' },
  { code: '3-200', name: 'Prive / Dividen', type: 'EQUITY', is_cash_out: true, description: 'Penarikan profit oleh owner', normal_balance: 'DEBIT' },
  { code: '3-300', name: 'Laba Ditahan', type: 'EQUITY', is_cash_out: false, description: 'Akumulasi profit tahun lalu' },

  // 4-000 PENDAPATAN (REVENUE)
  { code: '4-000', name: 'PENDAPATAN (REVENUE)', type: 'HEADER', is_cash_out: false },
  { code: '4-100', name: 'Pendapatan Drilling', type: 'REVENUE', is_cash_out: false, description: 'Tiket sesi drilling' },
  { code: '4-200', name: 'Pendapatan Mabar', type: 'REVENUE', is_cash_out: false, description: 'Tiket sesi mabar' },
  { code: '4-300', name: 'Pendapatan Membership', type: 'REVENUE', is_cash_out: false, description: 'Iuran bulanan/tahunan' },
  { code: '4-400', name: 'Penjualan Merchandise', type: 'REVENUE', is_cash_out: false, description: 'Jersey, Kaos Kaki' },

  // 5-000 BEBAN POKOK (COGS)
  { code: '5-000', name: 'BEBAN POKOK (COGS)', type: 'HEADER', is_cash_out: false },
  { code: '5-100', name: 'Beban Sewa Lapangan', type: 'COGS', is_cash_out: true, description: 'Biaya GOR (Langsung)' },
  { code: '5-200', name: 'Beban Shuttlecock', type: 'COGS', is_cash_out: false, description: 'Kok terpakai di sesi' },
  { code: '5-300', name: 'Beban Jasa Pelatih', type: 'COGS', is_cash_out: true, description: 'Fee Coach per sesi' },
  { code: '5-400', name: 'Beban Payment Gateway', type: 'COGS', is_cash_out: true, description: 'Potongan Midtrans' },
  { code: '5-500', name: 'HPP Merchandise', type: 'COGS', is_cash_out: false, description: 'Modal produksi Jersey terjual' },

  // 6-000 BEBAN OPERASIONAL (OPEX)
  { code: '6-000', name: 'BEBAN OPERASIONAL (OPEX)', type: 'HEADER', is_cash_out: false },
  { code: '6-100', name: 'Beban Server & Tech', type: 'EXPENSE', is_cash_out: true, description: 'Vercel, Firebase, Domain' },
  { code: '6-200', name: 'Beban Pemasaran', type: 'EXPENSE', is_cash_out: true, description: 'Ads, Desain' },
  { code: '6-300', name: 'Beban Penyusutan Aset', type: 'EXPENSE', is_cash_out: false, description: 'Amortisasi alat drilling' },
  { code: '6-400', name: 'Beban Perlengkapan', type: 'EXPENSE', is_cash_out: true, description: 'Air minum, Lakban, P3K' },
];

export async function GET() {
  try {
    const batch = db.batch();

    INITIAL_COA.forEach(account => {
      const docRef = db.collection('finance_coa').doc(account.code); // Use code as ID for easy lookup
      batch.set(docRef, { ...account, createdAt: new Date().toISOString() }, { merge: true });
    });

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${INITIAL_COA.length} accounts to finance_coa collection.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
