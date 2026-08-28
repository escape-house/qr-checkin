import {useT} from "../../i18n/LanguageContext.tsx"
import type {TranslationKey} from "../../i18n/translations.ts"

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
        <section className="rounded-lg border border-border bg-surface p-5">
            <h2 className="mb-4 text-lg font-semibold text-text">{t("houseRulesTitle")}</h2>
            <ol className="flex flex-col gap-4">
                {RULES.map(({titleKey, textKey}, index) => (
                    <li key={titleKey} className="flex gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-raised text-xs font-semibold text-text-secondary">
                            {index + 1}
                        </span>
                        <div>
                            <h3 className="font-semibold text-text">{t(titleKey)}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-text-secondary">{t(textKey)}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </section>
    )
}

export default HouseRules
