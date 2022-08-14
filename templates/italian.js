/*
Welcome to widget of Covid graph.

- This widget works on version small, medium and large.
- This widget will display the graph of Covid cases (and other Covid info) about the city set in the widget parameter (or in the variable below).
- Data are taken from Worldometer and JHU CSSE.

Some essential data are saved in iCloud (folder Scriptable/CovidStatusWidget).
*/

// CONFIG VARIABLES

let titleText = 'Covid-19 status';

const dailyCasesText = 'Casi giornalieri';
const dailyDeathsText = 'Morti giornaliere';
const dailyTestsText = 'Tamponi giornalieri';
const activeCasesText = 'Casi attivi';
const criticalCasesText = 'Casi critici';
const positivityRateText = 'Tasso di positività';

const lastUpdateText = 'Ultimo aggiornamento dati: ';
const defaultCountry = 'Italy';  // If you set a country in the widget parameter, this will be ignored.

/*--------------------------
Version History:
v1.0 -> Initial release
--------------------------*/

// GLOBAL VARIABLES

const VERSION = '1.0';
const areRepoUpdatesAvailable = await checkRepoUpdates();

const red = new Color('#ff0000', 0.8);
const darkRed = new Color('#ba0000', 0.8);
const green = new Color('#00ff00', 0.8);
const darkGreen = new Color('#00ba00', 0.8);
let darkColor = undefined; // Assigned on graph creation

const graphDateFormatter = new DateFormatter();
graphDateFormatter.dateFormat = 'E dd';
const dataDateFormatter = new DateFormatter();
dataDateFormatter.dateFormat = 'M/d/yy';
const lastUpdateFormatter = new DateFormatter();
lastUpdateFormatter.dateFormat = 'dd/MM/yy HH:mm';

const country = args.widgetParameter || defaultCountry;
const widget = new ListWidget();

const widgetFamily = config.widgetFamily || 'large';
const widgetWidth = getWidgetWidth();
const titleFont = Font.mediumRoundedSystemFont(10);
const valueFont = Font.boldRoundedSystemFont(widgetFamily === 'large' ? 18 : 16);


// -- START MAIN --


let data;
if (await areDataUpdatesAvailable()) {
    data = await loadData();
} else {
    data = loadJSON()[country]['lastUpdateJSON'];
}

