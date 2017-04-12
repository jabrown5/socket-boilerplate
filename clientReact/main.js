var React    = require('react')
var ReactDOM = require('react-dom');
var io       = require('socket.io-client');
var socket   = io.connect();

var Container = React.createClass({
  render: function(){
    return (
      <h1> hi</h1>
      )
  }
})


ReactDOM.render(<Container />, document.getElementById('app'))

