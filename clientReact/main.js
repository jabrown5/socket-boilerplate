var React    = require('react')
var ReactDOM = require('react-dom');
var io       = require('socket.io-client');
var socket   = io.connect();

var Container = React.createClass({
  getInitialState: function(){
    return {logged: false}
  },
  handleLogin: function(logged){
    var state = this.state;
    state.logged = logged;
    this.setState(state)
  },
  render: function(){
    return (
      <div className="container">
        {this.state.logged ? <ChatRoom /> : <Username logged={this.handleLogin}/>}
      </div>
      )
  }
})

var ChatRoom = React.createClass({
  getInitialState: function(){
    return {usernames: [], messages: [], rooms: [], roomName: 'MainRoom'}
  },
  componentDidMount: function(){
    var state = this.state;
    var self = this;
    socket.on('users', function(usernames, roomName){

      state.roomName = roomName || "MainRoom"
      // wrote all this code expecting an array of usernames
      state.usernames = usernames;
      self.setState(state)
    })

    socket.on('all messages', function(messages){
      state.messages = messages;
      self.setState(state)
    })

    socket.on('rooms', function(rooms){
      state.rooms = rooms;
      self.setState(state)
    })

  },
  render: function(){
    return (
      <div className="row">
        <Users usernames={this.state.usernames}/>
        <ChatBoard messages={this.state.messages} roomName={this.state.roomName}/>
        <ChatRooms rooms={this.state.rooms}/>
      </div>
      )
  }
})

var Users = React.createClass({
  render: function(){
    console.log(this.props.usernames)
    var users = this.props.usernames.map(function(user, i){
      return <li key={i}>{user}</li>
    })


    return (
      <div className="three columns">
        <h3>Users</h3>
        <ul>
          {users}
        </ul>
      </div>
      )
  }
})

var ChatRooms = React.createClass({
  joinRoom: function(e){

    socket.emit('join room', e.target.innerText)
  },
  render: function(){
    var self = this
    var rooms = this.props.rooms.map(function(room, i){
      return <li key={i} onClick={self.joinRoom}>{room.room}</li>
    })

    return (
      <div className="three columns">
        <h3>Rooms</h3>
        <ul>
          {rooms}
        </ul>
      </div>
      )
  }
})

var ChatBoard = React.createClass({
  getInitialState: function(){
    return {messageValue: ''}
  },
  handleSubmit: function(e){
    e.preventDefault();
    socket.emit('message', this.state.messageValue)
    var state = this.state;
    state.messageValue = '';
    this.setState(state)
  },
  handleMessageChange: function(event){
    var state = this.state;
    state.messageValue = event.target.value;
    this.setState(state)
  },
  render: function(){
    console.log(this.props.messages)
    var messages = this.props.messages.map(function(message, i){
      return <li key={i}>{message.username}: {message.message}</li>
    })


    return (
      <div className="six columns">
        <h3>Welcome to {this.props.roomName}</h3>
        <ul>
          {messages}
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.messageValue} onChange={this.handleMessageChange} />
        </form>
      </div>
      )
  }
})



var Username = React.createClass({
  getInitialState: function(){
    return {username: ''}
  },
  handleSubmit: function(e){
    e.preventDefault();

    socket.emit('addUser', this.state.username)

    this.props.logged(true)
  },
  handleNameChange: function(event){
    var state = this.state;
    state.username = event.target.value;
    this.setState(state)
  },
  render: function(){
    return (
      <div className="row">
        <div className="twelve columns">
          <form onSubmit={this.handleSubmit}>
            <input type="text" placeholder="username" onChange={this.handleNameChange} value={this.state.username}/>
          </form>
        </div>
      </div>
      )
  }
})




ReactDOM.render(<Container />, document.getElementById('app'))