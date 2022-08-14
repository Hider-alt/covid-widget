# Covid iOS Widget
This Widget shows a graph of Covid cases for the last 8/15 days of the selected country. <br>

![Widgets Overview](./img/Mockup.png)

___

## How to install
1. Download Scriptable from the App Store.
2. **Copy** the content of the file [`covid-widget.js`](./covid-widget.js)
(or the content of a file found in [templates](./templates)) to the script editor.
3. Open the Scriptable app and create a new script by clicking on the **+** button 
(in the upper right corner).
4. **Paste** the content of the file into the script editor.
5. _(Optional) Translate the config variables on the top of the script to your desired language._
   1. If you have copied the content of a file found in [templates](./templates), this step is not necessary.
6. Click on done.

## Add widget to the home-screen
1. Add a new Scriptable widget.
2. In "Script" select the name of the script you created in step 3 of [How to install](#how-to-install).
3. In "Parameter" select the country you want to show in the widget.

## How to update
When there will be a new update, it will be written in the widget title. <br>

1. To update the **widget**, just click on **it**, and it will redirect to the [GitHub repository]('https://github.com/Hider-alt/covid-widget').
2. Copy the content of the file [`covid-widget.js`](./covid-widget.js) 
(or the content of a file found in [templates](./templates)) to the script you created in step 3 of [How to install](#how-to-install).
3. _(Optional) Translate the config variables on the top of the script to your desired language._
   1. If you have copied the content of a file found in [templates](./templates), this step is not necessary.
4. Click on done.

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

## Source
- [disease.sh](https://disease.sh/docs/?urls.primaryName=version%203.0.0)

## Credits
© 2022 Hider

Inspired by the [vaccines widget](https://github.com/DerLobi/impfdashboard-scriptable-widget)

___

## Want a custom widget?
- Click [here](https://it.fiverr.com/share/P04gAp).