$(function () {
    $.widget("wunderground.wuWeather", {
        options: {
            apiKey: '',
            country: '',
            city: '',
            unitDegree: 'F', // ex. F, C
            unitMetric: 'M', // ex. M, K
            showUnitDegree: false,
            useDefaultWeatherIcon: false,
            enableAutocomplete: false,
            view: 'simple', // simple, forecast, etc
            forecastDays: 4,
            onError: function (errorMessage) { },
            htmlForecastTemplate: '<li class="wuDay">' +
                                    '<span>#forecast_day#</span>' +
                                    '<ul class="wuForecast">' +
                                        '<li class="wuIcon"><img src="#weatherIcon#" height="30px" alt="weather icon"/></li>' +
                                        '<li class="wuMin">#forecast_min#<sup>°#degree#</sup></li>' +
                                        '<li class="wuMax">#forecast_max#<sup>°#degree#</sup></li>' +
                                    '</ul>' +
                                '</li>',
            htmlBodyTemplate: '<div class="wuWeather-wrapper">' +
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
        },
        _settings: {
            _baseUrl: 'http://api.wunderground.com/api/',
            _weatherApiUrl: '',
            _isValid: function () {
                return this.errorMessage.length === 0;
            },
            errorMessage: []
        },
        _validateOptions: function () {
            var validatePropeties = ['apiKey', 'country', 'city', 'unitDegree', 'unitMetric', 'view'];

            for (var i = 0; i < validatePropeties.length; i++) {
                var prop = validatePropeties[i];
                if (prop in this.options) {
                    if (this.options[prop] === '') {
                        this._settings.errorMessage.push("The option '" + prop + "' can not be empty. ");
                    }
                }
            }
        },
        _defineDefaultValues: function (callback) {
            if (this.options.city != '' && this.options.country != '') {
                return callback(null);
            }

            var url = this._settings._weatherApiUrl + 'geolookup/q/autoip.json';
            this._callService(url, callback);
        },
        _mapWeatherIcon: function (weatherType, weatherIcon) {
            if (this.options.useDefaultWeatherIcon) return weatherIcon;

            var imagePath = 'images/weather-icons/';
            weatherIcon = weatherIcon.split('/').pop();
            var isNight = weatherIcon.indexOf('nt_') > -1;

            switch (weatherType) {
                case 'clear':
                case 'sunny':
                    return imagePath + (isNight ? 'sunny_night.png' : 'sunny.png');
                case 'chanceflurries':
                case 'flurries':
                    return imagePath + (isNight ? 'snow3_night.png' : 'snow5.png');
                case 'chancerain':
                    return imagePath + (isNight ? 'shower2_night.png' : 'shower3.png');
                case 'chancesleet':
                case 'sleet':
                    return imagePath + (isNight ? 'shower1_night.png' : 'light_rain.png');
                case 'chancesnow':
                    return imagePath + (isNight ? 'snow2_night.png' : 'snow4.png');
                case 'chancetstorms':
                case 'tstorms':
                    return imagePath + (isNight ? 'tstorm1_night.png' : 'tstorm3.png');
                case 'cloudy':
                    return imagePath + (isNight ? 'cloudy3_night.png' : 'cloudy5.png');
                case 'fog':
                    return imagePath + (isNight ? 'fog_night.png' : 'fog.png');
                case 'hazy':
                    return imagePath + (isNight ? 'mist_night.png' : 'mist.png');
                case 'mostlycloudy':
                    return imagePath + (isNight ? 'cloudy4_night.png' : 'cloudy4.png');
                case 'mostlysunny':
                    return imagePath + (isNight ? 'cloudy1_night.png' : 'cloudy1.png');
                case 'partlycloudy':
                    return imagePath + (isNight ? 'cloudy2_night.png' : 'cloudy2.png');
                case 'partlysunny':
                    return imagePath + (isNight ? 'cloudy3_night.png' : 'cloudy3.png');
                case 'rain':
                    return imagePath + (isNight ? 'shower2_night.png' : 'shower3.png');
                case 'snow':
                    return imagePath + (isNight ? 'snow2_night.png' : 'snow4.png');
                default:
                    return weatherType;
            }
        },
        _getHtmlTemplate: function (forecastData) {
            var forecastHtml = '';
            var htmlTemplate = this.options.htmlBodyTemplate;
            var keyPattern = '#wuForecasts#';
            var re = new RegExp(keyPattern, 'gi');

            if (this.options.view === 'forecast' && !!forecastData) {
                var forecastDays = Math.min(parseInt(this.options.forecastDays), 10);
                var forecastHtml = '<ul class="wuForecasts">';
                for (var i = 0; i < forecastDays; i++) {
                    var forecastDay = forecastData.simpleforecast.forecastday[i];
                    var itemRow = this.options.htmlForecastTemplate;

                    var keyValuePair = [
                        { key: 'forecast_day', value: forecastDay.date.weekday },
                        { key: 'degree', value: this.options.unitDegree },
                        { key: 'weatherIcon', value: this._mapWeatherIcon(forecastDay.icon, forecastDay.icon_url) },
                        { key: 'forecast_max', value: this.options.unitDegree.toLowerCase() == "c" ? forecastDay.high.celsius : forecastDay.high.fahrenheit },
                        { key: 'forecast_min', value: this.options.unitDegree.toLowerCase() == "c" ? forecastDay.low.celsius : forecastDay.low.fahrenheit }
                    ];

                    for (var y = 0; y < keyValuePair.length; y++) {
                        var keyPatterng = '#' + keyValuePair[y].key + '#';
                        var reg = new RegExp(keyPatterng, 'gi');

                        itemRow = itemRow.replace(reg, keyValuePair[y].value);
                    }

                    forecastHtml += itemRow;
                }
                forecastHtml += '</ul>';
            }

            htmlTemplate = htmlTemplate.replace(re, forecastHtml);

            return htmlTemplate;
        },
        _parseHtmlTemplate: function (weatherData, forecastData) {
            var htmlTemplate = this._getHtmlTemplate(forecastData);
            var keyValuePair = [
                { key: 'city', value: weatherData.display_location.full },
                { key: 'degree', value: this.options.unitDegree },
                { key: 'weather', value: weatherData.weather },
                { key: 'currentTemperature', value: this.options.unitDegree.toLowerCase() == "c" ? parseInt(weatherData.temp_c) : parseInt(weatherData.temp_f) },
                { key: 'lowTemperature', value: this.options.unitDegree.toLowerCase() == "c" ? weatherData.dewpoint_c : weatherData.dewpoint_f },
                { key: 'highTemperature', value: this.options.unitDegree.toLowerCase() == "c" ? 'NA' : 'NA' },
                { key: 'image', value: this._mapWeatherIcon(weatherData.icon, weatherData.icon_url) },
                { key: 'humidity', value: weatherData.relative_humidity },
                { key: 'feelsLike', value: this.options.unitDegree.toLowerCase() == "c" ? weatherData.feelslike_c : weatherData.feelslike_f },
                { key: 'wind', value: this.options.unitMetric.toLowerCase() == "k" ? weatherData.wind_kph + ' km' : weatherData.wind_mph + ' mph' },
                { key: 'wuImage', value: weatherData.image.url }
            ];

            for (var i = 0; i < keyValuePair.length; i++) {
                var keyPattern = '#' + keyValuePair[i].key + '#';
                var re = new RegExp(keyPattern, 'gi');

                htmlTemplate = htmlTemplate.replace(re, keyValuePair[i].value);
            }

            return htmlTemplate;
        },
        _callService: function (url, callback) {
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: function (jsonData) {
                    callback(jsonData);
                },
                error: function (e, r, t) {
                    callback(t);
                }
            });
        },
        _initAutocomplete: function () {
            var self = this;
            if (!self.options.enableAutocomplete) return;

            var acContainer = self.element.find("#search-container");
            if (acContainer.length) {
                var originalText = acContainer.text();
                var autocompleteElem = $('<input>').attr({ 'type': 'text', 'value': originalText });
                autocompleteElem.autocomplete({
                    source: function (request, response) {
                        var url = 'http://autocomplete.wunderground.com/aq?&cb=call=?';
                        $.ajax({
                            url: url,
                            dataType: "jsonp",
                            crossDomain: true,
                            data: {
                                "query": request.term
                            },
                            maxResults: 12,
                            success: function (parsed_json) {
                                var data = [];

                                var c = $.each(parsed_json.RESULTS, function (i, item) {
                                    var out = (parsed_json.RESULTS[i].name);
                                    data.push(out);
                                });

                                response(data.slice(0, this.maxResults));
                            },
                            error: function (xhr, ajaxOptions, thrownError) { }
                        });
                    },
                    minLength: 3,
                    select: function (event, ui) {
                        if (ui.item) {
                            var value = ui.item.label.split(',');
                            self.getTemperature(value[0].trim(), value[1].trim());
                        } else {
                            console.log("Nothing selected, input was " + this.value);
                        }
                    },
                    open: function () {
                        $('.ui-widget-content').css('width', autocompleteElem.css('width'));
                    },
                    close: function () {
                        autocompleteElem.val(originalText);
                        $(this).removeClass("ui-corner-all");
                    }
                });

                acContainer.html(autocompleteElem);
            }
        },
        _loader: function (showLoader) {
            var loaderElem = $('#loader-wrapper');
            if (showLoader) {
                var width = this.element.width();
                var height = this.element.height();
                var containerWrapper = this.element.offset();
                var top = containerWrapper.top;
                var left = containerWrapper.left;

                loaderElem.css({ 'top': top, 'left': left, 'width': width, 'height': height, 'display': 'block' });
                this.element.css('opacity', 0.5);
            } else {
                loaderElem.css({ 'display': 'none' });
                this.element.css('opacity', 1);
            }
        },
        _init: function () {
            var self = this;

            // setting base weather service url by client
            self._settings._weatherApiUrl = self._settings._baseUrl + self.options.apiKey + '/';

            // setting up city and country by current location if needed
            var callback = function (jsonData) {
                if (!jsonData) {
                    // validate widget options 
                    self._validateOptions();
                } else {
                    self.options.city = jsonData.location.city;
                    self.options.country = jsonData.location.country;
                }

                // getting temperature by current location 
                self.getTemperature(self.options.city, self.options.country);
            };

            this._defineDefaultValues(callback);

        },
        getTemperature: function (city, country) {
            var self = this;
            var options = self.options;

            if (!self._settings._isValid()) {
                self.options.onError(self._settings.errorMessage);
                return false;
            }

            self._loader(true);

            var url = self._settings._weatherApiUrl + 'conditions/q/' + country + '/' + city + '.json';
            var callback = function (jsonData) {
                if (!jsonData.current_observation) {
                    self.options.onError([jsonData.response.error.description]);
                } else {
                    var parsedHtmlTemplate = '';
                    if (self.options.view === 'forecast') {

                        self.getForecast(city, country, function (data) {
                            parsedHtmlTemplate = self._parseHtmlTemplate(jsonData.current_observation, data.forecast);
                            self.element.html(parsedHtmlTemplate);

                            self._initAutocomplete();
                            self._loader(false);
                        });
                    } else {
                        parsedHtmlTemplate = self._parseHtmlTemplate(jsonData.current_observation);
                        self.element.html(parsedHtmlTemplate);

                        self._initAutocomplete();
                        self._loader(false);
                    }
                }

            };

            this._callService(url, callback);
        },
        getForecast: function (city, country, callback) {
            var self = this;
            var options = self.options;

            if (!self._settings._isValid()) {
                self.options.onError(self._settings.errorMessage);
                return false;
            }

            var url = self._settings._weatherApiUrl + 'forecast/q/' + country + '/' + city + '.json';
            this._callService(url, callback);
        }
    });
});