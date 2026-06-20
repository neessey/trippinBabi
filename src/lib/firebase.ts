import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, orderBy, getDocFromServer } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Direct configuration from firebase-applet-config.json for bullet-proof runtime stability
const firebaseConfig = {
  projectId: "trippinbabi-48e3f",
  appId: "1:1060265086887:web:e29b3fa4acdfec47a8b082",
  apiKey: "AIzaSyD5KWbGXB_qkOz_dyNUD1QIqJaVqZNjRhs",
  authDomain: "trippinbabi-48e3f.firebaseapp.com",
  databaseId: "default",
  storageBucket: "trippinbabi-48e3f.firebasestorage.app",
  messagingSenderId: "1060265086887"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.databaseId);
const auth = getAuth(app);

export { app, db, auth };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Connection to Firestore on startup as per critical guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline. Local caching and offline mode will be active.");
    }
  }
}
testConnection();

// Interface for Activity of the Month
export interface MonthlyActivity {
  title: string;
  italicTitle: string;
  description: string;
  duration: string;
  groupSize: string;
  price: string;
  monthDate: string; // e.g. "JANVIER 2026"
  imageUrl: string;
  programmeComplet: string; // markdown or plain text for detailed program
}

// Default values matching the photo exactly!
export const DEFAULT_MONTHLY_ACTIVITY: MonthlyActivity = {
  title: "La Cacaoterie ",
  italicTitle: "de la fève à la tablette.",
  description: "Une matinée immersive auprès d'un maître chocolatier ivoirien. Torréfaction, concassage, conchage : repartez avec votre propre tablette signée, et une nouvelle lecture du terroir cacao.",
  duration: "3 h",
  groupSize: "5 pax min.",
  price: "45 000 F",
  monthDate: "JANVIER 2026",
  imageUrl: "/src/assets/images/cacao.png",
  programmeComplet: " Programme de l'Atelier La Cacaoterie\n\n- Accueil chaleureux avec une infusion traditionnelle de coques de cacao.\n- Introduction théorique à l'histoire du cacao en Côte d'Ivoire.\n- Étape 1 : Torréfaction des fèves brutes pour développer les arômes.\n- Étape 2 : Concassage scientifique et séparation des coques.\n- Étape 3 : Conchage artisanal et ajout d'épices locales (fleur de sel de Grand-Assinie, piment d'Espelette, vanille sauvage).\n- Étape 4 : Moulage et personnalisation de votre tablette.\n- Repartez avec votre création unique emballée par vos soins et un livret souvenir."
};

// Functions to manage Activity of the Month in Firestore
export async function getMonthlyActivity(): Promise<MonthlyActivity> {
  const path = "settings/activity_of_the_month";
  try {
    const docRef = doc(db, "settings", "activity_of_the_month");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as MonthlyActivity;
    } else {
      // If none exists, save the default one and return it!
      await setDoc(docRef, DEFAULT_MONTHLY_ACTIVITY);
      return DEFAULT_MONTHLY_ACTIVITY;
    }
  } catch (error: any) {
    if (error?.code === "permission-denied" || (error instanceof Error && error.message.toLowerCase().includes("permission"))) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.error("Error fetching activity of the month from Firebase, falling back to local defaults:", error);
    return DEFAULT_MONTHLY_ACTIVITY;
  }
}

export async function updateMonthlyActivity(data: Partial<MonthlyActivity>) {
  const path = "settings/activity_of_the_month";
  try {
    const docRef = doc(db, "settings", "activity_of_the_month");
    await setDoc(docRef, data, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Interface for Email Configurations
export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
  senderName: string;
}

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  serviceId: "",
  templateId: "",
  publicKey: "",
  senderName: "Trippin Babi"
};

export async function getEmailConfig(): Promise<EmailConfig> {
  const path = "settings/email_config";
  try {
    const docRef = doc(db, "settings", "email_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as EmailConfig;
    } else {
      await setDoc(docRef, DEFAULT_EMAIL_CONFIG);
      return DEFAULT_EMAIL_CONFIG;
    }
  } catch (error: any) {
    console.error("Error fetching email configuration, falling back to empty:", error);
    return DEFAULT_EMAIL_CONFIG;
  }
}

export async function updateEmailConfig(data: Partial<EmailConfig>) {
  const path = "settings/email_config";
  try {
    const docRef = doc(db, "settings", "email_config");
    await setDoc(docRef, data, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Interface for Security Configurations
export interface SecurityConfig {
  adminPasscode: string;
  allowedIPsString: string;
  sessionTimeoutMinutes: number;
  failedAttemptsLimit: number;
  isTwoFactorSimulated: boolean;
  isSystemReadOnly: boolean;
  lastChangedAt: number;
}

export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  adminPasscode: "babi2026",
  allowedIPsString: "",
  sessionTimeoutMinutes: 30,
  failedAttemptsLimit: 5,
  isTwoFactorSimulated: false,
  isSystemReadOnly: false,
  lastChangedAt: Date.now()
};

export async function getSecurityConfig(): Promise<SecurityConfig> {
  const path = "settings/security_config";
  try {
    const docRef = doc(db, "settings", "security_config");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...DEFAULT_SECURITY_CONFIG, ...docSnap.data() } as SecurityConfig;
    } else {
      await setDoc(docRef, DEFAULT_SECURITY_CONFIG);
      return DEFAULT_SECURITY_CONFIG;
    }
  } catch (error: any) {
    console.error("Error fetching security configuration:", error);
    return DEFAULT_SECURITY_CONFIG;
  }
}

export async function updateSecurityConfig(data: Partial<SecurityConfig>) {
  const path = "settings/security_config";
  try {
    const docRef = doc(db, "settings", "security_config");
    await setDoc(docRef, { ...data, lastChangedAt: Date.now() }, { merge: true });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Interface for Contact / Corporate Request Message
export interface ContactRequest {
  id?: string;
  name: string;
  email: string;
  company?: string;
  subject: string;
  message: string;
  createdAt: number;
}

// Interface for Booking/Reservation Request
export interface Booking {
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

// Firestore operations for contact, bookings and items
export async function createContactRequest(request: Omit<ContactRequest, "createdAt">): Promise<void> {
  const path = "messages";
  try {
    const colRef = collection(db, "messages");
    await addDoc(colRef, {
      ...request,
      createdAt: Date.now()
    });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function createBooking(booking: Omit<Booking, "createdAt" | "status">): Promise<void> {
  const path = "bookings";
  try {
    const colRef = collection(db, "bookings");
    await addDoc(colRef, {
      ...booking,
      createdAt: Date.now(),
      status: "pending"
    });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  const path = "messages";
  try {
    const colRef = collection(db, "messages");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: ContactRequest[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as ContactRequest);
    });
    return results;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function getBookings(): Promise<Booking[]> {
  const path = "bookings";
  try {
    const colRef = collection(db, "bookings");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const results: Booking[] = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() } as Booking);
    });
    return results;
  } catch (error: any) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateBookingStatus(id: string, status: "pending" | "confirmed" | "cancelled"): Promise<void> {
  const path = `bookings/${id}`;
  try {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, { status });
  } catch (error: any) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