if (areRepoUpdatesAvailable) {
    titleText += ' (new version available)';
    widget.url = 'https://github.com/Hider-alt/covid-widget';
} else
    widget.url = `https://www.worldometers.info/coronavirus/country/${data.country}/`;

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
            widget.setPadding(12, 12, 12, 12);

            const outerVerticalStack = widget.addStack();
            outerVerticalStack.layoutVertically();
            outerVerticalStack.centerAlignContent();

            const dataRow = outerVerticalStack.addStack();
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
            createStack(bottomRow, data.testPositivity, true, true);
            bottomRow.addSpacer();

            verticalStack.addSpacer();
            const lastUpdateStack = verticalStack.addStack();
            lastUpdateStack.addSpacer();
            const lastUpdate = lastUpdateStack.addText(lastUpdateText + lastUpdateFormatter.string(new Date(loadJSON()[country]['lastUpdateDate'])));
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
    outerStack.size = new Size(widgetWidth, 0);
    outerStack.backgroundColor = Color.dynamic(new Color('#f2f1f6'), new Color('#2c2c2e'));

    const headerStack = outerStack.addStack();
    headerStack.setPadding(8, 16, 8, 0);

    const widgetImage = headerStack.addImage(await loadFlag(data['flag']));
    widgetImage.imageSize = new Size(37, 25);
    widgetImage.cornerRadius = 4;
    headerStack.addSpacer(8);

    const textStack = headerStack.addStack();
    const headerText = textStack.addText(titleText);
    headerText.font = Font.heavyRoundedSystemFont(20);
    headerStack.addSpacer(null);
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
            size = new Size(400, 300);
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
    const leftPadding = 52;

    ctx.setTextAlignedRight();
    ctx.setFont(Font.mediumRoundedSystemFont(18));
    ctx.setTextColor(Color.gray());

    let horizontalBars = new Path();
    for (let i = 0; i <= 4; i++) {
        let yPoint = size.height - ((((size.height - verticalPadding * 2) / 4) * i) + verticalPadding);
        horizontalBars.move(new Point(leftPadding, yPoint));
        horizontalBars.addLine(new Point(size.width, yPoint));
        const text = numberToWord(Math.round(maximum / 4 * i), true);
        ctx.drawTextInRect(String(text), new Rect(0, yPoint - 12, 50, 20));
    }

    ctx.addPath(horizontalBars);
    ctx.setStrokeColor(Color.lightGray());
    ctx.strokePath()

    // Find color to use
    const areCasesGrowing = casesData[casesData.length - 8].amount - casesData[casesData.length - 1].amount < 0;
    const color = areCasesGrowing ? red : green;
    darkColor = areCasesGrowing ? darkRed : darkGreen;

    // Draw bars
    ctx.setTextAlignedCenter();

    const textHeight = widgetFamily === 'large' ? 50 : 20;
    const availableHeight = size.height - verticalPadding * 2;
    const spacing = 4;
    const barWidth = (size.width - ((casesData.length - 1) * spacing) - leftPadding) / casesData.length - 1;
    // -1 to make text wrap in large widget

    casesData.forEach((day, i) => {
        const path = new Path();
        const x = (i * spacing + i * barWidth) + leftPadding;
        const value = day.amount;
        const heightFactor = value / maximum;
        const barHeight = heightFactor * availableHeight;
        const rect = new Rect(x, size.height - barHeight - verticalPadding, barWidth, barHeight);
        path.addRoundedRect(rect, 4, 4);
        ctx.addPath(path);

        if (i === casesData.length - 1)
            ctx.setFillColor(darkColor);
        else if (i === casesData.length - 8 && widgetFamily === 'large')
            ctx.setFillColor(darkColor);
        else
            ctx.setFillColor(color);

        ctx.fillPath();

        const textRect = new Rect(x, size.height - verticalPadding, barWidth, textHeight);
        const date = new Date(day.date);

        ctx.drawTextInRect(graphDateFormatter.string(date), textRect);
    });

    return ctx.getImage();
}

// END WIDGET CREATION FUNCTIONS
// -- START DATA FUNCTIONS --

async function areDataUpdatesAvailable() {
    const jsonData = loadJSON();
    const lastUpdateDate = new Date(jsonData[country].lastUpdateDate);
    const nowDate = new Date();

    if (!(country in jsonData))
        return true;

    if (isJSONEmpty(jsonData[country].lastUpdateJSON)) // Only when the file has just been created
        return true;

    // Check that at least the day before is saved
    if (!isYesterdayDate(jsonData[country].lastUpdateJSON.casesTimeline))
        return true;

    if (nowDate.getHours() < 12) // Before 12:00 new daily data aren't yet released
        return false;

    // Check if last update was today after 12:00
    return !(lastUpdateDate.getDate() === nowDate.getDate() && lastUpdateDate.getHours() >= 12);
}

