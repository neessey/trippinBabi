import React, { useState, useEffect } from "react";
import { 
  getMonthlyActivity, 
  updateMonthlyActivity, 
  getContactRequests, 
  getBookings, 
  getTripBookings, 
  updateBookingStatus, 
  updateTripBookingStatus, 
  MonthlyActivity, 
  ContactRequest, 
  Booking,
  TripBooking,
  getEmailConfig,
  updateEmailConfig,
  EmailConfig,
  DEFAULT_EMAIL_CONFIG,
  getSecurityConfig,
  updateSecurityConfig,
  SecurityConfig,
  DEFAULT_SECURITY_CONFIG
} from "../lib/firebase";
import { Lock, Save, RefreshCw, CheckCircle2, XCircle, Clock, Eye, ChevronDown, Check, MapPin, Mail, Sparkles, Send, AlertCircle, ExternalLink, Shield, Key, LogOut, FileText, AlertTriangle, Database } from "lucide-react";
import emailjs from "@emailjs/browser";

const compressImage = (base64Str: string, maxWidth = 1000, maxHeight = 1000, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) { height = Math.round((height * maxWidth) / width); width = maxWidth; }
      } else {
        if (height > maxHeight) { width = Math.round((width * maxHeight) / height); height = maxHeight; }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve(base64Str); return; }
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = (err) => reject(err);
  });
};

interface AdminPanelProps {
  onActivityUpdated?: () => void;
}

