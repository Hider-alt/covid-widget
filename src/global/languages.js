
/* ----- EXTRA ----- */

function getTextsByLanguage(language) {
    const texts = {
        "en": {
            "dailyCasesText": "Daily cases",
            "dailyDeathsText": "Daily deaths",
            "dailyTestsText": "Daily tests",
            "activeCasesText": "Active cases",
            "criticalCasesText": "Critical cases",
            "positivityRateText": "Positivity rate",
            "lastUpdateText": "Last update: ",
            "defaultCountry": "USA"
        },
        "es": {
            "dailyCasesText": "Casos diarios",
            "dailyDeathsText": "Muertes diarios",
            "dailyTestsText": "Tampones diarios",
            "activeCasesText": "Casos activos",
            "criticalCasesText": "Casos críticos",
            "positivityRateText": "Tasa de positividad",
            "lastUpdateText": "Última actualización: ",
            "defaultCountry": "Spain"
        },
        "fr": {
            "dailyCasesText": "Cas quotidiens",
            "dailyDeathsText": "Décès quotidiens",
            "dailyTestsText": "Tampons quotidiens",
            "activeCasesText": "Cas actifs",
            "criticalCasesText": "Cas critiques",
            "positivityRateText": "Taux de positivité",
            "lastUpdateText": "Dernière mise à jour: ",
            "defaultCountry": "France"
        },
        "it": {
            "dailyCasesText": "Casi giornalieri",
            "dailyDeathsText": "Morti giornaliere",
            "dailyTestsText": "Tamponi giornalieri",
            "activeCasesText": "Casi attivi",
            "criticalCasesText": "Casi critici",
            "positivityRateText": "Tasso di positività",
            "lastUpdateText": "Ultimo aggiornamento: ",
            "defaultCountry": "Italy"
        },
    };

    return texts[language];
}