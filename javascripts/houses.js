
d3.json("javascripts/json/datarea.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;

  var opts = {
 "dom": "chart34fdeddb85",
"width":    450,
"height":    450,
"xAxis": {
 "type": "addMeasureAxis",
"showPercent": false,
"overrideMin":      2
},
"yAxis": {
 "type": "addMeasureAxis",
"showPercent": false
},
"zAxis": [],
"colorAxis": [],
"defaultColors": ["#9ecae1", "#deebf7", "#c6dbef", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
"layers": [],
"legend": [],
"x": "Historical volatility",
"y": "Monthly growth",
"type": "bubble",
"col": "Grade",
"groups": [ "sector", "Grade" ],
"id": "chart34fdeddb85"
};

  if($(window).width() < 500){
    width = $(window).width()/1.3;
    height = width * 1.3;
  } else {
    width = 450;
    height = 450;
  }

  var svg = dimple.newSvg("#" + opts.id, width, height);

  var myChart = new dimple.chart(svg, data);
  if (opts.bounds) {
    myChart.setBounds(opts.bounds.x, opts.bounds.y, opts.bounds.width, opts.bounds.height);//myChart.setBounds(80, 30, 480, 330);
  }
  //dimple allows use of custom CSS with noFormats
  if(opts.noFormats) { myChart.noFormats = opts.noFormats; }
  //for markimekko and addAxis also have third parameter measure
  //so need to evaluate if measure provided

  //function to build axes
  function buildAxis(position,layer){
    var axis;
    var axisopts;
    if (!layer[position+"Axis"]){
      axisopts = opts[position+"Axis"];
    } else axisopts = layer[position+"Axis"];

    if(axisopts.measure) {
      axis = myChart[axisopts.type](position,layer[position],axisopts.measure);
    } else {
      axis = myChart[axisopts.type](position, layer[position]);
    };
    if(!(axisopts.type === "addPctAxis")) axis.showPercent = axisopts.showPercent;
    if (axisopts.orderRule) axis.addOrderRule(axisopts.orderRule);
    if (axisopts.grouporderRule) axis.addGroupOrderRule(axisopts.grouporderRule);
    if (axisopts.overrideMin) axis.overrideMin = axisopts.overrideMin;
    if (axisopts.overrideMax) axis.overrideMax = axisopts.overrideMax;
    if (axisopts.inputFormat) axis.dateParseFormat = axisopts.inputFormat;
    if (axisopts.outputFormat) axis.tickFormat = axisopts.outputFormat;
    return axis;
  };

  var c = null;
  if(d3.keys(opts.colorAxis).length > 0) {
    c = myChart[opts.colorAxis.type](opts.colorAxis.colorSeries,opts.colorAxis.palette) ;
  }

  //allow manipulation of default colors to use with dimple
  if(opts.defaultColors.length) {
    //opts.defaultColors = opts.defaultColors[0];
    if (typeof(opts.defaultColors) == "function") {
      //assume this is a d3 scale
      //for now loop through first 20 but need a better way to handle
      defaultColorsArray = [];
      for (var n=0;n<20;n++) {
        defaultColorsArray.push(opts.defaultColors(n));
      };
      opts.defaultColors = defaultColorsArray;
    }
    opts.defaultColors.forEach(function(d,i) {
      opts.defaultColors[i] = new dimple.color(d);
    })
    myChart.defaultColors = opts.defaultColors;
  }

  //do series
  //set up a function since same for each
  //as of now we have x,y,groups,data,type in opts for primary layer
  //and other layers reside in opts.layers
  function buildSeries(layer, hidden){
    //inherit from primary layer if not intentionally changed or xAxis, yAxis, zAxis null
    if (!layer.xAxis) layer.xAxis = opts.xAxis;
    if (!layer.yAxis) layer.yAxis = opts.yAxis;
    if (!layer.zAxis) layer.zAxis = opts.zAxis;

    var x = buildAxis("x", layer);
    x.hidden = hidden;

    var y = buildAxis("y", layer);
    y.hidden = hidden;

    //z for bubbles
    var z = null;
    if (!(typeof(layer.zAxis) === 'undefined') && layer.zAxis.type){
      z = buildAxis("z", layer);
    };

    //here think I need to evaluate group and if missing do null
    //as the group argument
    //if provided need to use groups from layer
    var s = new dimple.series(myChart, null, x, y, z, c, null, dimple.plot[layer.type], dimple.aggregateMethod.avg, dimple.plot[layer.type].stacked);

    //as of v1.1.4 dimple can use different dataset for each series
    if(layer.data){
      //convert to an array of objects
      //avoid lodash for now
      datakeys = d3.keys(layer.data)
      layer.dataarray = layer.data[datakeys[1]].map(function(d,i){
        var tempobj = {}
        datakeys.forEach(function(key){
          tempobj[key] = layer.data[key][i]
        })
        return tempobj
      })
      s.data = layer.dataarray;
    }

    //for measure axis dimple sorts at the series level not at axis level
    ['x','y'].map(function(ax){
      if( layer[ax + 'Axis'].type=="addMeasureAxis" && layer[ax + 'Axis'].orderRule ){
        if( typeof layer[ax + 'Axis'].orderRule == "string" ){
          s.addOrderRule( layer[ax + 'Axis'].orderRule );
        } else if ( typeof layer[ax + 'Axis'].orderRule == "object" ) {
          s._orderRules = layer[ax + 'Axis'].orderRule;
        }
      }
    })

    if(layer.hasOwnProperty("groups")) {
      s.categoryFields = (typeof layer.groups === "object") ? layer.groups : [layer.groups];
      //series offers an aggregate method that we will also need to check if available
      //options available are avg, count, max, min, sum
    }
    if (!(typeof(layer.aggregate) === 'undefined')) {
      s.aggregate = eval(layer.aggregate);
    }
    if (!(typeof(layer.lineWeight) === 'undefined')) {
      s.lineWeight = layer.lineWeight;
    }
    if (!(typeof(layer.lineMarkers) === 'undefined')) {
      s.lineMarkers = layer.lineMarkers;
    }
    if (!(typeof(layer.barGap) === 'undefined')) {
      s.barGap = layer.barGap;
    }
    if (!(typeof(layer.interpolation) === 'undefined')) {
      s.interpolation = layer.interpolation;
    }

    myChart.series.push(s);

    /*placeholder fix domain of primary scale for new series data
    //not working right now but something like this
    //for now just use overrideMin and overrideMax from rCharts
    for( var i = 0; i<2; i++) {
      if (!myChart.axes[i].overrideMin) {
        myChart.series[0]._axisBounds(i==0?"x":"y").min = myChart.series[0]._axisBounds(i==0?"x":"y").min < s._axisBounds(i==0?"x":"y").min ? myChart.series[0]._axisBounds(i==0?"x":"y").min : s._axisBounds(i==0?"x":"y").min;
      }
      if (!myChart.axes[i].overrideMax) {
        myChart.series[0]._axisBounds(i==0?"x":"y")._max = myChart.series[0]._axisBounds(i==0?"x":"y").max > s._axisBounds(i==0?"x":"y").max ? myChart.series[0]._axisBounds(i==0?"x":"y").max : s._axisBounds(i==0?"x":"y").max;
      }
      myChart.axes[i]._update();
    }
    */


    return s;
  };

  buildSeries(opts, false);
  if (opts.layers.length > 0) {
    opts.layers.forEach(function(layer){
      buildSeries(layer, true);
    })
  }
  //unsure if this is best but if legend is provided (not empty) then evaluate
  if(d3.keys(opts.legend).length > 0) {
    var l =myChart.addLegend();
    d3.keys(opts.legend).forEach(function(d){
      l[d] = opts.legend[d];
    });
  }
  //quick way to get this going but need to make this cleaner
  if(opts.storyboard) {
    myChart.setStoryboard(opts.storyboard);
  };
  myChart.draw();
});
