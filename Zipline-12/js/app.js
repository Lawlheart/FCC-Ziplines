var Main = React.createClass({
  getInitialState: function() {
    return {
      camperdata: [],
      recentdata: [],
      active: "recent",
      button: "Show All Time",
      alltimedata: []
    }
  },
  toggleData: function() {
    if(this.state.active === "recent") {
      this.setState({
        camperdata: this.state.alltimedata,
        active: "alltime",
        button: "Show Recent"
      });
    } else {
      this.setState({
        camperdata: this.state.recentdata,
        active: "recent",
        button: "Show All Time"
      });
    }
  },
  componentDidMount: function() {
    var component = this;
     $.get('http://fcctop100.herokuapp.com/api/fccusers/top/recent', function(data) {
      component.setState({recentdata: data});
      component.setState({camperdata: data});
    })
     $.get('http://fcctop100.herokuapp.com/api/fccusers/top/alltime', function(data) {
      component.setState({alltimedata: data});
    })
  },
  render: function()  {
    var campers = this.state.camperdata.map(function(camper, index) {
      return React.createElement('div', {className: 'tile'},
                React.createElement('h3', {className: 'rank'}, index + 1),
                React.createElement('img', {className: 'avatar', src: camper.img}),
                React.createElement('h3', {className: 'username'}, camper.username), 
                React.createElement('div', {className: 'points-container'},
                  React.createElement('h3', {className: 'points alltime'}, 
                    React.createElement('span', {className: 'title'}, "All Time "), 
                    React.createElement('span', {className: 'pt-value'}, camper.alltime),
                  React.createElement('h3', {className: 'points recent'}, 
                    React.createElement('span', {className: 'title'}, "Recent "), 
                    React.createElement('span', {className: 'pt-value'}, camper.recent))
                ))
      );
    })
    return React.createElement('div', {className: 'leaderboard'},
             React.createElement('div', {className: 'key'}, 
               React.createElement('h3', {className:'rank'}, "Rank"), 
               React.createElement('h3', {className: 'camper'}, "Camper"),
               React.createElement('button', {
                 className: 'toggle',
                 onClick: this.toggleData
                }, this.state.button)
              ),campers)
  }
})

React.render(React.createElement(Main, null), document.getElementById("root"));