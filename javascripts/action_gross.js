

d3.json("javascripts/json/action.json", function(error, json) {
  if (error) return console.warn(error);
  data = json;

  var svg = dimple.newSvg("#actionGross", 700, 700);

  var myChart = new dimple.chart(svg, data);
  myChart.setBounds(180, 30, 480, 330);
  myChart.setMargins(120, 10, 150, 150);

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
