'use strict';

var GameMap = React.createClass({
  displayName: 'GameMap',

  getInitialState: function getInitialState() {
    return {
      baddieFoot: 'left'
    };
  },
  componentDidMount: function componentDidMount() {
    this.theWalk = setInterval(this.baddieWalk, 1000);
    this.replaceState(this.getInitialState());
  },
  componentWillUnmount: function componentWillUnmount() {
    clearInterval(this.theWalk);
  },
  baddieWalk: function baddieWalk() {
    var next, nextfoot;
    if (this.state.baddieFoot === 'left') {
      nextfoot = 'right';
    } else {
      nextfoot = 'left';
    }
    var baddies = this.props.baddies;
    for (var i = 0; i < baddies.length; i++) {
      var random = this.props.random(1, 4);
      var x = baddies[i][0];
      var y = baddies[i][1];
      if (random === 1) {
        next = [x + 1, y];
      } else if (random === 2) {
        next = [x - 1, y];
      } else if (random === 3) {
        next = [x, y + 1];
      } else if (random === 4) {
        next = [x, y - 1];
      }
      if (next[0] === this.props.player[0] && next[1] === this.props.player[1]) {
        if (!this.props.fight(i)) {
          return;
        }
      } else if (this.props.validMove(next[0], next[1])) {
        baddies[i] = next;
      }
    }
    this.setState({
      baddieFoot: nextfoot,
      baddies: baddies
    });
  },
  fogCheck: function fogCheck(x, y) {
    return Math.abs(this.props.player[0] - x) + Math.abs(this.props.player[1] - y) > 5 || Math.abs(this.props.player[0] - x) > 4 || Math.abs(this.props.player[1] - y) > 4;
  },
  render: function render() {
    var x, y, classname, keyname, potionkey, potionclass, baddiekey, baddieclass, weaponkey, weaponclass;
    var tiles = this.props.gridheight * this.props.gridwidth;
    var grid = [];
    for (var i = 0; i < tiles; i++) {
      x = i % this.props.gridwidth;
      y = Math.floor(i / this.props.gridwidth);
      if (this.props.map.length > 0 && this.props.map[y][x] == 0) {
        classname = "tile wall coords-x-" + x + " coords-y-" + y;
      } else {
        classname = "tile coords-x-" + x + " coords-y-" + y;
      }
      if (this.fogCheck(x, y)) {
        classname += " fog";
      }
      keyname = "tile-" + i;
      grid.push(React.createElement('div', { className: classname, key: keyname }));
    }
    for (var i = 0; i < this.props.potions.length; i++) {
      potionkey = "potion-" + i;
      potionclass = "gear potion x-" + this.props.potions[i][0] + " y-" + this.props.potions[i][1];
      if (this.fogCheck(this.props.potions[i][0], this.props.potions[i][1])) {
        potionclass += " fog";
      }
      grid.push(React.createElement('div', { className: potionclass,
        key: potionkey,
        style: {
          left: this.props.pixels(this.props.potions[i][0]),
          top: this.props.pixels(this.props.potions[i][1])
        } }));
    }
    for (var i = 0; i < this.props.baddies.length; i++) {
      baddiekey = "baddie-" + i;
      baddieclass = "sprite baddie " + this.props.baddieset[i].color + " " + this.state.baddieFoot + " x-";
      baddieclass += this.props.baddies[i][0] + " y-" + this.props.baddies[i][1];
      if (this.fogCheck(this.props.baddies[i][0], this.props.baddies[i][1])) {
        baddieclass += " fog";
      }
      grid.push(React.createElement('div', { className: baddieclass,
        key: baddiekey,
        style: {
          left: this.props.pixels(this.props.baddies[i][0]),
          top: this.props.pixels(this.props.baddies[i][1])
        } }));
    }
    for (var i = 0; i < this.props.weapons.length; i++) {
      weaponkey = "weapon-" + i;
      weaponclass = "gear " + this.props.weaponset[i] + " x-" + this.props.weapons[i][0] + " y-" + this.props.weapons[i][1];
      if (this.fogCheck(this.props.weapons[i][0], this.props.weapons[i][1])) {
        weaponclass += " fog";
      }
      grid.push(React.createElement('div', { className: weaponclass,
        key: weaponkey,
        style: {
          left: this.props.pixels(this.props.weapons[i][0]),
          top: this.props.pixels(this.props.weapons[i][1])
        } }));
    }
    if (this.props.boss.length > 0) {
      var boss = this.props.boss[0];
      var bossclass;
      if (this.fogCheck(boss[0], boss[1])) {
        bossclass = "sprite boss fog";
      } else {
        bossclass = "sprite boss";
      }
      grid.push(React.createElement('div', { className: bossclass, key: 'boss', style: {
          left: this.props.pixels(boss[0]),
          top: this.props.pixels(boss[1])
        } }));
    }
    return React.createElement(
      'div',
      { className: 'map', style: this.props.mapStyle, key: this.props.playing },
      grid
    );
  }
});

