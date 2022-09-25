/*
Welcome to widget of Covid graph.

- This widget works on version small, medium and large.
- This widget will display the graph of Covid cases (and other Covid info) about the city set in the widget parameter (or in the variable below).
- Data are taken from Worldometer and JHU CSSE.
*/
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
/*--------------------------
Version History:
v1.0 -> Initial release
v1.1 -> Added header for small size, added cyan color, improvements, changed APIs, and bug fixes
--------------------------*/

const VERSION = 'v1.1';
const areRepoUpdatesAvailable = await checkRepoUpdates();

const alpha = 0.8;
const red = new Color('#ff0000', alpha);
const darkRed = new Color('#ba0000', alpha);
const green = new Color('#00ff00', alpha);
const darkGreen = new Color('#00ba00', alpha);
const cyan = new Color('#60a5fa', alpha);
const darkCyan = new Color('#177dfc', alpha);
let darkColor = undefined; // Assigned on graph creation

const graphDateFormatter = new DateFormatter();
graphDateFormatter.dateFormat = 'E dd';
const dataDateFormatter = new DateFormatter();
dataDateFormatter.dateFormat = 'M/d/yy';
const lastUpdateFormatter = new DateFormatter();
lastUpdateFormatter.dateFormat = 'E dd MMM HH:mm';

const country = args.widgetParameter || defaultCountry;
const widget = new ListWidget();

const widgetFamily = config.widgetFamily || 'large';
const widgetWidth = getWidgetWidth();
const titleFont = Font.mediumRoundedSystemFont(widgetFamily === 'small' ? 8 : 10);
const valueFont = Font.boldRoundedSystemFont(widgetFamily === 'large' ? 18 : 16);


// -- START MAIN --


let data = await loadData();

if (areRepoUpdatesAvailable)
    widget.url = 'https://github.com/Hider-alt/covid-widget/releases/latest';
else
    widget.url = `https://www.worldometers.info/coronavirus/country/${data.country.replace(/ /g, '-')}/`;

await buildLayout(widget);

Script.setWidget(widget);
Script.complete();
await widget.presentLarge();

// END MAIN
// -- START WIDGET CREATION FUNCTIONS --

async function buildLayout(widget) {
    const chart = await createChart();

    switch (widgetFamily) {
        case 'small':
            widget.setPadding(6, 12, 12, 12);
            await createHeader(widget);

            const outerVerticalStack = widget.addStack();
            outerVerticalStack.layoutVertically();
            outerVerticalStack.centerAlignContent();

            const dataRow = outerVerticalStack.addStack();
            dataRow.setPadding(4, 0, 0, 0)
            data.cases.stringValue = numberToWord(data.cases.stringValue, true);
            createStack(dataRow, data.cases);
            dataRow.addSpacer();
            createStack(dataRow, data.deaths);

            outerVerticalStack.addSpacer();
            outerVerticalStack.addImage(chart);

            break;
        case 'medium':
            widget.setPadding(0, 0, 0, 0);
            await createHeader(widget);
            const outerHorizontalStack = widget.addStack();
            outerHorizontalStack.setPadding(4, 16, 4, 16);

            outerHorizontalStack.addImage(chart);
            outerHorizontalStack.addSpacer(12);

            const columnStack = outerHorizontalStack.addStack();
            columnStack.setPadding(0, 0, 8, 0);
            columnStack.layoutVertically();
            columnStack.addSpacer();
            createStack(columnStack, data.cases);
            columnStack.addSpacer();
            createStack(columnStack, data.deaths);
            columnStack.addSpacer();
            createStack(columnStack, data.tests);

            break;
        case 'large':
            widget.setPadding(0, 0, 0, 0);
            await createHeader(widget);
            const verticalStack = widget.addStack();
            verticalStack.layoutVertically();
            verticalStack.centerAlignContent();
            verticalStack.addSpacer();

            const topRow = verticalStack.addStack();
            topRow.bottomAlignContent();
            topRow.setPadding(0, 16, 0, 16);
            createStack(topRow, data.cases, false, true);
            topRow.addSpacer();
            createStack(topRow, data.deaths, false, true);
            topRow.addSpacer();
            createStack(topRow, data.tests, false, true);

            verticalStack.addSpacer();
            const imageStack = verticalStack.addStack();
            imageStack.addImage(chart).centerAlignImage();
            imageStack.setPadding(0, 16, 0, 16);
            verticalStack.addSpacer();

            const bottomRow = verticalStack.addStack();
            bottomRow.topAlignContent();
            bottomRow.setPadding(0, 16, 0, 16);
            bottomRow.addSpacer();
            createStack(bottomRow, data.critical, true, true);
            bottomRow.addSpacer();
            createStack(bottomRow, data.active, true, true);
            bottomRow.addSpacer();
            createStack(bottomRow, data.positivityRate, true, true);
            bottomRow.addSpacer();

            verticalStack.addSpacer();
            const lastUpdateStack = verticalStack.addStack();
            lastUpdateStack.addSpacer();
            const lastUpdate = lastUpdateStack.addText(lastUpdateText + lastUpdateFormatter.string(new Date()));
            lastUpdate.font = Font.mediumRoundedSystemFont(12);
            lastUpdate.textColor = Color.lightGray();
            lastUpdateStack.addSpacer();
            verticalStack.addSpacer();

            break;
        default:
            throw new Error('Invalid widget size');
    }
}

