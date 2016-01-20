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
HEIGHT = 20;
WIDTH = 20;
GRID_SIZE = HEIGHT * WIDTH;

function getNeighbors(index, height, width) {
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
}


Main = React.createClass({
  getInitialState: function() {
    return {
      live: [1,2,3],
      born: []
    }
  },
  cycle: function() {
    
  },
  render: function() {
    var grid = [];
    var gridCls = 'dot-box height-' + HEIGHT + ' width-' + WIDTH;
    for(var i=0; i<GRID_SIZE; i++) {
      cls = 'dot dot-' + i;
      if(this.state.live.indexOf(i) >= 0) {
        cls += ' live'
      }
      grid.push(element('div', {className: cls}))
    }
    return element('div', {className: 'card'}, 
      element('div', {className: gridCls}, grid)              
    )
  }
})

React.render(element(Main), document.getElementById('root'))