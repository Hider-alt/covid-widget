
// CONFIG VARIABLES

const texts = getTextsByLanguage(Device.language());

let titleText = 'Covid-19 status';

const dailyCasesText = texts.dailyCasesText;
const dailyDeathsText = texts.dailyDeathsText;
const dailyTestsText = texts.dailyTestsText;
const activeCasesText = texts.activeCasesText;
const criticalCasesText = texts.criticalCasesText;
const positivityRateText = texts.positivityRateText;

const lastUpdateText = texts.lastUpdateText;
const defaultCountry = texts.defaultCountry;  // If you set a country in the widget parameter, this will be ignored.