 # Covid iOS Widget
This Widget shows a graph of Covid cases for the last 8/15 days of the selected country. <br>

![Widgets Overview](./img/Mockup.png)

___

## How to install
<sup>[Click here to see images of the instructions](./img/install.md)</sup>

1. Download Scriptable from the App Store.
2. **Download** a Scriptable file from the [release page](https://github.com/Hider-alt/covid-widget/releases/latest).
3. Once downloaded, click the Share button.
4. Click on the Scriptable icon.
5. Click on "Add to My Scripts".
6. Click on "Done".

## Add widget to the home-screen
<sup>[Click here to see images of the instructions](./img/add-to-home.md)</sup>

1. Add a new Scriptable widget to the home-screen.
2. In "Script" select **CovidGraph**.
3. In "Parameter" select the **country name** you want to show in the widget.

## How to update
<sup>[Click here to see images of the instructions](./img/update.md)</sup>

1. To update the **widget**, just click on **it**, and it will redirect to the [release page](https://github.com/Hider-alt/covid-widget/release).
2. Close momentarily Safari.
3. Delete CovidGraph script in Scriptable.
4. Go to the release page on Safari and download the Scriptable file.
5. Make steps from 3 of the [installation instructions](#how-to-install).

## Features
- The widget shows a graph of Covid cases for the last **8 days** in the **small** or **medium** version and 
for the last **15 days** in the **large** version for the selected country in the parameter.
- The graph will be colored of **green** if the number of cases is less than the number of cases in the 7 days before,
**red** if the number of cases is more than the number of cases in the 7 days before.

### Updates
- When a new version is released, it will be written in the widget title.
- To update the **widget**, just click on **it**, and it will redirect to the [latest release page](https://github.com/Hider-alt/covid-widget/release)
- Then you will have just to follow the instructions of [How to update](#how-to-update) section.

### How it updates data
- The widget will try to download new data only after 12:00 PM (because before daily data aren't released).
- If a new day is started, but the data for the previous day are not released, the widget will try to 
download data even if the time is not after 12:00 PM.
- If daily data are not available, the widget will show the last available data.

> **Note**: Some data countries are partially available, so the graph could be partially empty (e.g. UK).
This is a problem of the Covid API.

## Requirements
- Scriptable
- iPhone/iPad/Mac
- iOS 14.0 or later / macOS Big Sur or later

## FAQ

### How can I change the country?
>  In the parameter, select the country you want to show in the widget.

### What sizes are available?
> The widget has 3 sizes: **small**, **medium** and **large**.

## What's next?
- Add an optional line in the graph to show the positivity rate.
- Add arrow near each data to show the direction of that data trend.
- Change APIs.

## Source
- [disease.sh](https://disease.sh/docs/?urls.primaryName=version%203.0.0)

## Credits
© 2022 Hider

Inspired by the [vaccines widget](https://github.com/DerLobi/impfdashboard-scriptable-widget)

___

## Want a custom widget?
- Click [here](https://it.fiverr.com/share/P04gAp).