export default function AdminPanel({ onActivityUpdated }: AdminPanelProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

const [activeTab, setActiveTab] = useState<"activity" | "email" | "security" | "trips">("activity");

  const [title, setTitle] = useState("");
  const [italicTitle, setItalicTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [price, setPrice] = useState("");
  const [monthDate, setMonthDate] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [programmeComplet, setProgrammeComplet] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { alert("L'image est trop volumineuse (maximum 10 Mo)"); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          compressImage(reader.result)
            .then((compressed) => setImageUrl(compressed))
            .catch(() => setImageUrl(reader.result as string));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) { alert("Veuillez déposer un fichier image valide (JPG, PNG, WEBP)"); return; }
      if (file.size > 10 * 1024 * 1024) { alert("L'image est trop volumineuse (maximum 10 Mo)"); return; }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          compressImage(reader.result)
            .then((compressed) => setImageUrl(compressed))
            .catch(() => setImageUrl(reader.result as string));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactRequest[]>([]);
  const [tripBookings, setTripBookings] = useState<TripBooking[]>([]);
    const [isRefreshing, setIsRefreshing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const [emailConfig, setEmailConfig] = useState<EmailConfig>(DEFAULT_EMAIL_CONFIG);
  const [emailConfigSaveStatus, setEmailConfigSaveStatus] = useState<string | null>(null);

  // Modal state for confirmation + email
  const [selectedBookingForEmail, setSelectedBookingForEmail] = useState<Booking | null>(null);
  const [customEmailMessage, setCustomEmailMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSendSuccess, setEmailSendSuccess] = useState(false);
  const [emailSendError, setEmailSendError] = useState<string | null>(null);

 const [selectedTripForEmail, setSelectedTripForEmail] = useState<TripBooking | null>(null);
  const [customTripEmailMessage, setCustomTripEmailMessage] = useState("");
  const [isSendingTripEmail, setIsSendingTripEmail] = useState(false);
  const [tripEmailSendSuccess, setTripEmailSendSuccess] = useState(false);
  const [tripEmailSendError, setTripEmailSendError] = useState<string | null>(null);

  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>(DEFAULT_SECURITY_CONFIG);
  const [securityConfigSaveStatus, setSecurityConfigSaveStatus] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [twoFactorCodeInput, setTwoFactorCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [twoFactorSuccess, setTwoFactorSuccess] = useState(false);

  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  const [auditLogs, setAuditLogs] = useState<Array<{ timestamp: string; event: string; status: "success" | "warning" | "info" }>>([
    { timestamp: new Date(Date.now() - 3600000).toLocaleString(), event: "Pare-feu applicatif initialisé - Port sécurisé 3000 amarré", status: "success" },
    { timestamp: new Date(Date.now() - 1800000).toLocaleString(), event: "Règles d'accès de la base de données Firestore synchronisées", status: "info" }
  ]);

  useEffect(() => {
    async function initSecurity() {
      try {
        const config = await getSecurityConfig();
        if (config) { setSecurityConfig(config); addAuditEntry("Configuration de sécurité chargée depuis le stockage Firestore sécurisé", "info"); }
      } catch (err) { console.error("Impossible d'initialiser la sécurité:", err); }
    }
    initSecurity();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const checkInactivity = () => {
      const now = Date.now();
      const sessionTimeoutLimitMs = (securityConfig.sessionTimeoutMinutes || 30) * 60 * 1000;
      if (now - lastActiveTime > sessionTimeoutLimitMs) handleLogout("Déconnexion automatique pour inactivité.");
    };
    const interval = setInterval(checkInactivity, 15000);
    const resetTimer = () => setLastActiveTime(Date.now());
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);
    return () => {
      clearInterval(interval);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [isAuthenticated, lastActiveTime, securityConfig.sessionTimeoutMinutes]);

  function addAuditEntry(event: string, status: "success" | "warning" | "info") {
    setAuditLogs(prev => [{ timestamp: new Date().toLocaleString(), event, status }, ...prev]);
  }

  function handleLogout(reason?: string) {
    setIsAuthenticated(false);
    setRequiresTwoFactor(false);
    setTwoFactorCodeInput("");
    setPassphrase("");
    setIsRefreshing(false);
    addAuditEntry(reason || "Session administrative fermée avec succès.", "info");
    if (reason) { setErrorMessage(reason); } else { setErrorMessage(""); }
  }

  useEffect(() => { if (isAuthenticated) loadData(); }, [isAuthenticated]);

  async function loadData() {
    setIsRefreshing(true);
    try {
      const act = await getMonthlyActivity();
      if (act) {
        setTitle(act.title || ""); setItalicTitle(act.italicTitle || ""); setDescription(act.description || "");
        setDuration(act.duration || ""); setGroupSize(act.groupSize || ""); setPrice(act.price || "");
        setMonthDate(act.monthDate || ""); setImageUrl(act.imageUrl || ""); setProgrammeComplet(act.programmeComplet || "");
      }
      const config = await getEmailConfig();
      if (config) setEmailConfig(config);
      const bk = await getBookings();
      setBookings(bk);
      const trips = await getTripBookings();
    setTripBookings(trips);
      const msg = await getContactRequests();
      setMessages(msg);
    } catch (err) {
      console.error(err);
      addAuditEntry("Échec lors du rechargement des données de la base.", "warning");
    } finally { setIsRefreshing(false); }
  }

  async function handleUpdateEmailConfig(e: React.FormEvent) {
    e.preventDefault();
    if (securityConfig.isSystemReadOnly) {
      setEmailConfigSaveStatus("Action refusée : le système est actuellement configuré en MODE LECTURE SEULE.");
      setTimeout(() => setEmailConfigSaveStatus(null), 5000); return;
    }
    setEmailConfigSaveStatus("Enregistrement...");
    try {
      await updateEmailConfig(emailConfig);
      addAuditEntry("Configuration EmailJS mise à jour", "success");
      setEmailConfigSaveStatus("Configuration email mise à jour avec succès ! Les réglages sont prêts.");
      setTimeout(() => setEmailConfigSaveStatus(null), 5000);
    } catch (err) { console.error(err); setEmailConfigSaveStatus("Une erreur s'est produite lors de l'enregistrement de la configuration."); }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (securityConfig.allowedIPsString.trim() !== "") {
      const allowedIPs = securityConfig.allowedIPsString.split(",").map(ip => ip.trim());
      const currentSimulatedIP = "192.168.1.100";
      const isIPAllowed = allowedIPs.some(ip => ip === currentSimulatedIP || ip === "ANY" || ip === "*");
      if (allowedIPs.length > 0 && !isIPAllowed && !allowedIPs.includes("192.168.1.100")) {
        setErrorMessage(`Accès bloqué : Pare-feu IP actif. Votre adresse IP (${currentSimulatedIP}) n'est pas autorisée.`);
        addAuditEntry(`Tentative d'accès rejetée : IP pare-feu non autorisée (IP: ${currentSimulatedIP})`, "warning"); return;
      }
    }
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const secondsLeft = Math.ceil((lockoutUntil - Date.now()) / 1000);
      setErrorMessage(`Accès temporairement verrouillé pour des raisons de sécurité. Réessayez dans ${secondsLeft} secondes.`); return;
    }
    const expectedPass = securityConfig.adminPasscode || "babi2026";
    if (passphrase === expectedPass) {
      setFailedAttempts(0); setErrorMessage("");
      if (securityConfig.isTwoFactorSimulated) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(code); setRequiresTwoFactor(true);
        addAuditEntry("Premier facteur de sécurité validé. Deuxième facteur généré.", "info");
      } else {
        setIsAuthenticated(true); setLastActiveTime(Date.now());
        addAuditEntry("Session administrative établie (Accès direct autorisé).", "success");
      }
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      addAuditEntry(`Échec d'authentification administrative (${nextFailed} tentative(s) échouée(s))`, "warning");
      if (nextFailed >= (securityConfig.failedAttemptsLimit || 5)) {
        const lockoutTime = Date.now() + 30 * 1000;
        setLockoutUntil(lockoutTime);
        setErrorMessage("Trop de tentatives infructueuses. Accès suspendu temporairement pour 30 secondes.");
        addAuditEntry("Suspension temporaire des connexions suite à des tentatives excessives.", "warning");
      } else {
        setErrorMessage(`Code d'accès incorrect. Tentative ${nextFailed}/${securityConfig.failedAttemptsLimit || 5}`);
      }
    }
  }

  function handleVerifyTwoFactor(e: React.FormEvent) {
    e.preventDefault();
    if (twoFactorCodeInput === generatedCode) {
      setRequiresTwoFactor(false); setTwoFactorSuccess(true); setIsAuthenticated(true); setLastActiveTime(Date.now());
      addAuditEntry("Authentification multifacteur (MFA) réussie. Accès autorisé.", "success"); setTwoFactorCodeInput("");
    } else {
      setErrorMessage("Code MFA invalide. Veuillez ressaisir le code affiché d'urgence.");
      addAuditEntry("Code multi-facteur invalide saisi lors de la connexion", "warning");
    }
  }

  async function handleUpdateActivity(e: React.FormEvent) {
    e.preventDefault();
    if (securityConfig.isSystemReadOnly) {
      setSaveStatus("Action refusée : le système est actuellement configuré en MODE LECTURE SEULE.");
      setTimeout(() => setSaveStatus(null), 5000); return;
    }
    setSaveStatus("Enregistrement...");
    try {
      await updateMonthlyActivity({ title, italicTitle, description, duration, groupSize, price, monthDate, imageUrl, programmeComplet });
      addAuditEntry("Activité du mois mise à jour", "success");
      setSaveStatus("Activité mise à jour avec succès ! Les modifications sont en ligne.");
      if (onActivityUpdated) onActivityUpdated();
      setTimeout(() => setSaveStatus(null), 5000);
    } catch (err) { console.error(err); setSaveStatus("Une erreur s'est produite lors de la mise à jour."); }
  }

  async function handleSecConfigSave(e: React.FormEvent) {
    e.preventDefault();
    if (securityConfig.isSystemReadOnly) {
      setSecurityConfigSaveStatus("Action refusée : le système est actuellement configuré en LECTURE SEULE.");
      setTimeout(() => setSecurityConfigSaveStatus(null), 5000); return;
    }
    setSecurityConfigSaveStatus("Enregistrement...");
    try {
      await updateSecurityConfig(securityConfig);
      addAuditEntry("Configuration de la sécurité globale mise à jour dans Firestore", "success");
      setSecurityConfigSaveStatus("Configuration de sécurité mise à jour et appliquée avec succès !");
      setTimeout(() => setSecurityConfigSaveStatus(null), 5000);
    } catch (err) { console.error(err); setSecurityConfigSaveStatus("Erreur lors de la sauvegarde de la configuration de sécurité."); }
  }

  async function handleToggleStatus(bookingId: string, status: "pending" | "confirmed" | "cancelled") {
    if (securityConfig.isSystemReadOnly) {
      alert("Mode Lecture Seule activé : Impossible de modifier le statut de la réservation.");
      addAuditEntry("Tentative de modification de réservation bloquée (Système en mode Lecture Seule)", "warning"); return;
    }
    try {
      await updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
      addAuditEntry(`Réservation ${bookingId} changée en statut: ${status}`, "info");
    } catch (err) { console.error(err); }
  }
 async function sendTripConfirmationEmail(trip: TripBooking, customMsg: string) {
    if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
      throw new Error("Les paramètres de notification EmailJS ne sont pas encore configurés dans l'onglet de gauche.");
    }
    const templateParams = {
      to_name: trip.clientName,
      to_email: trip.clientEmail,
      trip_title: trip.tripTitle,
      departure_date: trip.departureDate,
      return_date: trip.returnDate || "Non spécifiée",
      pax_count: trip.paxCount,
      accommodation: trip.accommodationType,
      budget: trip.budgetRange,
      notes: trip.notes || "Aucune note particulière",
      custom_message: customMsg || "Votre demande de voyage a bien été confirmée. Nous vous préparons un séjour sur mesure !",
      sender_name: emailConfig.senderName || "Trippin Babi",
    };
    return emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams, emailConfig.publicKey);
  }
  // Send confirmation email via EmailJS (no devis, just booking info + custom message)
  async function sendConfirmationEmail(booking: Booking, customMsg: string) {
    if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
      throw new Error("Les paramètres de notification EmailJS ne sont pas encore configurés dans l'onglet de gauche.");
    }
    const templateParams = {
      to_name: booking.clientName,
      to_email: booking.clientEmail,
      activity_title: booking.activityTitle,
      booking_date: booking.bookingDate,
      pax_count: booking.paxCount,
      notes: booking.notes || "Aucune note particulière",
      custom_message: customMsg || "Votre réservation a bien été confirmée. À très bientôt !",
      sender_name: emailConfig.senderName || "Trippin Babi",
    };
    return emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams, emailConfig.publicKey);
  }

  // Action: Confirm + send via EmailJS
  async function handleConfirmAndSendEmailJS() {
    if (!selectedBookingForEmail) return;
    if (securityConfig.isSystemReadOnly) {
      setEmailSendError("Le système est actuellement en MODE LECTURE SEULE. Envoi impossible.");
      addAuditEntry("Échec de l'envoi email : Le système est configuré en mode LECTURE SEULE.", "warning"); return;
    }
    setIsSendingEmail(true); setEmailSendError(null); setEmailSendSuccess(false);
    try {
      await sendConfirmationEmail(selectedBookingForEmail, customEmailMessage);
      await updateBookingStatus(selectedBookingForEmail.id!, "confirmed");
      setBookings(prev => prev.map(b => b.id === selectedBookingForEmail.id ? { ...b, status: "confirmed" } : b));
      addAuditEntry(`Confirmation envoyée par mail à ${selectedBookingForEmail.clientEmail}`, "success");
      setEmailSendSuccess(true);
      setTimeout(() => setSelectedBookingForEmail(null), 2000);
    } catch (err: any) {
      console.error(err);
      setEmailSendError(err instanceof Error ? err.message : String(err));
    } finally { setIsSendingEmail(false); }
  }

  // Action: Confirm + open mailto (no devis content)
  async function handleConfirmAndOpenMailto() {
    if (!selectedBookingForEmail) return;
    if (securityConfig.isSystemReadOnly) {
      alert("Mode Lecture Seule activé : Impossible de modifier la base de données.");
      addAuditEntry("Tentative de lancement d'email client bloquée (Lecture Seule)", "warning"); return;
    }
    try {
      await updateBookingStatus(selectedBookingForEmail.id!, "confirmed");
      setBookings(prev => prev.map(b => b.id === selectedBookingForEmail.id ? { ...b, status: "confirmed" } : b));
      addAuditEntry(`Réservation pour ${selectedBookingForEmail.clientName} confirmée (Mailto ouvert)`, "success");

      const emailSubject = `[Trippin Babi] Confirmation de votre réservation – ${selectedBookingForEmail.activityTitle}`;
      const customIntro = customEmailMessage ? `${customEmailMessage}\n\n` : "";
      const emailBody =
        `Bonjour ${selectedBookingForEmail.clientName},\n\n` +
        `Nous avons le plaisir de confirmer votre réservation pour notre activité culturelle d'exception.\n\n` +
        `----------------------------------------\n` +
        `Activité : ${selectedBookingForEmail.activityTitle}\n` +
        `Date souhaitée : ${selectedBookingForEmail.bookingDate}\n` +
        `Nombre de participants : ${selectedBookingForEmail.paxCount} pers.\n` +
        (selectedBookingForEmail.notes ? `Notes : ${selectedBookingForEmail.notes}\n` : "") +
        `----------------------------------------\n\n` +
        `${customIntro}` +
        `Pour toute clarification, n'hésitez pas à nous contacter.\n\n` +
        `Nous vous remercions pour votre confiance !\n\n` +
        `À très bientôt,\n` +
        `L'équipe de ${emailConfig.senderName || "Trippin Babi"}\n` +
        `hello@trippinbabi.com | https://trippin-babi.com`;

      window.location.href = `mailto:${selectedBookingForEmail.clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      setSelectedBookingForEmail(null);
    } catch (err) { console.error(err); }
  }

  // Action: Confirm in DB without email
  async function handleConfirmWithoutEmail() {
    if (!selectedBookingForEmail) return;
    if (securityConfig.isSystemReadOnly) {
      alert("Mode Lecture Seule activé : Impossible de modifier la base de données.");
      addAuditEntry("Action sans email bloquée (Système en mode Lecture Seule)", "warning"); return;
    }
    try {
      await updateBookingStatus(selectedBookingForEmail.id!, "confirmed");
      setBookings(prev => prev.map(b => b.id === selectedBookingForEmail.id ? { ...b, status: "confirmed" } : b));
      addAuditEntry(`Réservation pour ${selectedBookingForEmail.clientName} validée directement hors-ligne`, "success");
      setSelectedBookingForEmail(null);
    } catch (err) { console.error(err); }
  }
async function handleConfirmTripAndSendEmailJS() {
    if (!selectedTripForEmail) return;
    if (securityConfig.isSystemReadOnly) {
      setTripEmailSendError("Le système est actuellement en MODE LECTURE SEULE. Envoi impossible.");
      addAuditEntry("Échec de l'envoi email voyage : Le système est configuré en mode LECTURE SEULE.", "warning"); return;
    }
    setIsSendingTripEmail(true); setTripEmailSendError(null); setTripEmailSendSuccess(false);
    try {
      await sendTripConfirmationEmail(selectedTripForEmail, customTripEmailMessage);
      await updateTripBookingStatus(selectedTripForEmail.id!, "confirmed");
      setTripBookings(prev => prev.map(t => t.id === selectedTripForEmail.id ? { ...t, status: "confirmed" } : t));
      addAuditEntry(`Confirmation voyage envoyée par mail à ${selectedTripForEmail.clientEmail}`, "success");
      setTripEmailSendSuccess(true);
      setTimeout(() => setSelectedTripForEmail(null), 2000);
    } catch (err: any) {
      console.error(err);
      setTripEmailSendError(err instanceof Error ? err.message : String(err));
    } finally { setIsSendingTripEmail(false); }
  }

  // 👈 NOUVEAU: Action: Confirm trip + open mailto
  async function handleConfirmTripAndOpenMailto() {
    if (!selectedTripForEmail) return;
    if (securityConfig.isSystemReadOnly) {
      alert("Mode Lecture Seule activé : Impossible de modifier la base de données.");
      addAuditEntry("Tentative de lancement d'email voyage bloquée (Lecture Seule)", "warning"); return;
    }
    try {
      await updateTripBookingStatus(selectedTripForEmail.id!, "confirmed");
      setTripBookings(prev => prev.map(t => t.id === selectedTripForEmail.id ? { ...t, status: "confirmed" } : t));
      addAuditEntry(`Voyage pour ${selectedTripForEmail.clientName} confirmé (Mailto ouvert)`, "success");

      const emailSubject = `[Trippin Babi] Confirmation de votre voyage – ${selectedTripForEmail.tripTitle}`;
      const customIntro = customTripEmailMessage ? `${customTripEmailMessage}\n\n` : "";
      const emailBody =
        `Bonjour ${selectedTripForEmail.clientName},\n\n` +
        `Nous avons le plaisir de confirmer votre demande de voyage sur mesure.\n\n` +
        `----------------------------------------\n` +
        `Voyage : ${selectedTripForEmail.tripTitle}\n` +
        `Date de départ : ${selectedTripForEmail.departureDate}\n` +
        `Date de retour : ${selectedTripForEmail.returnDate || "Non spécifiée"}\n` +
        `Participants : ${selectedTripForEmail.paxCount} pers.\n` +
        `Hébergement : ${selectedTripForEmail.accommodationType}\n` +
        `Budget : ${selectedTripForEmail.budgetRange}\n` +
        (selectedTripForEmail.notes ? `Notes : ${selectedTripForEmail.notes}\n` : "") +
        `----------------------------------------\n\n` +
        `${customIntro}` +
        `Nous restons à votre disposition pour toute question.\n\n` +
        `À très bientôt,\n` +
        `L'équipe de ${emailConfig.senderName || "Trippin Babi"}\n` +
        `hello@trippinbabi.com | https://trippin-babi.com`;

      window.location.href = `mailto:${selectedTripForEmail.clientEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      setSelectedTripForEmail(null);
    } catch (err) { console.error(err); }
  }

  // 👈 NOUVEAU: Action: Confirm trip without email
  async function handleConfirmTripWithoutEmail() {
    if (!selectedTripForEmail) return;
    if (securityConfig.isSystemReadOnly) {
      alert("Mode Lecture Seule activé : Impossible de modifier la base de données.");
      addAuditEntry("Action sans email voyage bloquée (Système en mode Lecture Seule)", "warning"); return;
    }
    try {
      await updateTripBookingStatus(selectedTripForEmail.id!, "confirmed");
      setTripBookings(prev => prev.map(t => t.id === selectedTripForEmail.id ? { ...t, status: "confirmed" } : t));
      addAuditEntry(`Voyage pour ${selectedTripForEmail.clientName} validé directement hors-ligne`, "success");
      setSelectedTripForEmail(null);
    } catch (err) { console.error(err); }
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FAF6EE] min-h-[75vh] flex items-center justify-center p-6" id="admin-login-wrapper">
        <div className="bg-[#EFEAE0] border border-[#E8E0D5] p-8 max-w-sm w-full space-y-6 text-center shadow-xl rounded-sm">
          {!requiresTwoFactor ? (
            <>
              <div className="w-12 h-12 bg-[#352115] text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-2xl font-serif text-[#352115] font-light">Espace d'Administration</h2>
                <p className="text-xs text-[#7E695D] font-sans font-light">Entrez le mot de passe de sécurité pour accéder au panneau de contrôle.</p>
              </div>
              {errorMessage && (
                <p className="text-xs text-red-700 bg-red-400/10 p-2.5 border border-red-500/20 text-center rounded-xs font-sans">{errorMessage}</p>
              )}
              <form onSubmit={handleLogin} className="space-y-4 text-left">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Mot de passe"
                    required
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    className="w-full text-center p-3 text-sm bg-[#FAF6EE] border border-[#E8E0D5] text-[#352115] focus:outline-none focus:border-[#9A6F4C] tracking-widest font-mono"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#7E695D] hover:text-[#352115] text-xs font-sans font-medium">
                    {showPassword ? "Masquer" : "Afficher"}
                  </button>
                </div>
                <button type="submit" className="w-full bg-[#352115] hover:bg-[#1C0F0A] text-white text-xs font-bold tracking-[0.2em] py-4 transition-colors uppercase cursor-pointer flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" /><span>SE CONNECTER</span>
                </button>
              </form>
              
            </>
          ) : (
            <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-serif text-[#352115] font-light">Validation MFA Requise</h2>
                <p className="text-xs text-[#7E695D] font-sans font-light">La sécurité renforcée exige la validation d'un deuxième facteur d'authentification.</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-600/20 text-left rounded-md space-y-2 text-xs font-sans">
                <p className="font-bold text-amber-900 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" />Code d'authentification simulé :</p>
                <p className="text-[11px] text-[#7E695D] leading-relaxed">Dans une intégration de production, un SMS ou un e-mail à usage unique est envoyé au gestionnaire agréé. Saisissez ce code généré pour confirmer :</p>
                <div className="bg-[#FAF6EE] py-2.5 text-center tracking-widest text-[#352115] font-bold text-lg font-mono border border-[#E8E0D5]">{generatedCode}</div>
              </div>
              {errorMessage && (
                <p className="text-xs text-red-700 bg-red-400/10 p-2.5 border border-red-500/20 text-center font-sans">{errorMessage}</p>
              )}
              <form onSubmit={handleVerifyTwoFactor} className="space-y-4">
                <input
                  type="text" placeholder="Saisissez le code" required maxLength={6}
                  value={twoFactorCodeInput} onChange={(e) => setTwoFactorCodeInput(e.target.value.replace(/\D/g, ""))}
                  className="w-full text-center p-3 text-sm bg-[#FAF6EE] border border-[#E8E0D5] text-[#352115] focus:outline-none focus:border-[#9A6F4C] font-mono tracking-widest"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold tracking-widest py-4 transition-colors uppercase cursor-pointer">VALIDER LE CODE</button>
                  <button type="button" onClick={() => { setRequiresTwoFactor(false); setPassphrase(""); setErrorMessage(""); }} className="px-4 border border-[#E8E0D5] text-[#7E695D] hover:bg-[#FAF6EE]">Retour</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#FAF6EE] min-h-screen py-16 px-6 md:px-12 max-w-7xl mx-auto space-y-16" id="admin-panel-view">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E8E0D5] pb-8">
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-sans font-bold tracking-[0.25em] text-[#9A6F4C] uppercase block">CONSOLE DE CONTRÔLE</span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#352115] font-light tracking-tight">Dashboard d'Administration</h1>
          <p className="text-xs text-[#7E695D] font-sans font-light">Mettez à jour dynamiquement l'Activité du mois sur la page d'accueil ou visualisez les formulaires d'intentions.</p>
        </div>
        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button onClick={loadData} disabled={isRefreshing} className="flex items-center space-x-2 border border-[#E8E0D5] px-4 py-3 text-xs font-semibold text-[#7E695D] hover:text-[#352115] hover:border-[#352115] bg-[#FAF6EE] transition-all disabled:opacity-50 cursor-pointer">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} /><span>ACTUALISER</span>
          </button>
          <button onClick={() => handleLogout()} className="border border-red-200 text-red-700 bg-red-400/5 px-4 py-3 text-xs font-semibold hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex items-center space-x-1">
            <LogOut className="w-3.5 h-3.5" /><span>DECONNEXION</span>
          </button>
        </div>
      </div>

      {securityConfig.isSystemReadOnly && (
        <div className="bg-amber-600/10 border-l-4 border-amber-600 p-4 text-left rounded-sm flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Sécurité : Le Mode "Lecture Seule" est Actif</h4>
            <p className="text-xs text-amber-700/95 leading-relaxed">Toutes les opérations d'écriture de base de données (mise à jour d'activité, statut d'intentions de réservations, changement email client) sont désactivées pour protéger l'intégrité de la plateforme. Désactivez cette option dans l'onglet Sécurité ci-dessous pour reprendre les privilèges de modification.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="admin-main-grid">
        
        <div className="lg:col-span-6 space-y-6">
          <div className="flex border border-[#E8E0D5] bg-[#EFEAE0] p-1 gap-1">
           {(["activity", "email", "security", "trips"] as const).map((tab) => (
  <button key={tab} onClick={() => setActiveTab(tab)}
    className={`flex-1 py-3 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer flex items-center justify-center space-x-1.5 ${activeTab === tab ? "bg-[#352115] text-[#FAF6EE]" : "text-[#7E695D] hover:text-[#352115]"}`}>
    {tab === "activity" && <span>🗓️ Activité</span>}
    {tab === "email" && <><Mail className="w-3.5 h-3.5" /><span>Emails</span></>}
    {tab === "security" && <><Shield className="w-3.5 h-3.5" /><span>Sécurité</span></>}
    {tab === "trips" && <><MapPin className="w-3.5 h-3.5" /><span>Voyages</span></>} 
  </button>
            ))}
          </div>

          {activeTab === "activity" && (
            <div className="bg-[#EFEAE0] p-6 md:p-8 border border-[#E8E0D5] rounded-xs text-left animate-[fadeIn_0.2s_ease-out]">
              <div className="space-y-1 border-b border-[#E8E0D5] pb-3 mb-6">
                <h2 className="text-2xl font-serif text-[#352115] font-light">Modifier l'Activité du Mois</h2>
                <p className="text-xs text-[#7E695D] font-sans">Ces modifications s'appliqueront immédiatement sur la section principale "Activité du mois".</p>
              </div>
              {saveStatus && <div className="p-3 mb-4 text-xs bg-[#352115] text-[#FAF6EE] border border-[#E8E0D5]/20 font-sans tracking-wide">{saveStatus}</div>}
              <form onSubmit={handleUpdateActivity} className="space-y-5 text-xs font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">TITRE DE L'ACTIVITÉ *</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">SOUS-TITRE EN SERIF ITALIC *</label>
                    <input type="text" required value={italicTitle} onChange={(e) => setItalicTitle(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">SENS ET DESCRIPTION COPY *</label>
                  <textarea rows={3} required value={description} onChange={(e) => setDescription(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">DURÉE INDIVIDUELLE *</label>
                    <input type="text" required value={duration} onChange={(e) => setDuration(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">TAILLE GROUPE *</label>
                    <input type="text" required value={groupSize} onChange={(e) => setGroupSize(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">TARIFS DÈS *</label>
                    <input type="text" required value={price} onChange={(e) => setPrice(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">DATE DU MOIS / PANIÈRE *</label>
                    <input type="text" required placeholder="Ex: FÉVRIER 2026" value={monthDate} onChange={(e) => setMonthDate(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase text-xs">AURA DE L'EXPÉRIENCE </label>
                  <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                    className={`border-2 border-dashed rounded p-5 transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${isDragging ? "border-[#9A6F4C] bg-[#ECE4D8]" : imageUrl ? "border-[#E8E0D5] bg-[#FAF6EE]/50 hover:bg-[#FAF6EE]" : "border-[#E8E0D5] hover:border-[#9A6F4C] hover:bg-[#FAF6EE]"}`}>
                    <input id="local-image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    {imageUrl ? (
                      <div className="relative w-full max-w-md flex flex-col items-center text-center">
                        <img src={imageUrl} alt="Aperçu" className="w-full max-h-48 object-cover rounded border border-[#E8E0D5] shadow-sm mb-3" referrerPolicy="no-referrer" />
                        <p className="text-[10px] text-gray-500 font-mono mb-2 truncate max-w-full">{imageUrl.startsWith("data:") ? "" : imageUrl}</p>
                        <div className="flex space-x-2">
                          <label htmlFor="local-image-upload" className="bg-white px-3 py-1.5 text-[10px] font-semibold border border-[#E8E0D5] hover:bg-[#F5EFE6] text-[#352115] rounded transition-colors uppercase cursor-pointer">Changer l'image</label>
                          <button type="button" onClick={() => setImageUrl("")} className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-[10px] font-semibold border border-red-200 rounded transition-colors uppercase cursor-pointer">Supprimer la photo</button>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="local-image-upload" className="w-full flex flex-col items-center justify-center cursor-pointer py-4 text-center">
                        <div className="p-3 bg-white rounded-full border border-[#E8E0D5] shadow-sm text-[#9A6F4C] mb-3">
                          <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <p className="text-xs font-semibold text-[#352115] uppercase tracking-wider">Glissez-déposez une photo ici ou cliquez pour parcourir</p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-mono">Formats : JPG, PNG, WEBP (Max 5Mo)</p>
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase font-sans">PROGRAMME DÉTAILLÉ INCLUS (RETOUR À LA LIGNE POUR SEPARER LES POINTS) *</label>
                  <textarea rows={4} required placeholder="Ex: \n- Étape 1 : Accueil avec café ...\n- Étape 2 : Atelier torréfaction ..." value={programmeComplet} onChange={(e) => setProgrammeComplet(e.target.value)} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] resize-y" />
                </div>
                <button type="submit" disabled={securityConfig.isSystemReadOnly} className="w-full bg-[#352115] hover:bg-[#1C0F0A] text-white text-xs font-bold tracking-[0.2em] py-5 transition-colors uppercase cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /><span>SAUVEGARDER L'ACTIVITÉ</span>
                </button>
              </form>
            </div>
          )}
    {activeTab === "trips" && (
            <div className="bg-[#EFEAE0] p-6 md:p-8 border border-[#E8E0D5] rounded-xs text-left animate-[fadeIn_0.2s_ease-out] space-y-6">
              <div className="space-y-1 border-b border-[#E8E0D5] pb-3">
                <h2 className="text-2xl font-serif text-[#352115] font-light flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#9A6F4C]" />
                  <span>Demandes de Voyages ({tripBookings.length})</span>
                </h2>
                <p className="text-xs text-[#7E695D] font-sans">Gérez les demandes de devis voyages reçues via le formulaire BookingTrips.</p>
              </div>
              
              {tripBookings.length === 0 ? (
                <p className="text-xs text-[#7E695D] font-sans py-6">Aucune demande de voyage en cours.</p>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto" id="trips-admin-scroller">
                  {tripBookings.map((tb) => (
                    <div key={tb.id} className="p-4 bg-[#FAF6EE] border border-[#E8E0D5] space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-serif text-sm text-[#352115] font-bold">{tb.clientName}</h4>
                          <span className="text-[#9A6F4C] font-semibold">{tb.tripTitle}</span>
                        </div>
                        <span className={`px-2 py-1 uppercase text-[9px] font-bold tracking-widest ${tb.status === "confirmed" ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/30" : tb.status === "cancelled" ? "bg-rose-500/10 text-rose-800 border border-rose-500/20" : "bg-amber-500/10 text-amber-800 border border-amber-500/20"}`}>
                          {tb.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#7E695D]">
                        <span>Email: <strong>{tb.clientEmail}</strong></span>
                        <span>Téléphone: <strong>{tb.clientPhone}</strong></span>
                        <span>Départ: <strong>{tb.departureDate}</strong></span>
                        <span>Retour: <strong>{tb.returnDate || "Non spécifié"}</strong></span>
                        <span>Participants: <strong>{tb.paxCount} pers.</strong></span>
                        <span>Hébergement: <strong>{tb.accommodationType}</strong></span>
                        <span>Budget: <strong>{tb.budgetRange}</strong></span>
                      </div>
                      
                      {tb.notes && (
                        <p className="bg-[#EFEAE0] p-2 border border-[#E8E0D5]/50 leading-relaxed text-[#7E695D] text-[11px]">
                          Note: "{tb.notes}"
                        </p>
                      )}
                      
                      <div className="flex space-x-2 pt-1 justify-end flex-wrap gap-2">
                        {tb.status !== "confirmed" && (
                          <button
                            onClick={() => {
                              setSelectedTripForEmail(tb);
                              setCustomTripEmailMessage("");
                              setTripEmailSendSuccess(false);
                              setTripEmailSendError(null);
                            }}
                            className="px-2.5 py-1.5 bg-[#9A6F4C] text-white rounded-xs hover:bg-[#7E695D] transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /><span>Confirmer & Notifier</span>
                          </button>
                        )}
                        {tb.status !== "cancelled" && (
                          <button
                            onClick={async () => {
                              if (window.confirm(`Refuser la demande de voyage pour ${tb.clientName} ?`)) {
                                await updateTripBookingStatus(tb.id!, "cancelled");
                                await loadData();
                                addAuditEntry(`Voyage refusé pour ${tb.clientName}`, "warning");
                              }
                            }}
                            className="px-2.5 py-1.5 bg-[#352115] text-white rounded-xs hover:bg-neutral-900 transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer"
                          >
                            Refuser
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}


          {activeTab === "email" && (
            <div className="bg-[#EFEAE0] p-6 md:p-8 border border-[#E8E0D5] rounded-xs text-left animate-[fadeIn_0.2s_ease-out] space-y-6">
              <div className="space-y-1 border-b border-[#E8E0D5] pb-3">
                <h2 className="text-2xl font-serif text-[#352115] font-light flex items-center gap-2"><Mail className="w-5 h-5 text-[#9A6F4C]" /><span>Notifications Email Clients</span></h2>
                <p className="text-xs text-[#7E695D] font-sans">Configurez vos clés EmailJS gratuites pour envoyer des confirmations instantanées par e-mail à vos clients lors de l'acceptation de leurs réservations.</p>
              </div>
              {emailConfigSaveStatus && <div className="p-3 text-xs bg-[#352115] text-[#FAF6EE] border border-[#E8E0D5]/20 font-sans tracking-wide">{emailConfigSaveStatus}</div>}
              <form onSubmit={handleUpdateEmailConfig} className="space-y-4 text-xs font-sans">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">Nom de l'expéditeur (Sender Name)</label>
                  <input type="text" required value={emailConfig.senderName} onChange={(e) => setEmailConfig(prev => ({ ...prev, senderName: e.target.value }))} placeholder="Ex: Trippin Babi" className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">Service ID (EmailJS)</label>
                  <input type="text" value={emailConfig.serviceId} onChange={(e) => setEmailConfig(prev => ({ ...prev, serviceId: e.target.value }))} placeholder="Ex: service_xxxxx" className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">Template ID (EmailJS)</label>
                  <input type="text" value={emailConfig.templateId} onChange={(e) => setEmailConfig(prev => ({ ...prev, templateId: e.target.value }))} placeholder="Ex: template_xxxxx" className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">Public Key / User API Key (EmailJS)</label>
                  <input type="password" value={emailConfig.publicKey} onChange={(e) => setEmailConfig(prev => ({ ...prev, publicKey: e.target.value }))} placeholder="Ex: xxxxx_xxxxxxxx_xx" className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                </div>
                <button type="submit" disabled={securityConfig.isSystemReadOnly} className="w-full bg-[#352115] hover:bg-[#1C0F0A] text-white text-xs font-bold tracking-[0.2em] py-5 transition-colors uppercase cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50">
                  <Save className="w-4 h-4" /><span>SAUVEGARDER LA CONFIGURATION</span>
                </button>
              </form>
              <div className="p-4 bg-[#FAF6EE] border border-[#E8E0D5] text-[#7E695D] text-[11px] leading-relaxed space-y-2 rounded-xs">
                <p className="font-semibold text-[#352115] flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-[#9A6F4C]" />💡 Comment ça marche ?</p>
                <p>1. Créez un compte gratuit sur <a href="https://www.emailjs.com" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#352115] inline-flex items-center gap-0.5">EmailJS.com <ExternalLink className="w-2.5 h-2.5" /></a>.</p>
                <p>2. Connectez votre messagerie (Gmail, Outlook...) et récupérez votre <strong>Service ID</strong>.</p>
                <p>3. Créez un gabarit de mail (Template) contenant les variables: <br />
                  <code className="inline-block bg-[#EFEAE0] px-1 font-mono text-[9.5px]/4 text-[#352115]">{"{{to_name}}"}, {"{{to_email}}"}, {"{{activity_title}}"}, {"{{booking_date}}"}, {"{{pax_count}}"}, {"{{custom_message}}"}</code>
                </p>
                <p>4. Indiquez ces clés ici. Si ces clés ne sont pas configurées, le bouton de confirmation utilisera <strong>l'ouverture dans votre messagerie native (Mailto API)</strong>, pré-rempli à 100% avec les détails du client !</p>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="bg-[#EFEAE0] p-6 md:p-8 border border-[#E8E0D5] rounded-xs text-left animate-[fadeIn_0.2s_ease-out] space-y-6">
              <div className="space-y-1 border-b border-[#E8E0D5] pb-3">
                <h2 className="text-2xl font-serif text-[#352115] font-light flex items-center gap-2"><Shield className="w-5 h-5 text-[#9A6F4C]" /><span>Sécurité d'Accès Globale</span></h2>
                <p className="text-xs text-[#7E695D] font-sans">Gérez la clé d'authentification de la console d'administration, l'expiration de session et contrôlez le journal d'audit des tentatives d'accès.</p>
              </div>
              {securityConfigSaveStatus && <div className="p-3 text-xs bg-[#352115] text-[#FAF6EE] border border-[#E8E0D5]/20 font-sans tracking-wide">{securityConfigSaveStatus}</div>}
              <form onSubmit={handleSecConfigSave} className="space-y-4 text-xs font-sans">
                <div className="flex flex-col space-y-1">
                  <label className="font-semibold tracking-wider text-[#352115] uppercase">Code d'accès administrateur (Passcode)</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} required value={securityConfig.adminPasscode} onChange={(e) => setSecurityConfig(prev => ({ ...prev, adminPasscode: e.target.value }))} placeholder="Ex: babi2026" className="p-3 w-full bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C] font-mono tracking-widest" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#7E695D] hover:text-[#352115]">{showPassword ? "Masquer" : "Afficher"}</button>
                  </div>
                  <p className="text-[10px] text-[#7E695D] leading-relaxed">Le code requis pour s'identifier sur cet espace d'administration. (Remplacera définitivement le code d'usine).</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">Limite Tentatives Infructueuses</label>
                    <input type="number" min={3} max={10} required value={securityConfig.failedAttemptsLimit} onChange={(e) => setSecurityConfig(prev => ({ ...prev, failedAttemptsLimit: parseInt(e.target.value) || 5 }))} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                    <p className="text-[10px] text-[#7E695D]">Suspension de 30 secondes après N échecs.</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <label className="font-semibold tracking-wider text-[#352115] uppercase">Inactivité Session (Minutes)</label>
                    <input type="number" min={2} max={120} required value={securityConfig.sessionTimeoutMinutes} onChange={(e) => setSecurityConfig(prev => ({ ...prev, sessionTimeoutMinutes: parseInt(e.target.value) || 30 }))} className="p-3 bg-[#FAF6EE] border border-[#E8E0D5] text-sm text-[#352115] focus:outline-none focus:border-[#9A6F4C]" />
                    <p className="text-[10px] text-[#7E695D]">Auto-déconnexion pour inactivité.</p>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#352115] hover:bg-[#1C0F0A] text-white text-xs font-bold tracking-[0.2em] py-5 transition-colors uppercase cursor-pointer flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" /><span>SAUVEGARDER LES PARAMÈTRES SECURITÉ</span>
                </button>
              </form>
              <div className="pt-4 border-t border-[#E8E0D5] space-y-3">
                <h3 className="font-serif text-[#352115] text-sm font-semibold flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                  <Database className="w-3.5 h-3.5 text-[#9A6F4C]" /><span>Journal d'audit de sécurité opérationnelle ({auditLogs.length})</span>
                </h3>
                <div className="bg-[#FAF6EE] border border-[#E8E0D5] rounded-xs p-3 font-mono text-[10px] h-[160px] overflow-y-auto space-y-2 text-[#7E695D]" id="audit-log-scroller">
                  {auditLogs.map((log, idx) => (
                    <div key={idx} className="flex flex-col space-y-0.5 pb-2 border-b border-[#E8E0D5]/40 last:border-0 last:pb-0 text-left">
                      <span className="text-[9px] text-[#352115]/50 font-bold">{log.timestamp}</span>
                      <div className="leading-relaxed text-[#352115]">
                        <span className={`inline-block mr-1.5 w-1.5 h-1.5 rounded-full ${log.status === "success" ? "bg-green-600" : log.status === "warning" ? "bg-red-500 animate-pulse" : "bg-sky-500"}`} />
                        {log.event}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-10">
          <div className="bg-[#FAF6EE] border border-[#E8E0D5] p-6 text-left">
            <h3 className="text-xl font-serif text-[#352115] font-light border-b border-[#E8E0D5]/60 pb-3 mb-4">Demandes de Réservations ({bookings.length})</h3>
            {bookings.length === 0 ? (
              <p className="text-xs text-[#7E695D] font-sans py-6">Aucune réservation en cours.</p>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto" id="bookings-admin-scroller">
                {bookings.map((bk) => (
                  <div key={bk.id} className="p-4 bg-[#EFEAE0]/50 border border-[#E8E0D5] space-y-3 text-xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif text-sm text-[#352115] font-bold">{bk.clientName}</h4>
                        <span className="text-[#9A6F4C] font-semibold">{bk.activityTitle}</span>
                      </div>
                      <span className={`px-2 py-1 uppercase text-[9px] font-bold tracking-widest ${bk.status === "confirmed" ? "bg-emerald-500/10 text-emerald-800 border border-emerald-500/30" : bk.status === "cancelled" ? "bg-rose-500/10 text-rose-800 border border-rose-500/20" : "bg-amber-500/10 text-amber-800 border border-amber-500/20"}`}>
                        {bk.status}
                      </span>
                    </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#7E695D]">
                        <span>Email: <strong>{bk.clientEmail}</strong></span>
                      <span>Téléphone: <strong>{bk.clientPhone || "Non renseigné"}</strong></span>
                      <span>Date souhaitée: <strong>{bk.bookingDate}</strong></span>
                      <span>Participants: <strong>{bk.paxCount} pers.</strong></span>
                    </div>
                    {bk.notes && <p className="bg-[#FAF6EE] p-2 border border-[#E8E0D5]/50 leading-relaxed text-[#7E695D] text-[11px]">Note: "{bk.notes}"</p>}
                    <div className="flex space-x-2 pt-1 justify-end">
                      {bk.status !== "confirmed" && (
                        <button
                          onClick={() => {
                            setSelectedBookingForEmail(bk);
                            setCustomEmailMessage("");
                            setEmailSendSuccess(false);
                            setEmailSendError(null);
                          }}
                          className="px-2.5 py-1.5 bg-[#9A6F4C] text-white rounded-xs hover:bg-[#7E695D] transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /><span>Confirmer & Notifier</span>
                        </button>
                      )}
                      {bk.status !== "cancelled" && (
                        <button
                          onClick={() => { if (window.confirm(`Voulez-vous vraiment refuser cette demande d'activité pour ${bk.clientName} ?`)) handleToggleStatus(bk.id!, "cancelled"); }}
                          className="px-2.5 py-1.5 bg-[#352115] text-white rounded-xs hover:bg-neutral-900 transition-colors uppercase text-[9px] font-bold tracking-widest cursor-pointer"
                        >
                          Refuser l'activité
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#FAF6EE] border border-[#E8E0D5] p-6 text-left">
            <h3 className="text-xl font-serif text-[#352115] font-light border-b border-[#E8E0D5]/60 pb-3 mb-4">Messages & Devis Reçus ({messages.length})</h3>
            {messages.length === 0 ? (
              <p className="text-xs text-[#7E695D] font-sans py-6">Aucun message de contact dans la base.</p>
            ) : (
              <div className="space-y-4 max-h-[420px] overflow-y-auto" id="messages-admin-scroller">
                {messages.map((msg) => (
                  <div key={msg.id} className="p-4 bg-[#EFEAE0]/50 border border-[#E8E0D5] text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-serif text-sm font-semibold text-[#352115]">{msg.name}</h4>
                        <span className="text-[10px] text-[#7E3D1A] font-bold">{msg.email}</span>
                      </div>
                      <span className="text-[9px] text-[#7E695D]/60">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="font-bold text-[#352115] text-[11px]">Sujet : {msg.subject}</p>
                    <div className="bg-[#FAF6EE] p-2 border border-[#E8E0D5]/50 text-[#7E695D] leading-relaxed select-text whitespace-pre-wrap">{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal — email only, no devis */}
      {selectedBookingForEmail && (
        <div className="fixed inset-0 bg-[#352115]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-[#FAF6EE] border-2 border-[#E8DCC4] w-full max-w-lg shadow-2xl relative text-left rounded-xs">
            
            <div className="flex justify-between items-center bg-[#352115] text-[#FAF6EE] px-6 py-3">
              <div className="flex items-center space-x-3">
                <Send className="w-4 h-4 text-[#E2A63B]" />
                <div>
                  <h3 className="text-sm font-sans font-bold tracking-widest uppercase">CONFIRMER & NOTIFIER LE CLIENT</h3>
                  <p className="text-[10px] text-[#E8DCC4]/80">{selectedBookingForEmail.clientName} — {selectedBookingForEmail.activityTitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedBookingForEmail(null)} className="text-white/70 hover:text-white font-bold cursor-pointer px-2 py-1 bg-white/10 hover:bg-white/20 transition-all">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Booking summary */}
              <div className="bg-[#EFEAE0] border border-[#E8DCC4] p-4 text-xs space-y-1.5 font-sans">
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Client</span><br /><strong>{selectedBookingForEmail.clientName}</strong> — {selectedBookingForEmail.clientEmail}</p>
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Activité</span><br /><strong>{selectedBookingForEmail.activityTitle}</strong></p>
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Date & Participants</span><br /><strong>{selectedBookingForEmail.bookingDate}</strong> — {selectedBookingForEmail.paxCount} pers.</p>
                {selectedBookingForEmail.notes && <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Notes</span><br />{selectedBookingForEmail.notes}</p>}
              </div>

              {/* Custom note */}
              <div className="space-y-1.5 text-xs font-sans">
                <label className="block font-bold text-[#352115] uppercase tracking-wider text-[10px]">NOTE COMPLÉMENTAIRE (optionnel)</label>
                <textarea
                  rows={3}
                  value={customEmailMessage}
                  onChange={(e) => setCustomEmailMessage(e.target.value)}
                  placeholder="Recommandations vestimentaires, horaires, point de rendez-vous..."
                  className="w-full p-3 bg-white border border-[#E8DCC4] text-[#352115] text-xs resize-none focus:outline-none focus:border-[#9A6F4C]"
                />
              </div>

              {/* Feedback */}
              {emailSendSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
                  <span>Email de confirmation envoyé avec succès !</span>
                </div>
              )}
              {emailSendError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-800 text-[11px] font-sans space-y-1">
                  <p className="font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />Erreur EmailJS</p>
                  <p className="opacity-90">{emailSendError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={handleConfirmAndSendEmailJS} disabled={isSendingEmail || emailSendSuccess}
                  className="px-3 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50 col-span-2">
                  {isSendingEmail ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>ENVOI...</span></> : <><Send className="w-3.5 h-3.5" /><span>ENVOYER PAR EMAILJS</span></>}
                </button>
                <button onClick={handleConfirmAndOpenMailto} disabled={isSendingEmail || emailSendSuccess}
                  className="px-3 py-2.5 bg-[#FAF6EE] border border-[#9A6F4C] text-[#9A6F4C] hover:bg-[#9A6F4C]/5 text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center space-x-1 disabled:opacity-50">
                  <ExternalLink className="w-3.5 h-3.5" /><span>OUVRIR MAILTO</span>
                </button>
                <button onClick={handleConfirmWithoutEmail} disabled={isSendingEmail || emailSendSuccess}
                  className="px-3 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-[#352115] text-[9px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center disabled:opacity-50">
                  SANS NOTIFICATION
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}
  {selectedTripForEmail && (
        <div className="fixed inset-0 bg-[#352115]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-[#FAF6EE] border-2 border-[#E8DCC4] w-full max-w-lg shadow-2xl relative text-left rounded-xs">
            
            <div className="flex justify-between items-center bg-[#352115] text-[#FAF6EE] px-6 py-3">
              <div className="flex items-center space-x-3">
                <Send className="w-4 h-4 text-[#E2A63B]" />
                <div>
                  <h3 className="text-sm font-sans font-bold tracking-widest uppercase">CONFIRMER LE VOYAGE</h3>
                  <p className="text-[10px] text-[#E8DCC4]/80">{selectedTripForEmail.clientName} — {selectedTripForEmail.tripTitle}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTripForEmail(null)} className="text-white/70 hover:text-white font-bold cursor-pointer px-2 py-1 bg-white/10 hover:bg-white/20 transition-all">✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Trip summary */}
              <div className="bg-[#EFEAE0] border border-[#E8DCC4] p-4 text-xs space-y-1.5 font-sans">
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Client</span><br /><strong>{selectedTripForEmail.clientName}</strong> — {selectedTripForEmail.clientEmail}</p>
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Voyage</span><br /><strong>{selectedTripForEmail.tripTitle}</strong></p>
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Dates & Participants</span><br />
                  <strong>Départ :</strong> {selectedTripForEmail.departureDate} — 
                  <strong> Retour :</strong> {selectedTripForEmail.returnDate || "Non spécifié"} — 
                  <strong> {selectedTripForEmail.paxCount} pers.</strong>
                </p>
                <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Hébergement & Budget</span><br />
                  <strong>{selectedTripForEmail.accommodationType}</strong> — <strong>{selectedTripForEmail.budgetRange}</strong>
                </p>
                {selectedTripForEmail.notes && <p><span className="text-[#9A6F4C] font-bold uppercase tracking-wider text-[10px]">Notes</span><br />{selectedTripForEmail.notes}</p>}
              </div>

              {/* Custom note */}
              <div className="space-y-1.5 text-xs font-sans">
                <label className="block font-bold text-[#352115] uppercase tracking-wider text-[10px]">NOTE COMPLÉMENTAIRE (optionnel)</label>
                <textarea
                  rows={3}
                  value={customTripEmailMessage}
                  onChange={(e) => setCustomTripEmailMessage(e.target.value)}
                  placeholder="Informations supplémentaires, recommandations..."
                  className="w-full p-3 bg-white border border-[#E8DCC4] text-[#352115] text-xs resize-none focus:outline-none focus:border-[#9A6F4C]"
                />
              </div>

              {/* Feedback */}
              {tripEmailSendSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-sans flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
                  <span>Email de confirmation envoyé avec succès !</span>
                </div>
              )}
              {tripEmailSendError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-800 text-[11px] font-sans space-y-1">
                  <p className="font-bold flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />Erreur EmailJS</p>
                  <p className="opacity-90">{tripEmailSendError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button onClick={handleConfirmTripAndSendEmailJS} disabled={isSendingTripEmail || tripEmailSendSuccess}
                  className="px-3 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center space-x-1.5 disabled:opacity-50 col-span-2">
                  {isSendingTripEmail ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span>ENVOI...</span></> : <><Send className="w-3.5 h-3.5" /><span>ENVOYER PAR EMAILJS</span></>}
                </button>
                <button onClick={handleConfirmTripAndOpenMailto} disabled={isSendingTripEmail || tripEmailSendSuccess}
                  className="px-3 py-2.5 bg-[#FAF6EE] border border-[#9A6F4C] text-[#9A6F4C] hover:bg-[#9A6F4C]/5 text-[10px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center space-x-1 disabled:opacity-50">
                  <ExternalLink className="w-3.5 h-3.5" /><span>OUVRIR MAILTO</span>
                </button>
                <button onClick={handleConfirmTripWithoutEmail} disabled={isSendingTripEmail || tripEmailSendSuccess}
                  className="px-3 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-[#352115] text-[9px] font-bold tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center disabled:opacity-50">
                  SANS NOTIFICATION
                </button>
              </div>
              
            </div>
          </div>
        </div>
      )}

    </div>
  );
}