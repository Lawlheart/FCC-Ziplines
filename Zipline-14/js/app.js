/* React methods:
  React.createClass(object)
    Properties:
      getInitialState: function
      componentDidMount: function
      render: function
  React.createElement(element, props, contents
  React.render(element, target)
  React.findDOMNode(this.refs.refName)
    refName is red property passed with createElement */

//life based on number of neighbors
  // Live cells
    // 0-1 : death
    // 2-3 : lives
    // 4-8 : death
  // Dead Cells
    // 0-2 : stays dead
    // 3   : Birth
    // 4-8 : stays dead


element = React.createElement;

Main = React.createClass({
  getInitialState: function() {
    return {
      live: [128, 149, 167, 168, 169],
      born: [],
      tempo: 100,
      height: 20,
      width: 20,
      running: false,
      generations: 0
    }
  },
  getNeighbors: function(index, height, width) {
    var neighbors = []
    if(index - width >= 0) {
      neighbors.push(index - width);
    }
    if( index + width <= height * width - 1) {
      neighbors.push(index + width);
    }
    if(index % width !== 0) {
      neighbors.push(index - 1)
    }
    if((index + 1) % width !== 0) {
      neighbors.push(index + 1)
    }
    if(index - width >= 0 && index % width !== 0) {
      neighbors.push(index - width - 1);
    }
    if(index - width >= 0 && (index + 1) % width !== 0) {
      neighbors.push(index - width + 1);
    }
    if( index + width <= height * width - 1 && index % width !== 0) {
      neighbors.push(index + width - 1);
    }
    if( index + width <= height * width - 1 && (index + 1) % width !== 0) {
      neighbors.push(index + width + 1);
    }
    return neighbors
  },
  livingNeighbors: function(neighbors) {
    var living_neighbors = 0;
    for(var j=0;j<neighbors.length;j++) {
      if(this.state.live.indexOf(neighbors[j]) >= 0) {
        living_neighbors ++
      } 
    }
    return living_neighbors;
  },
  giveLife: function(i) {
    if(this.state.live.indexOf(i) < 0) {
      $('.dot-' + i).addClass('live');
      this.setState({
        live: this.state.live.concat(i)
      })
    } else {
      $('.dot-' + i).removeClass('live');
      this.setState({
        live: this.state.live.splice(this.state.live.indexOf(i), 1)
      })
    }
  },
  pause: function() {
    console.log("Running Pause!")
    this.setState({
      running: !this.state.running
    })
  },  
  lifeCheck: function(pix, living_neighbors) {
    if(this.state.live.indexOf(pix) < 0) {
      if(living_neighbors === 3) {
        return true
      }
    } else {
      if(living_neighbors == 2 || living_neighbors == 3) {
        return true
      }
    }
    return false
  },
  cycle: function() {
    if(this.state.running) {
      var live = []
      var nbs = []
      for(var i=0;i<this.state.live.length; i++) {
        pix = this.state.live[i]
        var neighbors = this.getNeighbors(pix, this.state.height, this.state.width)
        nbs = nbs.concat(neighbors)
        var living_neighbors = this.livingNeighbors(neighbors)
        if(this.lifeCheck(pix, living_neighbors)) {
          live.push(pix)
        }
      }
      count = {}
      for(var i=0;i<nbs.length;i++) {
        if(count[nbs[i]] === undefined) {
          count[nbs[i]] = 1
        } else {
          count[nbs[i]] += 1
        }
      }
      for(var num in count) {
        if(count[num] == 3 && live.indexOf(parseInt(num)) < 0) {
          live.push(parseInt(num))
        }
      }
      this.setState({
        live: live,
        generations: this.state.generations + 1
      })
    }
  },
  changeTempo: function(mult) {
    $('.speed-button').removeClass('selected')
    $('.speed-' + mult).addClass('selected')
    this.setState({tempo: 100 / mult})
  },
  changeGrid: function(x, y) {
    $('.size-button').removeClass('selected')
    $('.size-' + x).addClass('selected')
    this.setState({
      height: y,
      width: x,
      live: [],
      running: false
    })
  },
  randomize: function() {
    var live = []
    for(var i=0; i<(this.state.height * this.state.width); i++) {
      if(Math.floor(Math.random() * 2)) {
        live.push(i);
      }
    }
    this.setState({ 
      live: live
    })
  },
  clear: function() {
    this.setState({ 
      live: []
    })
  },
  render: function() {
    var grid = [];
    var height = this.state.height;
    var width = this.state.width;
    var gridSize = height * width;
    var cardCls = 'card height-' + height + ' width-' + width;
    var gridCls = 'dot-box height-' + height + ' width-' + width;
    var btnCls;
    if(this.state.running) {
      btnCls = "fa fa-pause";
    } else {
      btnCls = "fa fa-play";
    }
    for(var i=0; i<gridSize; i++) {
      cls = 'dot dot-' + i;
      if(this.state.live.indexOf(i) >= 0) {
        cls += ' live'
      }
      grid.push(element('div', {
        className: cls, 
        onClick: this.giveLife.bind(null, i)
      }))
    }
    var circleOfLife = setTimeout(this.cycle, this.state.tempo)
    return element('div', {className:'card-container'},
      element('h2', {className: 'card-title'}, 'Game of Life'),
      element('div', {className: cardCls}, 
      element('h6', {className: 'generation-count'}, this.state.generations),
        element('div', {className: 'left side buttons'},
          element('p', {}, 'Size'),
          element('button', {
            className:'size-button size-20 selected',
            onClick: this.changeGrid.bind(null, 20, 20)
          }, element('i', null, "SM")),
          element('button', {
            className:'size-button size-40',
            onClick: this.changeGrid.bind(null, 40, 30)
          }, element('i', null, "MD")),
          element('button', {
            className:'size-button size-50',
            onClick: this.changeGrid.bind(null, 50, 40)
          }, element('i', null, "LG"))),
        element('div', {className: gridCls}, grid),
        element('div', {className: 'right side buttons'},
          element('p', {}, 'Speed'),
          element('button', {
            className:'speed-button speed-1 selected',
            onClick: this.changeTempo.bind(null, 1)
          }, element('i', null, "1x")),
          element('button', {
            className:'speed-button speed-2',
            onClick: this.changeTempo.bind(null, 2)
          }, element('i', null, "2x")),
          element('button', {
            className:'speed-button speed-3',
            onClick: this.changeTempo.bind(null, 3)
          }, element('i', null, "3x")))
      ),
      element('div', {className: 'bottom buttons'},
        element('button', {
          className:'pause-button',
          onClick: this.pause
        }, element('i', {className: btnCls}),
        element('button', {
          className:'clear-button',
          onClick: this.clear
        }, element('i', null, "Clear")),
        element('button', {
          className:'random-button',
          onClick: this.randomize
        }, element('i', null, "Random")))
        
      )
    )
  }
})

React.render(element(Main), document.getElementById('root'))