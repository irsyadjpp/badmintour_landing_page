
// --- SHARED DATA & TYPES ---

// --- CHART OF ACCOUNTS (COA) ---
export const COA = {
  ASSETS: { // 1-000 ASET (Harta)
    HEADER: '1-000',
    CASH_BANK: '1-101', // Kas Bank Operasional (BCA/Mandiri)
    CASH_PAYMENT_GATEWAY: '1-102', // Kas Payment Gateway (Midtrans/Xendit)
    RECEIVABLE: '1-201', // Piutang (Invoice Corporate)
    INVENTORY_GOODS: '1-301', // Persediaan (Stok Shuttlecock/Jersey)
    FIXED_ASSET_EQUIPMENT: '1-401', // Aset Tetap - Peralatan
    ACCUMULATED_DEPRECIATION: '1-402', // Akumulasi Penyusutan
  },
  LIABILITY: { // 2-000 KEWAJIBAN
    HEADER: '2-000',
    PAYABLE_SALARY_COMMISSION: '2-101', // Utang Gaji / Komisi (Fee Coach)
    UNEARNED_REVENUE: '2-102', // Pendapatan Diterima Dimuka
    PAYABLE_REIMBURSEMENT: '2-103', // Utang Reimbursement (Ke Admin/Host)
  },
  EQUITY: { // 3-000 MODAL
    HEADER: '3-000',
    OWNER_CAPITAL: '3-100', // Modal Pemilik
    DRAWING_DIVIDEND: '3-200', // Prive / Dividen
    RETAINED_EARNINGS: '3-300', // Laba Ditahan
  },
  REVENUE: { // 4-000 PENDAPATAN
    HEADER: '4-000',
    DRILLING: '4-100', // Pendapatan Drilling
    MABAR: '4-200', // Pendapatan Mabar
    MEMBERSHIP: '4-300', // Pendapatan Membership
    MERCHANDISE_SALES: '4-400', // Penjualan Merchandise
  },
  COGS: { // 5-000 BEBAN POKOK
    HEADER: '5-000',
    COURT_RENTAL: '5-100', // Beban Sewa Lapangan
    SHUTTLECOCK_COST: '5-200', // Beban Shuttlecock
    COACH_FEE: '5-300', // Beban Jasa Pelatih
    GATEWAY_FEE: '5-400', // Beban Payment Gateway
    MERCHANDISE_COGS: '5-500', // HPP Merchandise
  },
  OPEX: { // 6-000 BEBAN OPERASIONAL
    HEADER: '6-000',
    SERVER_TECH: '6-100', // Beban Server & Tech
    MARKETING: '6-200', // Beban Pemasaran
    DEPRECIATION_EXPENSE: '6-300', // Beban Penyusutan Aset
    SUPPLIES: '6-400', // Beban Perlengkapan
    MAINTENANCE: '6-500', // Beban Pemeliharaan & Perbaikan
    OTHER: '6-900', // Beban Lain-lain (Loss/Correction)
  }
};

export type LedgerEntry = {
  accountCode: string;
  debit: number;
  credit: number;
  description?: string;
};

export type TxBreakdownItem = {
  item: string;
  qty: number;
  cost: number;
  recipient?: string; // e.g. Coach Budi
};

export type JournalTransaction = {
  date: string; // ISO String
  refId: string; // BookingID, OrderID, or SessionID
  description: string;
  category: 'REVENUE' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'EQUITY';
  entries: LedgerEntry[];
  metadata?: {
    breakdown?: TxBreakdownItem[]; // Added for Detailed Unit Economics
    sessionId?: string;
    notes?: string;
    proofImage?: string; // Base64 or URL
  };
  status: 'posted' | 'draft';
  createdBy?: string;
};

export type PayoutRequest = {
  id: string;
  coachId: string;
  coachName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  bankDetails?: string; // e.g. "BCA 1234567890"
  notes?: string;
  requestedAt: string;
  processedAt?: string;
  processedBy?: string; // Admin ID
  ticketRef?: string; // Reference to support ticket or similar
};
