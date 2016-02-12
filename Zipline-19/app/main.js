angular.module('ForceApp', [])

.controller('MainController', function($scope) {

  var height = 800;
  var width = 800;

  var color = d3.scale.category20();

  var force = d3.layout.force()
    .charge(-400)
    .linkDistance(60)
    .linkStrength(0.3)
    .gravity(0.3)
    .size([width, height])

  var svg = d3.select('#chart').append('svg').attr({ height: height, width: width })

  d3.json('http://www.freecodecamp.com/news/hot', function(data) {

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return '<h4>' + d.name + '</h4>' ;
      });

    svg.call(tip);



    var domainKey = [];
    var domains = [];
    var userKey = [];
    var users = [];

    for(var i=0;i<data.length;i++) {
      var domainName = data[i].link.split('/')[2];
      var domainIndex = domainKey.indexOf(domainName);
      var userIndex = userKey.indexOf(data[i].author.username);

      if(userIndex < 0) {
        users.push({
          name: data[i].author.username, 
          group: userIndex, 
          img: data[i].author.picture,
          count: 1
        });
        userKey.push(data[i].author.username)
      } else {
        users[userIndex].count += 1;
      }

      if(domainIndex < 0) {
        domains.push({
          name: domainName,
          group: domainIndex,
          count: 1
        })
        domainKey.push(domainName)
      } else {
        domains[domainIndex].count += 1;
      }
    }
    console.log(users)
    var links = data.map(function(story) {
      var link = {
        source: domainKey.length + userKey.indexOf(story.author.username),
        target: domainKey.indexOf(story.link.split('/')[2]),
        offset: 10 + users[userKey.indexOf(story.author.username)].count * 2
      }
      return link
    })

    force.nodes(domains.concat(users))
      .links(links)
      .start()

    var link = svg.selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .style('stroke-width', 1)
      .style('stroke', '#888')

    var colors = [
      '003300',
      '004500',
      '005800',
      '006A00',
      '007D00',
      '008F00',
      '00A200',
      '00B400',
      '00C700',
      '00D900',
      '00EC00',
      '00FF00'
    ];


    var domainNodes = svg.selectAll('.node.domain')
      .data(domains)
      .enter()
      .append('circle')
      .attr('class', 'node domain')
      .attr('r', function(d, i) {
        return 2 * d.count + 5;
      })
      .style('fill', function(d, i) {
        if(colors[d.count]) {
          return colors[d.count];
        } else {
          return 'green';
        }
      })
      .call(force.drag)
      .on('mouseover', tip.show)
      .on('mouseleave', tip.hide);

    var clippaths = svg.selectAll('clips')
      .data(users)
      .enter()
      .append('clipPath')
      .attr('id', function(d, i) {
        return 'clip-path-' + i;
      })
      .append('circle')
      .attr("r", function(d) {
        return 10 + d.count * 2;
      });

    var userNodes = svg.selectAll('.node.user')
      .data(users)
      .enter()
      .append('svg:image')
      .attr({
        class: 'node user',
        'xlink:href': function(user, index) {
          return user.img;
        },
        height: function(user, index) {
          return 20 + user.count * 4;
        },
        width: function(user, index) {
          return 20 + user.count * 4;
        },
        'clip-path': function(d, i) {
          return 'url("#clip-path-' + i + '")';
        }
      })
      .call(force.drag)
      .on('mouseover', tip.show)
      .on('mouseleave', tip.hide);


    force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x + d.offset; })
          .attr("y1", function(d) { return d.source.y + d.offset; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      domainNodes.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });

      clippaths.attr("cx", function(d) { return d.x + 10 + d.count * 2; })
          .attr("cy", function(d) { return d.y + 10 + d.count * 2; });

      userNodes.attr("x", function(d) { return d.x; })
          .attr("y", function(d) { return d.y; });
    });
  });
});