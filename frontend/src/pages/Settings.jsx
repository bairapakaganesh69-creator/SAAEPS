import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sun,
  Moon,
  Monitor,
  LogOut,
  Lock,
  User,
  Bell,
  Globe,
  Palette,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";
import ChangePasswordModal from "../components/ChangePasswordModal";

const translations = {
  English: {
    settings: "Settings",
    subtitle: "Manage your account and preferences.",
    account: "Account",
    accountDesc: "Manage your profile and account security.",
    editProfile: "Edit Profile",
    editProfileDesc: "Update your personal information.",
    changePassword: "Change Password",
    passwordDesc: "Keep your account secure.",
    notifications: "Notifications",
    notificationsDesc: "Choose your notification preferences.",
    email: "Email Notifications",
    emailDesc: "Preference for receiving updates by email.",
    push: "Push Notifications",
    pushDesc: "Preference for browser or device notifications.",
    reminders: "Exam Reminders",
    remindersDesc: "Preference for upcoming exam reminders.",
    notice:
      "These switches save preferences on this device. Actual email delivery and scheduled reminders require separate services.",
    appearance: "Appearance",
    appearanceDesc: "Choose how the platform looks.",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    language: "Language",
    languageDesc: "Choose your preferred interface language.",
    signOut: "Sign Out",
    signOutDesc: "Sign out of your account on this device.",
    logout: "Logout",
    confirmLogout: "Are you sure you want to logout?",
    saved: "Preference saved.",
  },
  Telugu: {
    settings: "సెట్టింగులు",
    subtitle: "మీ ఖాతా మరియు ప్రాధాన్యతలను నిర్వహించండి.",
    account: "ఖాతా",
    accountDesc: "మీ ప్రొఫైల్ మరియు ఖాతా భద్రతను నిర్వహించండి.",
    editProfile: "ప్రొఫైల్ సవరించండి",
    editProfileDesc: "మీ వ్యక్తిగత సమాచారాన్ని నవీకరించండి.",
    changePassword: "పాస్‌వర్డ్ మార్చండి",
    passwordDesc: "మీ ఖాతాను సురక్షితంగా ఉంచండి.",
    notifications: "నోటిఫికేషన్లు",
    notificationsDesc: "మీ నోటిఫికేషన్ ప్రాధాన్యతలను ఎంచుకోండి.",
    email: "ఈమెయిల్ నోటిఫికేషన్లు",
    emailDesc: "ఈమెయిల్ ద్వారా అప్‌డేట్‌లను స్వీకరించే ప్రాధాన్యత.",
    push: "పుష్ నోటిఫికేషన్లు",
    pushDesc: "బ్రౌజర్ లేదా పరికర నోటిఫికేషన్ల ప్రాధాన్యత.",
    reminders: "పరీక్ష రిమైండర్లు",
    remindersDesc: "రాబోయే పరీక్షల రిమైండర్ల ప్రాధాన్యత.",
    notice:
      "ఈ ఎంపికలు మీ పరికరంలో ప్రాధాన్యతలను సేవ్ చేస్తాయి. ఈమెయిల్‌లు మరియు రిమైండర్లకు ప్రత్యేక సేవలు అవసరం.",
    appearance: "రూపం",
    appearanceDesc: "ప్లాట్‌ఫారమ్ రూపాన్ని ఎంచుకోండి.",
    theme: "థీమ్",
    light: "లైట్",
    dark: "డార్క్",
    system: "సిస్టమ్",
    language: "భాష",
    languageDesc: "మీకు నచ్చిన ఇంటర్‌ఫేస్ భాషను ఎంచుకోండి.",
    signOut: "సైన్ అవుట్",
    signOutDesc: "ఈ పరికరంలో మీ ఖాతా నుండి సైన్ అవుట్ చేయండి.",
    logout: "లాగ్ అవుట్",
    confirmLogout: "మీరు ఖచ్చితంగా లాగ్ అవుట్ చేయాలనుకుంటున్నారా?",
    saved: "ప్రాధాన్యత సేవ్ చేయబడింది.",
  },
  Hindi: {
    settings: "सेटिंग्स",
    subtitle: "अपने खाते और प्राथमिकताओं को प्रबंधित करें।",
    account: "खाता",
    accountDesc: "अपनी प्रोफ़ाइल और खाते की सुरक्षा प्रबंधित करें।",
    editProfile: "प्रोफ़ाइल संपादित करें",
    editProfileDesc: "अपनी व्यक्तिगत जानकारी अपडेट करें।",
    changePassword: "पासवर्ड बदलें",
    passwordDesc: "अपने खाते को सुरक्षित रखें।",
    notifications: "सूचनाएँ",
    notificationsDesc: "अपनी सूचना प्राथमिकताएँ चुनें।",
    email: "ईमेल सूचनाएँ",
    emailDesc: "ईमेल द्वारा अपडेट प्राप्त करने की प्राथमिकता।",
    push: "पुश सूचनाएँ",
    pushDesc: "ब्राउज़र या डिवाइस सूचनाओं की प्राथमिकता।",
    reminders: "परीक्षा रिमाइंडर",
    remindersDesc: "आगामी परीक्षाओं के रिमाइंडर की प्राथमिकता।",
    notice:
      "ये विकल्प इस डिवाइस पर आपकी प्राथमिकताएँ सेव करते हैं। ईमेल और रिमाइंडर के लिए अलग सेवाएँ आवश्यक हैं।",
    appearance: "दिखावट",
    appearanceDesc: "प्लेटफ़ॉर्म की दिखावट चुनें।",
    theme: "थीम",
    light: "लाइट",
    dark: "डार्क",
    system: "सिस्टम",
    language: "भाषा",
    languageDesc: "अपनी पसंद की इंटरफ़ेस भाषा चुनें।",
    signOut: "साइन आउट",
    signOutDesc: "इस डिवाइस पर अपने खाते से साइन आउट करें।",
    logout: "लॉग आउट",
    confirmLogout: "क्या आप वाकई लॉग आउट करना चाहते हैं?",
    saved: "प्राथमिकता सेव हो गई।",
  },
};

