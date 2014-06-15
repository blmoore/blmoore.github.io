d3.json("/blog/js/json/action.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;

  if($(window).width() < 700){
    width = $(window).width()/1.3;
    height = width * 1.2;
  } else {
    width = 550;
    height = 700;
  }


  // width then height
  var svg = dimple.newSvg("#actionGross", width, height);

  var myChart = new dimple.chart(svg, data);
  //margins : outside plot area, bounds inside
  //  myChart.setMargins("20%", "5%", "5%", "20%");
  myChart.setBounds("20%", "2%", "72%", "80%");

  //x axis
  var x = myChart.addCategoryAxis("x", "actor");
  x.title = null;

  //y axis
  var commasFormatter = d3.format(",.0f");
  var y = myChart.addMeasureAxis("y", "Adjusted gross");

  y.tickFormat = ",.f";
  y.title = "Estimated gross (2014 US dollars)";


  var s = myChart.addSeries(["actor", "film"], dimple.plot.bar, [x, y]);

  myChart.draw();

  // thanks to http://stackoverflow.com/a/17792468/1274516
  x.shapes.selectAll("text").attr("transform",
  function (d) {
    return d3.select(this).attr("transform") + " translate(0, 20) rotate(-45)";
  });
});
