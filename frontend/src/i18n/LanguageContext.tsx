import {createContext, useContext, useState, type ReactNode} from "react"
import translations, {type TranslationKey, roomNameTranslations} from "./translations.ts"

export type Lang = "de" | "en"

interface LanguageContextValue {
    lang: Lang
    setLang: (lang: Lang) => void
    t: (key: TranslationKey) => string
    tRoomName: (name: string) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({children}: {children: ReactNode}) {
    const [lang, setLangState] = useState<Lang>(() =>
        (localStorage.getItem("checkin-lang") as Lang) ?? "de"
    )

    function setLang(next: Lang) {
        setLangState(next)
        localStorage.setItem("checkin-lang", next)
    }

    function t(key: TranslationKey): string {
        return translations[key][lang]
    }

    function tRoom(name: string): string {
        if (lang === "de") return name
        return roomNameTranslations[name] ?? name
    }

    return (
        <LanguageContext.Provider value={{lang, setLang, t, tRoomName: tRoom}}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useT() {
    const ctx = useContext(LanguageContext)
    if (!ctx) throw new Error("useT must be used within LanguageProvider")
    return ctx
}