const defaultNotifications = {
  emailNotification: true,
  pushNotification: false,
  examReminder: true,
};

function loadNotificationPreferences() {
  try {
    const saved = JSON.parse(
      localStorage.getItem("settingsNotifications") || "null"
    );

    return {
      emailNotification:
        saved?.emailNotification ??
        defaultNotifications.emailNotification,
      pushNotification:
        saved?.pushNotification ??
        defaultNotifications.pushNotification,
      examReminder:
        saved?.examReminder ?? defaultNotifications.examReminder,
    };
  } catch (error) {
    console.error("Unable to load notification preferences:", error);
    return { ...defaultNotifications };
  }
}

function loadPreferredLanguage() {
  try {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    return savedLanguage && translations[savedLanguage]
      ? savedLanguage
      : "English";
  } catch {
    return "English";
  }
}

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Load saved preferences before the first render.
  const [notifications, setNotifications] = useState(
    loadNotificationPreferences
  );

  const [language, setLanguage] = useState(loadPreferredLanguage);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const {
    emailNotification,
    pushNotification,
    examReminder,
  } = notifications;

  const t = translations[language] || translations.English;

  // Save notification preferences whenever a switch changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        "settingsNotifications",
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Unable to save notification preferences:", error);
    }
  }, [notifications]);

  const updateNotification = (name, value) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;

    setLanguage(selectedLanguage);

    try {
      localStorage.setItem("preferredLanguage", selectedLanguage);
    } catch (error) {
      console.error("Unable to save language preference:", error);
    }

    setSavedMessage(translations[selectedLanguage].saved);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const logout = () => {
    if (window.confirm(t.confirmLogout)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-white sm:p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {t.account}
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            {t.settings}
          </h1>

          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t.subtitle}
          </p>
        </header>

        <SettingsSection
          title={t.account}
          description={t.accountDesc}
          icon={<User size={22} />}
        >
          <SettingsRow
            title={t.editProfile}
            description={t.editProfileDesc}
          >
            <ActionButton onClick={() => navigate("/student/profile")}>
              <User size={18} />
              {t.editProfile}
            </ActionButton>
          </SettingsRow>

          <SettingsRow
            title={t.changePassword}
            description={t.passwordDesc}
          >
            <ActionButton
              onClick={() => setShowPasswordModal(true)}
              color="green"
            >
              <Lock size={18} />
              {t.changePassword}
            </ActionButton>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          title={t.notifications}
          description={t.notificationsDesc}
          icon={<Bell size={22} />}
        >
          <Toggle
            title={t.email}
            description={t.emailDesc}
            value={emailNotification}
            onChange={(value) =>
              updateNotification("emailNotification", value)
            }
          />

          <Toggle
            title={t.push}
            description={t.pushDesc}
            value={pushNotification}
            onChange={(value) =>
              updateNotification("pushNotification", value)
            }
          />

          <Toggle
            title={t.reminders}
            description={t.remindersDesc}
            value={examReminder}
            onChange={(value) => updateNotification("examReminder", value)}
          />

          <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
            {t.notice}
          </p>
        </SettingsSection>

        <SettingsSection
          title={t.appearance}
          description={t.appearanceDesc}
          icon={<Palette size={22} />}
        >
          <SettingsRow title={t.theme} description={t.appearanceDesc}>
            <select
              value={theme}
              onChange={handleThemeChange}
              aria-label={t.theme}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-56"
            >
              <option value="light">{t.light}</option>
              <option value="dark">{t.dark}</option>
              <option value="system">{t.system}</option>
            </select>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection
          title={t.language}
          description={t.languageDesc}
          icon={<Globe size={22} />}
        >
          <SettingsRow title={t.language} description={t.languageDesc}>
            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.language}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:w-56"
            >
              <option value="English">English</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </SettingsRow>

          {savedMessage && (
            <p
              role="status"
              className="mt-3 text-sm font-medium text-green-600 dark:text-green-400"
            >
              {savedMessage}
            </p>
          )}
        </SettingsSection>

        <section className="mb-8 rounded-2xl border border-red-200 bg-white p-6 shadow-sm dark:border-red-900 dark:bg-gray-800">
          <h2 className="text-xl font-bold">{t.signOut}</h2>

          <p className="mb-5 mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t.signOutDesc}
          </p>

          <ActionButton onClick={logout} color="red">
            <LogOut size={18} />
            {t.logout}
          </ActionButton>
        </section>

        <ChangePasswordModal
          open={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        />
      </div>
    </div>
  );
}

function SettingsSection({ title, description, icon, children }) {
  return (
    <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-indigo-100 p-3 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
          {icon}
        </div>

        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </section>
  );
}

function SettingsRow({ title, description, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="w-full sm:w-auto">{children}</div>
    </div>
  );
}

function ActionButton({ children, onClick, color = "indigo" }) {
  const colors = {
    indigo: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors[color]}`}
    >
      {children}
    </button>
  );
}

function Toggle({ title, description, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-label={title}
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          value ? "bg-indigo-600" : "bg-gray-400"
        }`}
      >
        <span
          className={`pointer-events-none block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-200 ${
            value ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
