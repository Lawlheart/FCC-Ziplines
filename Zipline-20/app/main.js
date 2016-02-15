angular.module('MeteorApp', [])

.controller('MainController', function($scope) {

  function zoomed() {
    viz.attr("transform", 
      "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }
  function classify(meteorClass) {
    classData = meteorClass.split(/[\d\,\-\s\/\?]/)[0];
    var classification;
    switch(classData) {
      case "H":
      case "L":
      case "LL":
      case "OC":
        classification = "Ordinary Chondrite";
        break;
      case "C":
      case "CI":
      case "CM":
      case "CO":
      case "CV":
      case "CK":
      case "CR":
      case "CH":
      case "CB":
      case "CBa":
        classification = "Carbonaceous Chrondrite";
        break;
      case "EH":
      case "EL":
        classification = "Enstatite Chrondrite";
        break;
      case "R":
      case "K":
        classification = "Other Chrondrite";
        break;
      case "Acapulcoite":
      case "Lodranite":
      case "Winonaite":
        classification = "Primitive Achondrite";
        break;
      case "Eucrite":
      case "Diogenite":
      case "Howardite":
      case "Angrite":
      case "Aubrite":
      case "Ureilite":
      case "Martian":
        classification = "Asteroidal Achondrite";
        break;
      case "Achondrite":
        classification = "Other Achondrite";
        break;
      case "Stone":
        classification = "Other Stony";
        break;
      case "Pallasite":
        classification = "Pallasite Stony-Iron";
        break;
      case "Mesosiderite":
        classification = "Mesosiderite Stony-Iron";
        break;
      case "Iron":
        classification = "Iron Meteorites";
        break;
      default:
        classification = "Unknown";
    }
    return classification;
  }
  $scope.classes = ["Carbonaceous Chrondrite", "Primitive Achondrite", "Pallasite Stony-Iron", "Enstatite Chrondrite", "Asteroidal Achondrite", "Mesosiderite Stony-Iron", "Ordinary Chondrite", "Other Achondrite", "Iron Meteorites", "Other Chrondrite", "Other Stony", "Unknown"];
  
  $scope.classColors = {
    // Stony Meteors: Chondrites
    "Other Chrondrite": "rgba(0, 139, 9, 0.6)",
    "Ordinary Chondrite": "rgba(0, 139, 9, 0.6)",
    "Enstatite Chrondrite": "rgba(62, 208, 72, 0.6)",
    "Carbonaceous Chrondrite": "rgba(0, 255, 0, 0.6)",

    // Stony Meteors: Achondrites
    "Other Achondrite": "rgba(8, 60, 115, 0.6)",
    "Primitive Achondrite": "rgba(13, 88, 166, 0.6)",
    "Asteroidal Achondrite": "rgba(0, 0, 255, 0.6)",

    // Stony Meteors: Other
    "Other Stony": "rgba(0, 140, 140, 0.6)",

    // Stony-Iron Meteors
    "Pallasite Stony-Iron": "rgba(255, 228, 0, 0.6)",
    "Mesosiderite Stony-Iron": "rgba(255, 120, 0, 0.6)",

    // Iron Meteors
    "Iron Meteorites": "rgba(255, 7, 0, 0.6)",

    //Unknown
    "Unknown": "rgba(80, 80, 80, 0.6)"
  };
  
  var width = parseInt(d3.select('#chart').style('width'));
  var height = width / 2;

  var projection = d3.geo.eckert3()
    .scale(width / 5.3)
    .translate([width / 2, height / 2])
    .precision(.1);

  var zoom = d3.behavior.zoom()
    .scale(1)
    .scaleExtent([1, 10])
    .translate([0,0])
    .on("zoom", zoomed);

  var geoPath = d3.geo.path()
    .projection(projection)

  var graticule = d3.geo.graticule();

  var svg = d3.select('#chart')
    .append('svg').attr({
      width: width,
      height: height })
    .call(zoom);

  var viz = svg.append('g')
    .attr('id', 'viz')

  var rect = viz.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

  viz.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', geoPath)

  d3.json('app/world.json', function(error, world) {
    if (error) throw error;

    viz.insert('path', '.graticule')
      .datum(topojson.feature(world, world.objects.land))
      .attr('class', 'land')
      .attr('d', geoPath)

    viz.insert('path', '.graticule')
    .datum(topojson.mesh(world, world.objects.countries, function(a, b) {
      return a !== b; }))
    .attr('class', 'boundary')
    .attr('d', geoPath)

    d3.json('app/meteors.json', function(error, data) {

    var rDomain = d3.extent(data.features, function(element) {
      var mass = element.properties.mass;
      return Math.sqrt(mass / Math.PI)});

    var rScale = d3.scale.linear().range([3, 45]).domain(rDomain)


    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var date = new Date(d.properties.year);
        var html = '<h4><span class="label">Name:</span> ' + d.properties.name + '</h4>';
        html += '<p><span class="label">Mass:</span> ' + d.properties.mass + ' kg</p>';
        html += '<p><span class="label">Class:</span> ' + d.properties.recclass + '</p>';
        html += '<p><span class="label">Class Group:</span> ' + classify(d.properties.recclass) + '</p>';
        html += '<p><span class="label">Date:</span> ' + date.toLocaleDateString() + '</p>';
        return html;
      });

    svg.call(tip);

    var meteors = viz.selectAll('path.meteor')
      .data(data.features)
      .enter()
      .append('path')
      .attr('class', 'meteor')
      .attr('fill', function(d) {
        return $scope.classColors[classify(d.properties.recclass)];
      })
      .attr('d', geoPath.pointRadius(function(d) {
        return rScale(Math.sqrt(d.properties.mass / Math.PI))}))
      .on('mouseenter', tip.show)
      .on('mouseleave', tip.hide)

    d3.select(window).on('resize', function() {
      width = parseInt(d3.select('#chart').style('width'));
      height = width / 2;

      rect.attr("width", width).attr("height", height)

      projection.scale(width / 5.3).translate([width / 2, height / 2])

      svg.attr({ width: width, height: height }).call(zoom);

      rect.attr("width", width).attr("height", height)
    })

    });
  });


});