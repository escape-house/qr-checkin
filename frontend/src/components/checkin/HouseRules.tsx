import {useT} from "../../i18n/LanguageContext.tsx"
import type {TranslationKey} from "../../i18n/translations.ts"
import {renderTextWeight} from "../../i18n/translations.ts"

const RULES: { titleKey: TranslationKey; textKey: TranslationKey }[] = [
    {titleKey: "houseRulesHealthTitle",         textKey: "houseRulesHealthText"},
    {titleKey: "houseRulesInstructionsTitle",   textKey: "houseRulesInstructionsText"},
    {titleKey: "houseRulesNoViolenceTitle",     textKey: "houseRulesNoViolenceText"},
    {titleKey: "houseRulesTeamProtectionTitle", textKey: "houseRulesTeamProtectionText"},
    {titleKey: "houseRulesAlcoholTitle",        textKey: "houseRulesAlcoholText"},
    {titleKey: "houseRulesGameStopTitle",       textKey: "houseRulesGameStopText"},
    {titleKey: "houseRulesPersonalItemsTitle",  textKey: "houseRulesPersonalItemsText"},
    {titleKey: "houseRulesDamagesTitle",        textKey: "houseRulesDamagesText"},
    {titleKey: "houseRulesSurveillanceTitle",   textKey: "houseRulesSurveillanceText"},
    {titleKey: "houseRulesSafetyTitle",         textKey: "houseRulesSafetyText"},
]

function HouseRules() {
    const {t} = useT()

    return (
        <section className="rounded-lg border border-border bg-surface overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
                <h1 className="text-xl font-semibold font-sans tracking-wide uppercase text-text">{t("houseRulesTitle")}</h1>
            </div>
            <ol className="divide-y divide-border">
                {RULES.map(({titleKey, textKey}, index) => (
                    <li key={titleKey} className="flex gap-4 px-5 py-4">
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                            {index + 1}
                        </span>
                        <div className="min-w-0">
                            <h3 className="font-bold text-xl text-text leading-snug">{t(titleKey)}</h3>
                            <p className="mt-1.5 text-base leading-relaxed text-text-secondary">{renderTextWeight(t(textKey))}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default HouseRules