async function createHeader(widget) {
    const outerStack = widget.addStack();
    if (widgetFamily === 'small') {
        let title = data.country.toUpperCase();
        if (areRepoUpdatesAvailable)
            title += ' (new update)';

        const headerTitle = outerStack.addText(title);
        headerTitle.font = Font.mediumRoundedSystemFont(10);
        headerTitle.textColor = Color.lightGray();
    } else {
        outerStack.size = new Size(widgetWidth, 0);
        outerStack.backgroundColor = Color.dynamic(new Color('#f2f1f6'), new Color('#2c2c2e'));

        const headerStack = outerStack.addStack();
        headerStack.setPadding(8, 16, 8, 0);

        const widgetImage = headerStack.addImage(await loadFlag(data['flag']));
        widgetImage.imageSize = new Size(37, 25);
        widgetImage.cornerRadius = 4;
        headerStack.addSpacer(8);

        const textStack = headerStack.addStack();
        textStack.layoutVertically();

        const headerText = textStack.addText(titleText);
        headerText.font = Font.heavyRoundedSystemFont(20);

        if (areRepoUpdatesAvailable) {
            const updateText = textStack.addText("New update available (click on the widget to update)");
            updateText.font = Font.mediumRoundedSystemFont(10);
            updateText.textColor = Color.lightGray();
        }

        headerStack.addSpacer(null);
    }
}

function createStack(superView, data, inverse = false, centerAlignText = false) {
    if (data.stringValue === '--')
        return;

    const containerStack = superView.addStack();
    containerStack.layoutVertically();
    if (centerAlignText) {
        containerStack.centerAlignContent();
    }

    if (!inverse) {
        const titleStack = containerStack.addStack();
        if (centerAlignText)
            titleStack.addSpacer();
        const title = titleStack.addText(data.title);
        title.font = titleFont;
        if (centerAlignText) {
            titleStack.addSpacer();
            title.centerAlignText();
        }
    }

    const valueStack = containerStack.addStack();
    if (centerAlignText)
        valueStack.addSpacer();
    const value = valueStack.addText(data.stringValue);
    value.font = valueFont;
    value.textColor = darkColor;
    if (centerAlignText){
        valueStack.addSpacer();
        value.centerAlignText();
    }

    if (inverse) {
        const titleStack = containerStack.addStack();
        if (centerAlignText)
            titleStack.addSpacer();
        const title = titleStack.addText(data.title);
        title.font = titleFont;
        if (centerAlignText){
            titleStack.addSpacer();
            title.centerAlignText();
        }
    }

    return containerStack;
}

