d3.json("javascripts/json/action.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;

  if($(window).width() < 700){
    width = $(window).width()/1.3;
  } else {
    width = 600;
  }

  var svg = dimple.newSvg("#actionBudgetVGross", width, width);

  var myChart = new dimple.chart(svg, data);
  myChart.setMargins("10%", "5%", "5%", "10%");

  //x axis
  var x = myChart.addMeasureAxis("x", "Adjusted budget");
  x.title = "Adjusted budget (2014 US dollars)";


  //y axis
  var y = myChart.addMeasureAxis("y", "Adjusted gross");

//  y.tickFormat = ",.f";
  y.title = "Estimated gross (2014 US dollars)";


  var s = myChart.addSeries(["actor", "film"], dimple.plot.bubble, [x, y]);

  myChart.draw();

//ccould force reload on window size change, but jittery
//  $(window).resize(function(){location.reload();});

});
