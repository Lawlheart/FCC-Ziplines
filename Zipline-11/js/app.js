
var Input = React.createClass({
  render: function() {
    var component = this;
    //<textarea id="left-panel"></textarea>
    return React.createElement('textarea', {
      id: 'left-panel',
      onChange: function(e) {
        e.preventDefault()
        var contents = e.target.value;
        component.props.updateMarkdown(contents);
      }
    })
  }
})

var Main = React.createClass({
  getInitialState: function() {
    return {contents: "# Testing *mark*down\n#### What is there to test?\n****\n+ Everything\n+ Nothing\n* Whatever you want!\n----\n| Code        | None Code |\n-------------- | -------------   |\n| `*Hi*`        | *Hi*             |\n| `**Bye**`   | **Bye**        |\n| `~~Die~~` | ~~Die~~     |\n____\n```\nfunction hello_world() {\n    alert(\"**HELLO WORLD**!\");\n}\n```\n>Notice that the `**` don't do anything\n\n#### Have fun with this!\n*~[Herman Fassett](http://freecodecamp.com/hermanfassett)*"};
  },
  componentDidMount: function() {
    document.getElementById("left-panel").value = this.state.contents
    this.updateMarkdown(this.state.contents)
  },
  updateMarkdown: function(contents) {
    var target = React.findDOMNode(this.refs.markdown);
    this.setState({contents: contents}) 
    if(contents) {
      target.innerHTML = marked(contents);
    } else {
      target.innerHTML = contents;
    }
  },
  render: function() {
    // div > ((div#left-panel>Input) + (div#right-panel>Markdown))
    return  React.createElement('div', null, 
                React.createElement(Input, {
                  contents: this.state.contents,
                  updateMarkdown: this.updateMarkdown
                }),
              React.createElement('div', {id: 'right-panel'},
                React.createElement('div', {ref: 'markdown'})))
  }
})

React.render(React.createElement(Main), document.getElementById("root"));