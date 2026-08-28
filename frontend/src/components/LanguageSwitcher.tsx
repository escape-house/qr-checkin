import {useT} from "../i18n/LanguageContext.tsx"

export function LanguageSwitcher() {
    const {lang, setLang} = useT()
    const next = lang === "de" ? "en" : "de"

    return (
        <button
            onClick={() => setLang(next)}
            className="text-2xl leading-none select-none"
            title={lang === "de" ? "Switch to English" : "Zu Deutsch wechseln"}
            aria-label={lang === "de" ? "Switch to English" : "Zu Deutsch wechseln"}
        >
            {lang === "de" ? "🇩🇪" : "🇬🇧"}
        </button>
    )
}
