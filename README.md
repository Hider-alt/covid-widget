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

When there will be a new update, it will be written in the widget title. <br>

1. To update the **widget**, just click on **it**, and it will redirect to the [release page](https://github.com/Hider-alt/covid-widget/release).
2. Download a Scriptable file.
3. Repeat from step 3 of [How to install](#how-to-install) section.
4. Delete `CovidGraph` from your scripts.
5. Click on the three dots in the upper right corner of the script named `CovidGraph 1`.
6. Click on `CovidGraph 1` on the top and rename the script to `CovidGraph`.
7. Click on "Done".

## Features
- The widget shows a graph of Covid cases for the last **8 days** in the **small** or **medium** version and 
for the last **15 days** in the **large** version for the selected country in the parameter.
- The graph will be colored of **green** if the number of cases is less than the number of cases in the 7 days before,
**red** if the number of cases is more than the number of cases in the 7 days before.

### How it updates data
- The widget will try to download new data only after 12:00 PM (because before daily data aren't released).
- If a new day is started, but the data for the previous day are not released, the widget will try to 
download data even if the time is not after 12:00 PM.
- If daily data are not available, the widget will show the last available data.

## Requirements
- Scriptable
- iPhone/iPad/Mac
- iOS 14.0 or later / macOS Big Sur or later

## What's next?
- Add an optional line in the graph to show the positivity rate.
- Add arrow near each data to show the direction of that data trend.
- Add neutral color to the graph if the number of cases are similar to the number of cases in the 7 days before.
- Fix text when new version is released.

## Source
- [disease.sh](https://disease.sh/docs/?urls.primaryName=version%203.0.0)

## Credits
© 2022 Hider

Inspired by the [vaccines widget](https://github.com/DerLobi/impfdashboard-scriptable-widget)

___

## Want a custom widget?
- Click [here](https://it.fiverr.com/share/P04gAp).