async function createChart() {
    let size;
    let casesData;
    const timeline = data.casesTimeline;

    switch (widgetFamily) {
        case 'small':
            size = new Size(500, 350);
            casesData = timeline.slice(timeline.length - 8, timeline.length);
            break;
        case 'medium':
            size = new Size(640, 330);
            casesData = timeline.slice(timeline.length - 8, timeline.length);
            break;
        case 'large':
            size = new Size(800, 400);
            casesData = timeline.slice(timeline.length - 15, timeline.length);
            break;
        default:
            throw new Error('Invalid widget size');
    }

    const ctx = new DrawContext();
    ctx.opaque = false;
    ctx.respectScreenScale = true;
    ctx.size = size;

    // Find max amount in casesData
    const maximum = Math.max(...casesData.map(item => item.amount));

    // Draw horizontal lines
    const verticalPadding = widgetFamily === 'large' ? 40 : 20;
    const leftPadding = 62;

    ctx.setTextAlignedRight();
    ctx.setFont(Font.mediumRoundedSystemFont(18));
    ctx.setTextColor(Color.gray());

    let horizontalBars = new Path();
    for (let i = 0; i <= 4; i++) {
        let yPoint = size.height - ((((size.height - verticalPadding * 2) / 4) * i) + verticalPadding);
        horizontalBars.move(new Point(leftPadding, yPoint));
        horizontalBars.addLine(new Point(size.width, yPoint));
        const text = numberToWord(Math.round(maximum / 4 * i), true);
        ctx.drawTextInRect(String(text), new Rect(0, yPoint - 12, 60, 20));
    }

    ctx.addPath(horizontalBars);
    ctx.setStrokeColor(Color.lightGray());
    ctx.strokePath()

    // Find color to use
    const colors = findColors(casesData[casesData.length - 8].amount, casesData[casesData.length - 1].amount);
    const color = colors[0];
    darkColor = colors[1];

    // Draw bars
    ctx.setTextAlignedCenter();

    const availableHeight = size.height - verticalPadding * 2;
    const spacing = 4;
    const barWidth = (size.width - ((casesData.length - 1) * spacing) - leftPadding) / casesData.length;

    let textHeight = 20;
    let textWidth = barWidth;
    if (widgetFamily === "large") {
        textWidth = barWidth - 1;
        textHeight = 50;
    } else if (widgetFamily === "small") {
        textWidth = barWidth - 8;
    }

    casesData.forEach((day, i) => {
        const path = new Path();
        const x = (i * spacing + i * barWidth) + leftPadding;
        const value = day.amount;
        const heightFactor = value / maximum;
        const barHeight = heightFactor * availableHeight;
        const rect = new Rect(x, size.height - barHeight - verticalPadding, barWidth, barHeight);
        path.addRoundedRect(rect, 4, 4);
        ctx.addPath(path);

        if (i === casesData.length - 1 || (i === casesData.length - 8 && widgetFamily === 'large'))
            ctx.setFillColor(darkColor);
        else
            ctx.setFillColor(color);

        ctx.fillPath();

        const textRect = new Rect(x, size.height - verticalPadding, textWidth, textHeight);
        const date = new Date(day.date);

        ctx.drawTextInRect(graphDateFormatter.string(date), textRect);
    });

    return ctx.getImage();
}

// END WIDGET CREATION FUNCTIONS
// -- START DATA FUNCTIONS --

