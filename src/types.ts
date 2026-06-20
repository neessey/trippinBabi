export interface MonthlyActivity {
  title: string;
  italicTitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: string;
  monthDate: string; // e.g. "JANVIER 2026"
  imageUrl: string;
  programmeComplet?: string;
}

export interface ActivityCard {
  id: string;
  indexCode: string;
  title: string;
  description: string;
  category: "experiences" | "jeux-culturels" | "circuits" | "team-building" | "ateliers";
  details: string;
  paxLimit: string;
  price: string;
  duration: string;
  image: string
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: number;
}

export interface BookingRequest {
  id?: string;
  activityTitle: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  bookingDate: string;
  paxCount: number;
  notes?: string;
  createdAt: number;
  status: "pending" | "confirmed" | "cancelled";
}