var Main = React.createClass({
  displayName: 'Main',

  getInitialState: function getInitialState() {
    return {
      //player info
      sprite: 'redmage',
      direction: 'down',
      xp: 0,
      health: 100,
      maxhealth: 100,
      level: 1,
      weapon: 'unarmed',

      //display info
      player: [3, 6], //game player coords
      xpos: 3, //player view position
      ypos: 6, //player view position
      gridheight: 30,
      gridwidth: 40,
      viewheight: 15,
      viewwidth: 20,
      bgx: 0, // view offset
      bgy: 0, // view offset
      hitmessage: "",
      hurtmessage: "",
      healmessage: "",
      xpmessage: "",
      messageCount: 0,

      //random generation info
      map: [],
      coords: [],
      runs: 500,
      minRoomSize: 2,
      maxRoomSize: 6,
      potions: [],
      baddieset: [],
      baddies: [],
      weaponset: ['dagger', 'staff', 'sword', 'maul'],
      weapons: [],
      boss: [],
      bossData: {
        hp: 200,
        mindmg: 5,
        maxdmg: 60,
        level: 9001
      },
      playing: true,
      win: false
    };
  },
  componentDidMount: function componentDidMount() {
    $(document.body).on('keyup', this.moveSprite);
    this.initialize();
  },
  resetGame: function resetGame() {
    this.replaceState(this.getInitialState(), function () {
      this.initialize();
    });
  },
  initialize: function initialize() {
    var rooms = this.placeRooms();
    var coords = this.getAllCoords(rooms);
    var coords = this.carveHalls(rooms, coords);
    var map = this.getMap(coords);
    var player = this.randomPlayerStart(coords);
    var invalids = [player];
    var potions = this.randomLocations(5, coords, invalids);
    invalids = invalids.concat(potions);
    var baddies = this.randomLocations(30, coords, invalids);
    invalids = invalids.concat(baddies);
    var weapons = this.randomLocations(4, coords, invalids);
    invalids = invalids.concat(weapons);
    var boss = this.randomLocations(1, coords, invalids);
    var baddieset = this.getBaddieSet(baddies.length);
    this.setState({
      map: map,
      coords: coords,
      player: player,
      potions: potions,
      baddies: baddies,
      baddieset: baddieset,
      weapons: weapons,
      boss: boss
    });
  },
  getBaddieSet: function getBaddieSet(num) {
    var hp, color;
    var baddieset = [];
    var colors = ['blue', 'red', 'gold'];
    for (var i = 0; i < num; i++) {
      var roll = this.random(1, 3);
      baddieset.push({
        hp: this.random(5 * roll, 15 * roll),
        color: colors[roll - 1],
        mindmg: 5,
        maxdmg: 10 * roll + 10,
        level: roll
      });
    }
    return baddieset;
  },
  random: function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  randomPlayerStart: function randomPlayerStart(coords) {
    var player = coords[this.random(0, coords.length - 1)];
    var xpos, ypos, bgx, bgy;
    if (player[0] < this.state.viewwidth / 2) {
      bgx = 0;
      xpos = player[0];
    } else if (player[0] > this.state.gridwidth - this.state.viewwidth / 2) {
      bgx = this.state.gridwidth - this.state.viewwidth;
      xpos = player[0] - bgx;
    } else {
      xpos = Math.round(this.state.viewwidth / 2);
      bgx = player[0] - xpos;
    }
    if (player[1] < this.state.viewheight / 2) {
      bgy = 0;
      ypos = player[1];
    } else if (player[1] > this.state.gridheight - this.state.viewheight / 2) {
      bgy = this.state.gridheight - this.state.viewheight;
      ypos = player[1] - bgy;
    } else {
      ypos = Math.round(this.state.viewheight / 2);
      bgy = player[1] - ypos;
    }
    this.setState({
      bgx: bgx,
      bgy: bgy,
      xpos: xpos,
      ypos: ypos
    });
    return player;
  },
  printMap: function printMap(map) {
    for (var i = 0; i < map.length; i++) {
      console.log(map[i].join(" ").replace(/0/g, "-").replace(/1/g, "X"));
    }
  },
  coordIndex: function coordIndex(coords, position) {
    for (var i = 0; i < coords.length; i++) {
      if (coords[i][0] == position[0] && coords[i][1] == position[1]) {
        return i;
      }
    }
    return -1;
  },
  Room: function Room(x, y, w, h) {
    this.x1 = x;
    this.x2 = x + w;
    this.y1 = y;
    this.y2 = y + h;
    this.w = w;
    this.h = h;
    this.center = [Math.floor((this.x1 + this.x2) / 2), Math.floor((this.y1 + this.y2) / 2)];

    this.intersects = function (room) {
      return this.x1 - 1 <= room.x2 && this.x2 + 1 >= room.x1 && this.y1 - 1 <= room.y2 && this.y2 + 1 >= room.y1;
    };
  },
  placeRooms: function placeRooms() {
    var rooms = [];
    var map = [];
    for (var i = 0; i < this.state.runs; i++) {
      var w = this.random(this.state.minRoomSize, this.state.maxRoomSize);
      var h = this.random(this.state.minRoomSize, this.state.maxRoomSize);
      var x = this.random(1, this.state.gridwidth - w - 2);
      var y = this.random(1, this.state.gridheight - h - 2);

      var newRoom = new this.Room(x, y, w, h);

      var failed = false;
      for (var j = 0; j < rooms.length; j++) {
        if (newRoom.intersects(rooms[j])) {
          failed = true;
          break;
        }
      }
      if (!failed) {
        rooms.push(newRoom);
      }
    }
    return rooms;
  },
  getAllCoords: function getAllCoords(rooms) {
    var coords = [];
    for (var k = 0; k < rooms.length; k++) {
      var room = rooms[k];
      for (var i = room.x1; i <= room.x2; i++) {
        for (var j = room.y1; j <= room.y2; j++) {
          coords.push([i, j]);
        }
      }
    }
    return coords;
  },
  hCorridors: function hCorridors(x1, x2, y, coords) {
    for (var j = Math.min(x1, x2); j <= Math.max(x1, x2); j++) {
      if (this.coordIndex(coords, [j, y]) < 0) {
        coords.push([j, y]);
      }
    }
    return coords;
  },
  vCorridors: function vCorridors(y1, y2, x, coords) {
    for (var j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) {
      if (this.coordIndex(coords, [x, j]) < 0) {
        coords.push([x, j]);
      }
    }
    return coords;
  },
  carveHalls: function carveHalls(rooms, coords) {
    for (var i = 1; i < rooms.length; i++) {
      var x1 = rooms[i - 1].center[0];
      var x2 = rooms[i].center[0];
      var y1 = rooms[i - 1].center[1];
      var y2 = rooms[i].center[1];
      coords = this.hCorridors(x1, x2, y1, coords);
      coords = this.vCorridors(y1, y2, x2, coords);
    }
    return coords;
  },
  getMap: function getMap(coords) {
    var coords = coords.slice();
    var map = [];
    for (var i = 0; i < this.state.gridheight; i++) {
      var row = [];
      for (var j = 0; j < this.state.gridwidth; j++) {
        var index = this.coordIndex(coords, [j, i]);
        if (index >= 0) {
          coords.splice(index, 1);
          row.push("1");
        } else {
          row.push("0");
        }
      }
      map.push(row);
    }
    return map;
  },
  randomLocations: function randomLocations(num, coords, invalids) {
    var locations = [];
    while (locations.length < num) {
      var location = coords[this.random(0, coords.length - 1)];
      var valid = true;
      for (var i = 0; i < invalids.length; i++) {
        if (location[0] == invalids[i][0] && location[1] == invalids[i][1]) {
          valid = false;
        }
      }
      if (valid) {
        locations.push(location);
        invalids.push(location);
      }
    }
    return locations;
  },
  // chose 1x1 boss for now, so unused. had problem with boss clipping through walls
  bossLocation: function bossLocation(coords, invalids) {
    var boss = [];
    while (boss.length === 0) {
      var location = coords[this.random(0, coords.length - 1)];
      var valid = true;
      var adjacent = [];
      console.log("loop start");
      for (var i = 0; i < 2; i++) {
        for (var j = 0; j < 3; j++) {
          adjacent.push([location[0] + i, location[1] + j]);
          console.log(this.coordIndex(coords, [location[0] + i, location[1] + j]));
          if (this.coordIndex(coords, [location[0] + i, location[1] + j]) < 0) {
            valid = false;
          }
        }
      }
      if (!valid) {
        continue;
      }
      for (var i = 0; i < invalids.length; i++) {
        for (var j = 0; j < adjacent.length; j++) {
          if (adjacent[j][0] == invalids[i][0] && adjacent[j][1] == invalids[i][1]) {
            valid = false;
          }
        }
      }
      if (valid) {
        boss = adjacent;
      }
    }
    return boss;
  },
  validMove: function validMove(x, y) {
    var onmap = x > 0 && x < this.state.gridwidth && y > 0 && y < this.state.gridheight;
    var notWall = this.coordIndex(this.state.coords, [x, y]) >= 0;
    return onmap && notWall;
  },
  moveSprite: function moveSprite(e) {
    if (this.state.health === 0) {
      return;
    }
    e.preventDefault();
    var direction = this.state.direction;
    var sprite = this.state.sprite;
    var xpos = this.state.xpos;
    var ypos = this.state.ypos;
    var bgx = this.state.bgx;
    var bgy = this.state.bgy;
    if (e.keyCode === 40) {
      direction = 'down';
      if (this.validMove(this.state.player[0], this.state.player[1] + 1)) {
        if (bgy < this.state.gridheight - this.state.viewheight && ypos > Math.floor(this.state.viewheight / 2)) {
          bgy += 1;
        } else {
          ypos += 1;
        }
      }
    } else if (e.keyCode === 38) {
      direction = 'up';
      if (this.validMove(this.state.player[0], this.state.player[1] - 1)) {
        if (bgy > 0 && ypos < Math.floor(this.state.viewheight / 2)) {
          bgy -= 1;
        } else {
          ypos -= 1;
        }
      }
    } else if (e.keyCode === 37) {
      direction = 'left';
      if (this.validMove(this.state.player[0] - 1, this.state.player[1])) {
        if (bgx > 0 && xpos < Math.floor(this.state.viewwidth / 2)) {
          bgx -= 1;
        } else {
          xpos -= 1;
        }
      }
    } else if (e.keyCode === 39) {
      direction = 'right';
      if (this.validMove(this.state.player[0] + 1, this.state.player[1])) {
        if (bgx < this.state.gridwidth - this.state.viewwidth && xpos > Math.floor(this.state.viewwidth / 2)) {
          bgx += 1;
        } else {
          xpos += 1;
        }
      }
    } else if (e.keyCode === 66) {
      sprite = 'blackmage';
    } else if (e.keyCode === 82) {
      sprite = 'redmage';
    }
    if (this.resolveMove([xpos + bgx, ypos + bgy])) {
      this.setState({
        direction: direction,
        sprite: sprite,
        xpos: xpos,
        ypos: ypos,
        bgx: bgx,
        bgy: bgy,
        player: [xpos + bgx, ypos + bgy]
      });
    }
  },
  resolveMove: function resolveMove(player) {
    var length = this.state.potions.length;
    var weapon = this.state.weapon;
    var weapons = this.state.weapons;
    var weaponset = this.state.weaponset;
    var baddieset = this.state.baddieset;
    var baddieIndex;
    var potions = this.state.potions.filter(function (coords) {
      return !(coords[0] === player[0] && coords[1] === player[1]);
    });
    var baddies = this.state.baddies.filter(function (coords, index) {
      if (coords[0] === player[0] && coords[1] === player[1]) {
        baddieIndex = index;
      }
      return !(coords[0] === player[0] && coords[1] === player[1]);
    });
    var weapons = this.state.weapons.filter(function (coords, index) {
      if (coords[0] === player[0] && coords[1] === player[1]) {
        weapon = weaponset[index];
        weaponset = weaponset.splice(index, 1);
      }
      return !(coords[0] === player[0] && coords[1] === player[1]);
    });
    if (player[0] === this.state.boss[0][0] && player[1] === this.state.boss[0][1]) {
      if (!this.fightBoss()) {
        return false;
      }
    }
    if (potions.length < this.state.potions.length) {
      this.heal(100);
      this.setState({
        potions: potions
      });
    } else if (weapons.length < this.state.weapons.length) {
      this.setState({
        weapons: weapons,
        weapon: weapon
      });
    } else if (baddies.length < this.state.baddies.length) {
      if (!this.fight(baddieIndex, baddies)) {
        return false;
      }
    }
    return true;
  },
  playerDamage: function playerDamage() {
    var weapon = this.state.weapon;
    var level = this.state.level;
    var damage = 5 * level;
    if (weapon === 'unarmed') {
      damage += this.random(2, 4);
    } else if (weapon === 'dagger') {
      damage += this.random(2, 8);
    } else if (weapon === 'sword') {
      damage += this.random(2, 16);
    } else if (weapon === 'maul') {
      damage += this.random(4, 24);
    }
    this.flashMessage("* " + damage, 'hit');
    return damage;
  },
  fight: function fight(baddieIndex) {
    var baddieset = this.state.baddieset;
    var baddies = this.state.baddies;
    var baddie = baddieset[baddieIndex];
    var lives = this.takeDamage(this.random(baddie.mindmg, baddie.maxdmg));
    if (lives) {
      var damage = this.playerDamage();
      if (damage >= baddie.hp) {
        baddieset.splice(baddieIndex, 1);
        baddies.splice(baddieIndex, 1);
        this.flashMessage("+ " + 10 * baddie.level, 'xp');
        this.checkForLevelUp(this.state.xp + 10 * baddie.level);
        this.setState({
          xp: this.state.xp + 10 * baddie.level,
          baddies: baddies,
          baddieset: baddieset
        });
        return true;
      } else {
        baddie.hp -= damage;
        this.setState({
          baddieset: baddieset
        });
        return false;
      }
    }
  },
  fightBoss: function fightBoss() {
    var bossData = this.state.bossData;
    var lives = this.takeDamage(this.random(bossData.mindmg, bossData.maxdmg));
    if (lives) {
      var damage = this.playerDamage();
      if (damage >= bossData.hp) {
        this.setState({
          playing: false,
          win: true
        });
      } else {
        bossData.hp -= damage;
        this.setState({
          bossData: bossData
        });
      }
    }
    return false;
  },
  checkForLevelUp: function checkForLevelUp(xp) {
    var level = this.state.level;
    level = Math.floor(xp / 40) + 1;
    if (level !== this.state.level) {
      this.flashMessage('Level up!', 'xp');
      this.levelUp();
    }
  },
  levelUp: function levelUp() {
    this.setState({
      maxhealth: 80 + 20 * this.state.level,
      health: this.state.health += 20,
      level: this.state.level += 1
    });
  },
  takeDamage: function takeDamage(dmg) {
    var health = this.state.health;
    var state = this.state.playing;
    if (health - dmg <= 0) {
      health = 0;
      state = false;
    } else {
      health -= dmg;
    }
    this.setState({
      health: health,
      playing: state,
      win: false
    });
    if (state === 'gameover') {
      return false;
    } else {
      this.flashMessage("- " + dmg, 'hurt');
      return true;
    }
  },
  heal: function heal(amt) {
    var health = this.state.health;
    if (health + amt >= this.state.maxhealth) {
      health = this.state.maxhealth;
    } else {
      health += amt;
    }
    this.flashMessage("- " + amt, 'heal');
    this.setState({
      health: health
    });
  },
  pixels: function pixels(coord) {
    return coord * 32;
  },
  flashMessage: function flashMessage(message, type) {
    var hitmessage = this.state.hitmessage;
    var hurtmessage = this.state.hurtmessage;
    var healmessage = this.state.healmessage;
    var xpmessage = this.state.xpmessage;
    var count = this.state.messageCount;
    var component = this;

    if (type === 'hit') {
      hitmessage = message;
    } else if (type === 'hurt') {
      hurtmessage = message;
    } else if (type === 'heal') {
      healmessage = message;
    } else if (type === 'xp') {
      xpmessage = message;
    }
    this.setState({
      hitmessage: hitmessage,
      hurtmessage: hurtmessage,
      healmessage: healmessage,
      xpmessage: xpmessage,
      messageCount: count += 1
    }, function () {
      setTimeout(function () {
        if (component.state.messageCount === count) {
          component.setState({
            hitmessage: "",
            hurtmessage: "",
            healmessage: "",
            xpmessage: ""
          });
        }
      }, 600);
    });
  },
  render: function render() {
    var heroclass = "sprite player " + this.state.sprite + " " + this.state.direction;
    var herostyle = {
      top: this.pixels(this.state.ypos),
      left: this.pixels(this.state.xpos)
    };
    var mapmargin = "-" + this.pixels(this.state.bgy) + "px 0 0 -" + this.pixels(this.state.bgx) + "px";
    var mapStyle = {
      height: this.pixels(this.state.gridheight),
      width: this.pixels(this.state.gridwidth),
      margin: mapmargin
    };
    var weaponclass = "player-weapon gear " + this.state.weapon;
    var healthBarClass = "health-bar health-val-" + Math.floor(this.state.health * 100 / this.state.maxhealth);

    var ui = React.createElement(
      'div',
      { className: 'user-interface' },
      React.createElement(
        'div',
        { className: 'player-stats' },
        React.createElement(
          'h3',
          { className: 'player-level' },
          'Level ',
          this.state.level
        ),
        React.createElement(
          'h4',
          { className: 'player-xp' },
          'XP: ',
          this.state.xp
        ),
        React.createElement(
          'h4',
          { className: 'weapon-label' },
          'Weapon'
        ),
        React.createElement('div', { className: weaponclass })
      ),
      React.createElement(
        'h1',
        { className: 'coords' },
        'coordinates: ',
        this.state.player.join(", ")
      ),
      React.createElement(
        'div',
        { className: 'health-bar-container' },
        React.createElement('div', { className: healthBarClass })
      )
    );
    var display;
    if (this.state.health === 0) {
      display = React.createElement(
        'div',
        { className: 'box game-over', style: {
            width: this.pixels(this.state.viewwidth),
            height: this.pixels(this.state.viewheight)
          } },
        React.createElement(
          'h1',
          { style: { color: 'white' } },
          'GAME OVER'
        ),
        React.createElement(
          'button',
          { className: 'play-again', onClick: this.resetGame },
          'Play Again?'
        )
      );
    } else if (this.state.win) {
      display = React.createElement(
        'div',
        { className: 'box game-win', style: {
            width: this.pixels(this.state.viewwidth),
            height: this.pixels(this.state.viewheight)
          } },
        React.createElement(
          'h1',
          { style: { color: 'white' } },
          'YOU WIN!'
        ),
        React.createElement(
          'button',
          { className: 'play-again', onClick: this.resetGame },
          'Play Again?'
        )
      );
    } else {
      display = React.createElement(
        'div',
        { className: 'box', style: {
            width: this.pixels(this.state.viewwidth),
            height: this.pixels(this.state.viewheight)
          } },
        React.createElement(GameMap, { gridheight: this.state.gridheight,
          gridwidth: this.state.gridwidth,
          playing: this.state.playing,
          mapStyle: mapStyle,
          pixels: this.pixels,
          bgx: this.state.bgx,
          bgy: this.state.bgy,
          map: this.state.map,
          playerhealth: this.state.health,
          player: this.state.player,
          coords: this.state.coords,
          potions: this.state.potions,
          baddies: this.state.baddies,
          baddieset: this.state.baddieset,
          weapons: this.state.weapons,
          weaponset: this.state.weaponset,
          boss: this.state.boss,
          random: this.random,
          fight: this.fight,
          validMove: this.validMove,
          grid: this.state.grid }),
        React.createElement(
          'div',
          { className: heroclass, onKeyDown: this.moveSprite, style: herostyle },
          React.createElement(
            'div',
            { className: 'floating-text' },
            React.createElement(
              'div',
              { className: 'hit' },
              this.state.hitmessage
            ),
            React.createElement(
              'div',
              { className: 'hurt' },
              this.state.hurtmessage
            ),
            React.createElement(
              'div',
              { className: 'heal' },
              this.state.healmessage
            ),
            React.createElement(
              'div',
              { className: 'xp' },
              this.state.xpmessage
            )
          )
        )
      );
    }
    return React.createElement(
      'div',
      { className: 'game-view', key: this.state.playing },
      React.createElement(
        'div',
        { className: 'sidebar' },
        React.createElement(
          'div',
          { className: 'baddies-box clearfix' },
          React.createElement(
            'h2',
            null,
            'Baddies'
          ),
          React.createElement(
            'h4',
            null,
            'Easy'
          ),
          React.createElement('div', { className: 'sprite baddie blue info right' }),
          React.createElement(
            'h4',
            null,
            'Hard'
          ),
          React.createElement('div', { className: 'sprite baddie red info right' }),
          React.createElement(
            'h4',
            null,
            'Deadly'
          ),
          React.createElement('div', { className: 'sprite baddie gold info right' }),
          React.createElement(
            'h4',
            null,
            'Boss'
          ),
          React.createElement('div', { className: 'sprite boss info' })
        ),
        React.createElement(
          'div',
          { className: 'weapons-box clearfix' },
          React.createElement(
            'h2',
            null,
            'Weapons'
          ),
          React.createElement(
            'h4',
            null,
            'Weakest'
          ),
          React.createElement('div', { className: 'gear dagger info' }),
          React.createElement(
            'h4',
            null,
            'Weak'
          ),
          React.createElement('div', { className: 'gear staff info' }),
          React.createElement(
            'h4',
            null,
            'Strong'
          ),
          React.createElement('div', { className: 'gear sword info' }),
          React.createElement(
            'h4',
            null,
            'Strongest'
          ),
          React.createElement('div', { className: 'gear maul info' })
        ),
        React.createElement(
          'div',
          { className: 'potions-box' },
          React.createElement(
            'h2',
            null,
            'Potions'
          ),
          React.createElement(
            'h4',
            null,
            this.state.potions.length,
            ' on map'
          ),
          React.createElement('div', { className: 'gear potion info' })
        )
      ),
      ui,
      display
    );
  }
});

React.render(React.createElement(Main, null), document.getElementById('root'));