angular.module('ScatterplotApp', [])

.controller('MainController', function($scope) {
  $scope.test = "Hello World";

  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(data) {
    console.log(data.length);

    // set variables
    // create svg container
    // set up viz 

    // set up scales
    // set up x and y min/max
    // set domain with min/max

    // use scales to set up axes
    // create axes
      // x axis needs to be offset
    // make data items
    // make and call tip item


    var height = 600;
    var width = 1000;
    var padding = 50;

    var svg = d3.select('#graph').append('svg')
      .attr('height', height + 2 * padding)
      .attr('width', width + 2 * padding);

    var viz = svg.append('g')
      .attr('id', 'viz')
      .attr('transform', 'translate(' + padding * 1.5 + ',' + padding * 0.75 + ')');



    var parseTime = d3.time.format('%M:%S');
    var yScale = d3.scale.linear().range([0, height]).domain([0, data.length]);
    var xScale = d3.time.scale().range([0, width]).domain([parseTime.parse("36:31"), parseTime.parse("40:01")].reverse());



    var ticks = ["00:10", "00:40", "01:10", "1:40", "2:10", "2:40", "3:10"];
    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(8);
    var xAxis = d3.svg.axis().scale(xScale).orient('bottom').ticks(7)
      .tickFormat(function(d, i) {
        return ticks[i];
      })
    

    
    // x Axis
    viz.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis)
    viz.append('text')
      .attr({
        class: 'x label',
        'text-anchor': 'end',
        x: width / 2 + 100,
        y: height + padding 
      })
      .text('Minutes Behind Fastest Time')

    // y axis
    viz.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis);
    viz.append('text')
      .attr({
        class: 'y label',
        'text-anchor': 'end',
        y: 0 - padding,
        dy: '0.75em',
        transform: 'rotate(-90)'})
      .text('Ranking');


  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .html(function(d, i) {
      var HTML = '<h4>' + d.Name + ': ' + d.Nationality + '</h4>';
      HTML += '<h4>Year: ' + d.Year + ', Time: ' + d.Time + '</h4>';
      HTML += '<h5>' + d.Doping + '</h5>';
      return HTML;
    })

  viz.call(tip)


    // key
    var keyData = ["No doping allegations", "Riders with doping allegations"]

    var key = viz.append('g')
      .attr({
        class: 'key',
        transform: 'translate(60, 20)'
      })
      
    var keydots = key.selectAll('circle')
      .data(keyData)
      .enter()
      .append('g')
      .attr('class', 'key')
      .attr('transform', 'translate(60, 40)')

    keydots.append('circle')
      .attr({
        class:function(d, i) {
          return "doping-" + (i === 1);
        },
        r: 5,
        cy: function(d, i) {
          return 20 * i;
        }
      })
    keydots.append('text')
      .attr({
        x: 10,
        y: function(d, i) {
          return 20 * i + 5;
        }
      })
      .text(function(d, i) {
        return d;
      })


    // data points
    var dots = viz.selectAll('circle')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'dot-group')

    dots.append('circle')
      .attr({
        class: function(d) {
          return 'doping-' + (d.Doping !== "");
        },
        r: 5,
        time: function(d) {
          return d.Time;
        },
        cx: function(d) {
          return xScale(parseTime.parse(d.Time));
        },
        cy: function(d, i) {
          return yScale(i)
        }
      })



    // data labels
    dots.append('text')
      .text(function(d) {
        return d.Name;
      })
      .attr({
        x: function(d) {
          return xScale(parseTime.parse(d.Time));
        },
        y: function(d, i) {
          return yScale(i)
        },
        transform: 'translate(10, ' + yScale(0.3) + ')'
      })

    dots.on('mouseenter', tip.show)
      .on('mouseleave', tip.hide)

  })
});