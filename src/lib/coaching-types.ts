export interface CoachingModule {
  id?: string;
  coachId: string; // The creator (Coach)
  coachName?: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advance' | 'All Level';
  drills: string[]; // List of specific drills, e.g. ["Shadow 6 points", "Multiball Smash"]
  durationMinutes: number;
  tags: string[]; // Focus areas e.g. ["Netting", "Agility"]
  description?: string;
  createdAt?: any; // Timestamp
}