async function loadData() {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const todayCovid = await requestJSON(`https://disease.sh/v3/covid-19/countries/${country}?allowNull=true&strict=true`);

    if ("message" in todayCovid)
        throw new Error(todayCovid.message);

    let twoDaysAgoCovid;
    const jsonData = loadJSON();

    // If todayCases is null, it means that the data today are not available yet
    if (todayCovid['todayCases'] === null || todayCovid['todayDeaths'] === null)
        // Check if there are stored data and that there's the yesterday data
        if (!isJSONEmpty(jsonData[country].lastUpdateJSON) && isYesterdayDate(jsonData[country].lastUpdateJSON.casesTimeline))
            return jsonData[country]['lastUpdateJSON'];
        else
            twoDaysAgoCovid = await requestJSON(`https://disease.sh/v3/covid-19/countries/${country}?twoDaysAgo=true&strict=true`);

    let yesterdayCovid = await requestJSON(`https://disease.sh/v3/covid-19/countries/${country}?yesterday=true&strict=true`);

    // If todayCases are not null before 12, they are referring to the previous day
    if ((todayCovid['todayCases'] !== null || todayCovid['todayDeaths'] !== null) && today.getHours() < 12) {
        twoDaysAgoCovid = JSON.parse(JSON.stringify(yesterdayCovid)); // Deep copy
        yesterdayCovid = JSON.parse(JSON.stringify(todayCovid)); // Deep copy
        todayCovid['todayCases'] = null;
        todayCovid['todayDeaths'] = null;
    }

    const historicalCovid = await requestJSON(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=20`);

    const casesTimeline = historicalCovid['timeline']['cases'];

    // Convert casesTimeline to array of objects
    let casesArray = [];
    for (const key in casesTimeline) {
        casesArray.push({
            date: key,
            amount: casesTimeline[key]
        });
    }

    casesArray = convertCumulativeToDailyCases(casesArray);

    if (todayCovid['todayCases'] !== null) {
        // Add today data to historical data
        const todayDateString = dataDateFormatter.string(today);
        casesArray.push({
            date: todayDateString,
            amount: todayCovid['todayCases']
        });
    }

    // Check that yesterday isn't already in the casesArray and that yesterday cases are same as two days ago (Worldometer bug)
    if (!isYesterdayDate(casesArray) && yesterdayCovid['todayCases'] !== casesArray.find(day => day.date === dataDateFormatter.string(twoDaysAgo)).amount) {
        const yesterdayDateString = dataDateFormatter.string(yesterday);

        // Add yesterday data to historical data
        casesArray.push({
            date: yesterdayDateString,
            amount: yesterdayCovid['todayCases']
        });
    }

    // Setup all title and values for the widget
    let casesValue;
    let deathsValue;
    let activeCasesValue;
    let criticalCasesValue;

    if (todayCovid['todayCases'] !== null && todayCovid['todayDeaths'] !== null) {
        activeCasesValue = numberToWord(todayCovid['active']);
        criticalCasesValue = numberToWord(todayCovid['critical']);
        casesValue = numberToWord(todayCovid['todayCases']);
        deathsValue = numberToWord(todayCovid['todayDeaths']);
    } else {
        activeCasesValue = numberToWord(yesterdayCovid['active']);
        criticalCasesValue = numberToWord(yesterdayCovid['critical']);
        casesValue = numberToWord(yesterdayCovid['todayCases']);
        deathsValue = numberToWord(yesterdayCovid['todayDeaths']);
    }

    let testsValue;
    let testPositivityValue;
    if (todayCovid['tests'] !== yesterdayCovid['tests']) {
        testsValue = todayCovid['tests'] - yesterdayCovid['tests'];
        testPositivityValue = (todayCovid['todayCases'] / testsValue * 100).toFixed(2) + '%';
    } else {
        if (isJSONEmpty(twoDaysAgoCovid))
            testsValue = 0;
        else
            testsValue = yesterdayCovid['tests'] - twoDaysAgoCovid['tests'];

        testPositivityValue = (yesterdayCovid['todayCases'] / testsValue * 100).toFixed(2) + '%';
    }

    testsValue = testsValue === 0 && casesValue !== '0' ? '--' : numberToWord(testsValue);

    // End of setup

    const data = {
        country: todayCovid['country'],
        flag: todayCovid['countryInfo']['flag'],
        casesTimeline: casesArray,
        cases: {
            title: dailyCasesText,
            stringValue: casesValue,
        },
        deaths: {
            title: dailyDeathsText,
            stringValue: deathsValue,
        },
        active: {
            title: activeCasesText,
            stringValue: activeCasesValue,
        },
        critical: {
            title: criticalCasesText,
            stringValue: criticalCasesValue,
        },
        tests: {
            title: dailyTestsText,
            stringValue: testsValue,
        },
        testPositivity: {
            title: positivityRateText,
            stringValue: testsValue === '--' ? '--' : testPositivityValue,
        }
    };

    await updateRefresh(data);

    return data;
}

async function loadFlag(flagUrl) {
    const request = new Request(flagUrl);
    return await request.loadImage();
}

// END DATA FUNCTIONS
// -- START STORING FUNCTIONS --

/**
 * Returns the path to the info.json file.
 */
function createWidgetFolderIfNoExist() {
    const fm = FileManager.iCloud();
    let filePath = fm.joinPath(fm.documentsDirectory(), 'covidStatusWidget/info.json');

    if (!fm.fileExists(filePath)) {
        fm.createDirectory(fm.joinPath(fm.documentsDirectory(), 'covidStatusWidget'));
        fm.writeString(filePath, JSON.stringify({[country]: {lastUpdateDate: new Date().setDate(new Date().getDate() - 1), lastUpdateJSON: {}}}));
    } else {
        const jsonRaw = fm.readString(filePath);
        const jsonData = JSON.parse(jsonRaw);

        // Add country to json if it doesn't exist
        if (!(country in jsonData)) {
            jsonData[country] = {lastUpdateDate: new Date().setDate(new Date().getDate() - 1), lastUpdateJSON: {}};
            fm.writeString(filePath, JSON.stringify(jsonData));
        }
    }

    return filePath;
}

async function updateRefresh(newData) {
    const json = loadJSON();

    json[country]['lastUpdateDate'] = new Date();
    json[country]['lastUpdateJSON'] = newData;

    saveJSON(json);
}

function loadJSON() {
    const filePath = createWidgetFolderIfNoExist()
    const fm = FileManager.iCloud();
    const jsonRaw = fm.readString(filePath);
    return JSON.parse(jsonRaw);
}

function saveJSON(json) {
    const fm = FileManager.iCloud();
    const filePath = createWidgetFolderIfNoExist()
    fm.writeString(filePath, JSON.stringify(json));
}

// END STORING FUNCTIONS
// -- START UTILS FUNCTIONS --

function numberToWord(number, convertK = false) {
    // Check if number is a string
    if (typeof number === 'string'){
        // Remove any letter
        number = wordToNumber(number);
    }

    if (number < 0)
        return '--';

    if (number > 1000000000)
        // Take the first three digits and ad 'B'
        return (number / 1000000000).toFixed(2) + 'B';

    if (number > 1000000)
        // Take first 3 digits and add 'M'
        return (number / 1000000).toFixed(2) + 'M';

    if (number > 1000 && convertK)
        // Take first 3 digits and add 'K'
        return Math.round(number / 1000) + 'K';

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

function convertCumulativeToDailyCases(casesTimeline) {
    // Sort by date
    casesTimeline.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    casesTimeline.forEach((day, i) => {
        if (i !== 0)
            day['dailyCases'] = day['amount'] - casesTimeline[i - 1]['amount'];
    });

    casesTimeline.splice(0, 1);

    casesTimeline.forEach((day) => {
        day['amount'] = day['dailyCases'];
        delete day['dailyCases'];
    });

    return casesTimeline;
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

async function requestJSON(url) {
    const request = new Request(url);
    return await request.loadJSON();
}

function isJSONEmpty(json) {
    return typeof json !== 'object' || (Object.keys(json).length === 0 && json.constructor === Object);
}

function isYesterdayDate(objectList) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return objectList.find(day => day.date === dataDateFormatter.string(yesterday)) !== undefined;
}

// END UTILS FUNCTIONS
// -- START GITHUB FUNCTIONS --

async function checkRepoUpdates() {
    return new Promise((resolve, reject) => {
        const request = new Request('https://raw.githubusercontent.com/Hider-alt/covid-widget/main/info.json');
        request.loadJSON().then(json => {
            resolve(json['version'] !== VERSION);
        }).catch(err => {
            reject(err);
        })
    });
}

// END GITHUB FUNCTIONS