async function loadData() {
    let daysToFetch = 9;
    if (widgetFamily === 'large' || widgetFamily === 'extraLarge')
        daysToFetch = 16;

    const history = await requestJSON(`https://covid-api-worldometer.herokuapp.com/api/history/${country}?lastDays=${daysToFetch}`);
    const countryInfo = await requestJSON(`https://covid-api-worldometer.herokuapp.com/api/countries/${country}/info`);

    // If dailyCases are null for the last day, then remove the last day
    if (history[history.length - 1]["dailyCases"] === null)
        history.pop();

    const casesTimeline = history.map(day => {
        return {
            date: day.date,
            amount: day["dailyCases"]
        }
    });

    const lastDay = history[history.length - 1];

    return {
        country: countryInfo['country'],
        flag: countryInfo['flag'],
        casesTimeline: casesTimeline,
        cases: {
            title: dailyCasesText,
            stringValue: numberToWord(lastDay["dailyCases"]),
        },
        deaths: {
            title: dailyDeathsText,
            stringValue: numberToWord(lastDay["dailyDeaths"]),
        },
        active: {
            title: activeCasesText,
            stringValue: numberToWord(lastDay["active"]),
        },
        critical: {
            title: criticalCasesText,
            stringValue: numberToWord(lastDay["critical"]),
        },
        tests: {
            title: dailyTestsText,
            stringValue: numberToWord(lastDay["dailyTests"]),
        },
        positivityRate: {
            title: positivityRateText,
            stringValue: calculatePositivityRate(lastDay["dailyCases"], lastDay["dailyTests"]),
        }
    };
}

async function loadFlag(flagUrl) {
    const request = new Request(flagUrl);
    return await request.loadImage();
}

// END DATA FUNCTIONS
// -- START UTILS FUNCTIONS --

function calculatePositivityRate(cases, tests) {
    if (tests === null || tests === 0)
        return '--';

    const positivityRate = (cases / tests) * 100;
    return positivityRate.toFixed(1) + '%';
}

function numberToWord(number, convertK = false) {
    // Check if number is a string
    if (typeof number === 'string'){
        // Remove any letter
        number = wordToNumber(number);
    }

    if (number < 0 || number === null)
        return '--';

    if (number > 1000000000)
        // Take the first three digits and ad 'B'
        return (number / 1000000000).toFixed(1) + 'B';

    if (number > 1000000)
        // Take first 3 digits and add 'M'
        return (number / 1000000).toFixed(1) + 'M';

    if (number > 1000 && convertK) {
        // Take first 3 digits and add 'K'
        let n = number / 1000;
        if (n < 100)
            return n.toFixed(1) + 'K';
        else
            return Math.round(n) + 'K';
    }

    // Add a space every three digits
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function wordToNumber(word){
    // Remove any spaces
    word = word.replace(/\s/g, '');

    if (word.endsWith('B'))
        return parseFloat(word.substring(0, word.length - 1)) * 1000000000;
    if (word.endsWith('M'))
        return parseFloat(word.substring(0, word.length - 1)) * 1000000;
    if (word.endsWith('K'))
        return parseFloat(word.substring(0, word.length - 1)) * 1000;

    return parseFloat(word);
}

function getWidgetWidth() {
    switch (widgetFamily) {
        case 'extraLarge':
            return 720;
        case 'large':
            return 360;
        case 'medium':
            return 360;
        default:
            return 180;
    }
}

function findColors(initialCases, endCases) {
    if (initialCases === null || endCases === null)
        return [cyan, darkCyan];

    // Check if endCases is inside +- 5% of initialCases
    if (endCases <= initialCases * 1.05 && endCases >= initialCases * 0.95)
        return [cyan, darkCyan];

    return endCases < initialCases ? [green, darkGreen] : [red, darkRed];
}

async function requestJSON(url) {
    const response = new Request(url);
    const JSONResponse = await response.loadJSON();

    if ("error" in JSONResponse)
        throw new Error(JSONResponse["error"]);

    return JSONResponse;
}

// END UTILS FUNCTIONS
// -- START GITHUB FUNCTIONS --

async function checkRepoUpdates() {
    return new Promise((resolve, reject) => {
        const request = new Request('https://raw.githubusercontent.com/Hider-alt/covid-widget/main/version.json');
        request.loadJSON().then(json => {
            resolve(json['version'] !== VERSION);
        }).catch(err => {
            reject(err);
        })
    });
}

// END GITHUB FUNCTIONS
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