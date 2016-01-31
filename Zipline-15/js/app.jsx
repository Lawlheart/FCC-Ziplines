// coordinates: 40x60


var GameMap = React.createClass({
  getInitialState: function() {
    return {
      baddieFoot: 'left'
    }
  },
  componentDidMount: function() {
    setInterval(this.baddieWalk, 700);
  },
  baddieWalk: function() {
    var next;
    if(this.state.baddieFoot === 'left') {
      next = 'right';
    } else {
      next = 'left';
    }
    this.setState({
      baddieFoot: next
    })
  },
  render: function() {
    var x, y, classname, keyname, potionkey, potionclass, baddiekey, baddieclass
    var tiles = this.props.gridheight * this.props.gridwidth;
    var grid = [];
    for(var i=0;i<tiles;i++) {
      x = i % this.props.gridwidth;
      y = Math.floor(i / this.props.gridwidth);
      classname = "tile coords-x-" + x + " coords-y-" + y;
      keyname = "tile-" + i;
      grid.push(
        <div className={classname} key={keyname} />
      )
    }
    for(var i=0;i<this.props.potions.length;i++) {
      potionkey = "potion-" + i;
      potionclass = "gear potion x-" + this.props.potions[i][0] + " y-" + this.props.potions[i][1];
      grid.push(
        <div className={potionclass}
             key={potionkey}
             style={{ 
               left: this.props.pixels(this.props.potions[i][0]),
               top: this.props.pixels(this.props.potions[i][1])
             }} />
      );
    }
    for(var i=0;i<this.props.baddies.length;i++) {
      baddiekey = "baddie-" + i;
      baddieclass = "sprite baddie " + this.state.baddieFoot + " x-" + this.props.baddies[i][0] + " y-" + this.props.baddies[i][1];
      grid.push(
        <div className={baddieclass} 
             key={baddiekey}
             style={{ 
               left: this.props.pixels(this.props.baddies[i][0]),
               top: this.props.pixels(this.props.baddies[i][1])
             }} />
      );
    }
    return (
      <div className="map" style={this.props.mapStyle}>{grid}</div>
    )
  }
})

var Main = React.createClass({
  getInitialState: function() {
    return {
      sprite: 'redmage',
      direction: 'down',
      xp: 0,
      xpos: 3,
      ypos: 6,
      health: 80,
      maxhealth: 100,
      level: 1,
      weapon: 'staff',
      gridheight: 20,
      gridwidth: 30,
      viewheight: 15,
      viewwidth: 20,
      bgx: 0,
      bgy: 0,
      player: [3, 6],
      potions: this.randomLocations(5),
      baddies: this.randomLocations(5)
    }
  },
  randomLocations: function(num) {
    var locations = []
    for(var i=0;i<num;i++) {
      locations.push([Math.floor(Math.random()*30), 
        Math.floor(Math.random()*20)])
    }
    return locations;
  },
  componentDidMount: function() {
    $(document.body).on('keydown', this.moveSprite);
  },
  moveSprite: function(e) {
    e.preventDefault();
    var direction = this.state.direction;
    var sprite = this.state.sprite;
    var xpos = this.state.xpos;
    var ypos = this.state.ypos;
    var bgx = this.state.bgx;
    var bgy = this.state.bgy;
    if(e.keyCode === 40 && ypos < this.state.viewheight - 1) {
      direction = 'down';
      if(bgy < this.state.gridheight - this.state.viewheight && ypos > Math.floor(this.state.viewheight / 2)) {
        bgy += 1;
      } else {
        ypos += 1;
      }
    } else if(e.keyCode === 38 && ypos > 0) {
      direction = 'up';
      if(bgy > 0 && ypos < Math.floor(this.state.viewheight / 2)) {
        bgy -= 1;
      } else {
        ypos -= 1;
      }
    } else if(e.keyCode === 37 && xpos > 0) {
      direction = 'left';
      if(bgx > 0 && xpos < Math.floor(this.state.viewwidth / 2)) {
        bgx -= 1;
      } else {
        xpos -= 1;
      }
    } else if(e.keyCode === 39 && xpos < this.state.viewwidth - 1) {
      direction = 'right';
      if(bgx < this.state.gridwidth - this.state.viewwidth && xpos > Math.floor(this.state.viewwidth / 2)) {
        bgx += 1;
      } else {
        xpos += 1;
      }
    } else if(e.keyCode === 66) {
      sprite = 'blackmage';
    } else if(e.keyCode === 82) {
      sprite = 'redmage';
    }
    this.setState({
      direction: direction,
      sprite: sprite,
      xpos: xpos,
      ypos: ypos,
      bgx: bgx,
      bgy: bgy,
      player: [xpos + bgx, ypos + bgy]
    }, function() {
      this.resolveMove();
    })
  },
  resolveMove: function() {
    var player = this.state.player;
    var length = this.state.potions.length;
    var potions = this.state.potions.filter(function(coords) {
      return !(coords[0] === player[0] && coords[1] === player[1]);
    });
    var baddies = this.state.baddies.filter(function(coords) {
      return !(coords[0] === player[0] && coords[1] === player[1]);
    });
    if(potions.length < this.state.potions.length) {
      this.heal(20);
      this.setState({
        potions: potions
      });
    } else if(baddies.length < this.state.baddies.length) {
      console.log("encounter!");
      var fight = this.fight();
      if(fight) {
        this.setState({
          xp: this.state.xp + 20,
          baddies: baddies
        })
      }
    }
  },
  fight: function() {
    this.takeDamage(20);
    return true;
  },
  takeDamage: function(dmg) {
    var health = this.state.health;
    if(health - dmg <= 0) {
      health = 0;
    } else {
      health -= dmg;
    }
    this.setState({
      health: health
    })
  },
  heal: function(amt) {
    var health = this.state.health;
    if(health + amt >= this.state.maxhealth) {
      health = this.state.maxhealth;
    } else {
      health += amt;
    }
    this.setState({
      health: health
    })
  },
  pixels: function(coord) {
    return coord * 32;
  },

  render: function() {
    var heroclass = "sprite " + this.state.sprite + " " + this.state.direction
    var herostyle = {
      top: this.pixels(this.state.ypos),
      left: this.pixels(this.state.xpos)
    };
    var mapmargin = "-" + this.pixels(this.state.bgy) + "px 0 0 -" + this.pixels(this.state.bgx) + "px";
    var mapStyle = {
      height: this.pixels(this.state.gridheight),
      width: this.pixels(this.state.gridwidth),
      margin: mapmargin
    }
    var healthBarClass = "health-bar health-val-" + Math.floor(this.state.health * 100 / this.state.maxhealth);
    return (
      <div className="box">
        <GameMap gridheight={this.state.gridheight}
                 gridwidth={this.state.gridwidth}
                 mapStyle={mapStyle}
                 pixels={this.pixels}
                 bgx={this.state.bgx}
                 bgy={this.state.bgy}
                 potions={this.state.potions}
                 baddies={this.state.baddies}
                 grid={this.state.grid} />
        <h1 className="coords">coordinates: {this.state.player.join(", ")}</h1>
        <div className="health-bar-container">
          <div className={healthBarClass}></div>
        </div>
        <div className={heroclass} onKeyDown={this.moveSprite} style={herostyle}></div>
      </div>
    )
  }
});

React.render(<Main />, document.getElementById('root'))