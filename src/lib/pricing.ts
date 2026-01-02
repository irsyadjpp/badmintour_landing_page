export type UserCategory = 'trial' | 'student' | 'member' | 'normal' | 'drop_in';

export type DrillingCosts = {
  courtCost: number;       // Sewa Lapangan
  shuttlecockCost: number; // Estimasi kok habis
  toolCost: number;        // Sewa alat (penyusutan)
  coachFee: number;        // Honor Pelatih
  capacity: number;        // Target peserta
};

export const MARGINS: Record<UserCategory, number> = {
  trial: -0.14,  // Subsidi 14%
  student: 0.03, // Profit 3%
  member: 0.12,  // Profit 12%
  normal: 0.20,  // Profit 20%
  drop_in: 0.29  // Profit 29%
};

export function calculateDrillingPrice(costs: DrillingCosts, category: UserCategory) {
  // 1. Hitung HPP per Orang
  const totalCost = Number(costs.courtCost) + Number(costs.shuttlecockCost) + Number(costs.toolCost) + Number(costs.coachFee);
  const hppPerPerson = totalCost / (Number(costs.capacity) || 12);

  // 2. Ambil Margin sesuai kategori
  const margin = MARGINS[category];

  // 3. Hitung Harga Mentah
  const rawPrice = hppPerPerson + (hppPerPerson * margin);

  // 4. PEMBULATAN KHUSUS (Kelipatan 5.000 ke atas)
  // Contoh: 41.500 -> 45.000, 54.000 -> 55.000
  const finalPrice = Math.ceil(rawPrice / 5000) * 5000;

  return {
    hpp: Math.ceil(hppPerPerson),
    marginPercent: margin * 100,
    rawPrice: Math.ceil(rawPrice),
    finalPrice: finalPrice,
    category
  };
}

export function generatePriceTiers(costs: DrillingCosts) {
  return {
    trial: calculateDrillingPrice(costs, 'trial').finalPrice,
    student: calculateDrillingPrice(costs, 'student').finalPrice,
    member: calculateDrillingPrice(costs, 'member').finalPrice,
    normal: calculateDrillingPrice(costs, 'normal').finalPrice,
    drop_in: calculateDrillingPrice(costs, 'drop_in').finalPrice,
  };
}
