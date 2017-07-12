
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $wunderElem = $('#wunder-info');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    var stateStr = $('#state').val();
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to see ' + address + '?');


    // // load yelp
    // XQ8Qkoc5W5_Ol1bYEjH9iw
    //
    // UtizH2b36cGwXATvzLMCqhADR2r8YQ5HUwQMCdmaolP7ENhim01WCRpIcxS63K0F
    //
    // https://api.yelp.com/v3/businesses/search/term=""/location=""/sort_by='rating"
    //


    // load wunderground
    var wunderURL = 'http://api.wunderground.com/api/2ad1668ce2b93100/conditions/almanac/q/' + stateStr + '/' + cityStr + '.json';

    var wunderRequestTimeout = setTimeout(function(){
        $wunderElem.text("Failed to get wunderground resources");
    }, 8000);


    $.ajax({
        url: wunderURL,
        dataType: "jsonp",
        success: function (url) {
            var weather = url.current_observation.weather;
            var forecast = url.current_observation.temperature_string;
            var avgHigh = url.almanac.temp_high.normal.F;
            var avgLow = url.almanac.temp_low.normal.F;

            var statement = 'The current weather in ' + address + ' is: ' + weather + ' and it is ' + forecast + '. ' + 'The average high temperature is ' + avgHigh + ' degrees F, and the average low temperature is ' + avgLow + ' degrees F.';

            $wunderElem.append('<li>' + statement + '</li>');

            clearTimeout(wunderRequestTimeout);
        }
    });


    // load streetview
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + '';
    $body.append('<img class="images" src="' + streetviewUrl + '">');




    // load nytimes
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=d094373923784e40b7ba73e5b54279d3';
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
                '</li>');
        };

    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });



    // load wikipedia data
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function( response ) {
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
