## Weather Underground widget
The Weather Underground widget uses the [Weather Underground API](https://www.wunderground.com/weather/api/) to retrieve weather for a given location. In order to use this weather service you need to have **apiKey** which you will get when you [register account](https://www.wunderground.com/weather/api/d/pricing.html) on their API system. There are several pricing plans, but there is way to create a developer plan which is free.

### How It Works
#### Basic Uses
Basic uses will returned weather information for your current geolocation city. You just need to apply this jQuery widget on your html container element like this:

```
<script src="js/weather.widget.js"></script>
<script type="text/javascript">
  $(function () {
	  $("#element-selector").wuWeather({ apiKey: 'ee6004655118eefe'});
	});
</script>
```

Using available options, you can specify which city you want like this:

```
$("#weather-widget-forecast").wuWeather({
    apiKey: 'ee6004655118eefe',
    country: 'US',
    city: 'NewYork',
    unitDegree: 'C',
    unitMetric: 'K',
    view: 'forecast',
    enableAutocomplete: true,
    onError: function (errorMessage) {
        alert(errorMessage[0]);
    }
});
```

NOTE: As I explain above **apiKey** is mandatory. You can notice that i`m using developer plan apiKey for demo purpose.

Options         | Description
------------- | -------------
*apiKey*  | This key is provided by Weather Underground API service and it`s mandatory.
*country* | Two-letter country code [see more](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2). Default: current geolocation country code.
*city*  | City name. Default: current geolocation city.
*unitDegree*  | Temperature unit Celsius (C) or Fahrenheit (F). Default value: 'F'.
*unitMetric*  | Wind unit kph (K) or mph (M). Default value: 'M'.
*useDefaultWeatherIcon*  | Show or Hide default weather underground icons. Default value: false.
*enableAutocomplete*  | Enabling this property will convert Current City label into searchable autocomple input. Default value: false.
*view*  | Currentlly there are two views, *simple* and *forecast*. Default value: 'simple'.
*onError* | Callback error function
*htmlBodyTemplate*  | Here goes the html template for whole widget
*htmlForecastTemplate*  | Here goes the html template for forecast items



##### Weather Images
The Weather Underground API provides their own images for the weather icons, but they can be overridden by with custom weather images stored in this source.

#### Predefined Templates

There is a way to change the template of this widget. You need to modify this option property **htmlBodyTemplate**

```
'<div class="wuWeather-wrapper">' +
    '<h3 id="search-container">#city#</h3>' +
    '<div class="wuToday">' +
        '<div class="wuIconGroup">' +
            '<div style="height:100px"><img src="#image#" height="100" alt="weather icon"/></div>' +
            '<p class="wuText">#weather#</p>' +
        '</div>' +
        '#highTemperature#<sup>°</sup> | #lowTemperature#<sup>°</sup>' +
        '<div class="wuTemperature">#currentTemperature#<sup>°#degree#</sup>' +
            '<p class="wuDetail">' +
                '<span>feels like <b>#feelsLike#<sup>°#degree#</sup></b></span>' +
                '<span>wind: <b>#wind#</b></span>' +
                '<span>humidity: <b>#humidity#</b></span>' +
            '</p>' +
        '</div>' +
    '</div>' +
    '#wuForecasts#' +
    '<div id="wuLogo"><img src="#wuImage#" alt="weather icon"/></div>' +
'</div>'
```

and this is the template for forercast items **htmlForecastTemplate**

```
'<li class="wuDay">' +
    '<span>#forecast_day#</span>' +
    '<ul class="wuForecast">' +
        '<li class="wuIcon"><img src="#weatherIcon#" height="30px" alt="weather icon"/></li>' +
        '<li class="wuMin">#forecast_min#<sup>°#degree#</sup></li>' +
        '<li class="wuMax">#forecast_max#<sup>°#degree#</sup></li>' +
    '</ul>' +
'</li>'
```

NOTE: Be carefull when you modify these templates. The widget template variables are marked with **#varName#** like ex. #weatherIcon#

#### ScreenShots

![image](https://github.com/Makfull/wuWidget/blob/master/wu2.PNG)     ![image](https://github.com/Makfull/wuWidget/blob/master/wu1.PNG)
