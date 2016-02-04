angular.module('GNPApp', [])

.controller('MainController', function($scope, $http) {
  $scope.test = "Hello World!";
  
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  $scope.height = 500;
  $scope.width = 1000;
  $scope.padding = 50;

  $scope.changeHeight = function(height) {
    $scope.height = height;
    console.log($scope.height);
  }

  var container = d3.select('#graph')
    .append('svg')
    .attr('width', $scope.width + $scope.padding * 2)
    .attr('height', $scope.height + $scope.padding * 2);

  var viz = container.append('g')
    .attr('id', 'viz')
    .attr('transform', 'translate(' + $scope.padding*1.5 + ',' + $scope.padding*0.75 + ')');

  var yScale = d3.scale.linear().range([$scope.height, 0]);
  var xScale = d3.time.scale().range([0, $scope.width]);

  var moneyFormat = d3.format("$s")

  var yAxis = d3.svg.axis().scale(yScale)
    .orient('left')
    .ticks(20)
    .tickSize(10)
    .tickFormat(function(d) {
      return moneyFormat(d * 1000000000);
    })

  var xAxis = d3.svg.axis().scale(xScale)
    .orient('bottom')
    .ticks(20)
    .tickSize(10)


  var parseTime = d3.time.format("%Y-%m-%d");

  d3.json('app/gdp-data.json', function(data) {
    console.log(data.data);


    var yMax = d3.max(data.data, function(element) {
      return element[1];
    });

    var xMin = d3.min(data.data, function(element) {
      time = parseTime.parse(element[0]);
      return time
    });


    var xMax = d3.max(data.data, function(element) {
      time = parseTime.parse(element[0]);
      time.setMonth(time.getMonth() + 1);
      return time
    });


    yScale.domain([0, yMax]);
    xScale.domain([xMin, xMax]);



    viz.append('g')
      .attr('class', 'axis x-axis')
      .attr("transform", "translate(0," + $scope.height + ")")
      .call(xAxis)
      .selectAll('text')
      .attr("transform", function() {
              return "rotate(-30)"
              })
      .style("text-anchor", "end")
      .style('fill', '#fcf7f8')
      .attr("dx", "-10px")
      .attr("dy", "10px");

    viz.append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
      .selectAll('text')
      .style('fill', '#fcf7f8')

    var barwidth = $scope.width / data.data.length;

    var bars = viz.selectAll('rect')
      .data(data.data)
      .enter()
      .append('g')
      .attr('class', 'bar-g')
      .attr('transform', function(d, i) {
        return 'translate(' + (i * barwidth - barwidth / 2) + ', ' + yScale(d[1]) + ')';
      })

    bars.append('rect')
      .attr('class', 'bar')
      .attr('height', function(d) {
        return $scope.height - yScale(d[1]);
      })
      .attr('x', barwidth)
      .attr('width', barwidth)
      .style('fill', 'rgba(75, 179, 253, 0.8)')

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var date = new Date(d[0]);
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return '<h4>$' + d[1].toFixed(2) + ' Billion</h4><p>' + monthNames[monthIndex] + " " + year + '</p>' 
      });

    container.call(tip);

    bars.on('mouseenter', function(d, i) {
        tip.show(d, i)
        d3.select(this)
          .select('rect')
          .style('fill', '#00487c')
      })
      .on('mouseleave', function(d, i) {
        tip.show(d, i)
        d3.select(this)
          .select('rect')
          .style('fill', 'rgba(75, 179, 253, 0.8)')
      })
  });
});