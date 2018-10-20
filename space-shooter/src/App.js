import React, { Component } from 'react';
import './App.css';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            enemies: [],
            y: {},
            x: {}
        }
    }
    componentDidMount() {
        let enemies = []
        // Begin Problem 6
        this.setState({enemies: enemies})
    }
    updateY = (y, index) => {
        let yCopy = Object.assign({}, this.state.y);
        yCopy[index] = y
        this.setState({y: yCopy})
    }
    updateX = (x, index) => {
        let xCopy = Object.assign({}, this.state.x);
        xCopy[index] = x
        this.setState({x: xCopy})
    }
    getY = () => {
        return this.state.y
    }
    getX = () => {
        return this.state.x
    }
  render() {
    return (
      <div className="App">
          {this.state.enemies.map((enemy => {
              return(<div>{enemy}</div>);
          }))}
          <Ship image = "./ship.png" updateY={this.updateY} updateX = {this.updateX}/>
      </div>
    );
  }
}

class Enemy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            direction: true,
        }
    }
    deleteSelf = () => {
        this.setState({x: 5000, y: 5000})
    }
    componentDidMount() {
        this.setState({x: this.props.x, y: this.props.y})
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 10);
        if (Math.random() > 0.5) {
            this.setState({direction: true})
        } else {
            this.setState({direction: false})
        }
    }
    componentDidUpdate() {
        for (let key in this.props.getX()) {
            if (this.props.getY()[key] >= (this.state.y-20) && this.props.getY()[key] <= (this.state.y+20) && this.props.getX()[key] >= (this.state.x-20) && this.props.getX()[key] <= (this.state.x+80)) {
                this.deleteSelf()
            }
        }
    }
    render() {
        // Begin Problem 7
        return (
            <div>
                <img style={{position: "absolute", left: this.state.x, bottom: this.state.y}} src={this.props.image} />
            </div>
        );
    }
}

class Ship extends React.Component {
    constructor(props){
        super(props);
        this.arrowFunction = this.arrowFunction.bind(this);
        this.arrowUpFunction = this.arrowUpFunction.bind(this);
        this.state = {
            x: window.innerWidth/2 - 50,
            y: 0,
            movingUp: false,
            movingLeft: false,
            movingRight: false,
            movingDown: false,
            shooting: false,
            projectiles: {},
            index: 0
        }
    }
    arrowFunction(event){
        if(event.keyCode === 37) { //left arrow
            this.setState({movingLeft: true})
        }
        if(event.keyCode === 38) { //up arrow
            this.setState({movingUp: true})
        }
        if(event.keyCode === 39) { //right arrow
            this.setState({movingRight: true})
        }
        if(event.keyCode === 40) { //down arrow
            this.setState({movingDown: true})
        }
        if(event.keyCode === 32) { //space bar
            this.setState({shooting: true})
        }
    }
    arrowUpFunction(event) {
        if(event.keyCode === 37) { //left arrow
            this.setState({movingLeft: false})
        }
        if(event.keyCode === 38) { //up arrow
            this.setState({movingUp: false})
        }
        if(event.keyCode === 39) { //right arrow
            this.setState({movingRight: false})
        }
        if(event.keyCode === 40) { //down arrow
            this.setState({movingDown: false})
        }
        if(event.keyCode === 32) {  //space bar
            this.setState({shooting: false})
        }
    }
    componentDidMount(){
        document.addEventListener("keydown", this.arrowFunction, false);
        document.addEventListener("keyup", this.arrowUpFunction, false);
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 10);
    }
    componentWillUnmount(){
        document.removeEventListener("keydown", this.arrowFunction, false);
        document.removeEventListener("keyup", this.arrowUpFunction, false);
    }
    delete = (key) => {
        delete this.state.projectiles[key]
    }

    render() {
        // Begin Problem 8
        if (this.state.movingUp) {
            this.state.y += 1
        }
        if (this.state.movingLeft) {
            this.state.x -= 1
        }
        if (this.state.movingRight) {
            this.state.x += 1
        }
        if (this.state.movingDown) {
            this.state.y -= 1
        }
        let values = Object.keys(this.state.projectiles).map((key => {
            return this.state.projectiles[key];
        }))
        return (
            <div>
                {this.state.shooting && (this.state.projectiles[this.state.index] = <Projectile image={"./projectile.png"} x={this.state.x + 48} y={this.state.y + 20} delete={this.delete} index={this.state.index} updateY={this.props.updateY} updateX={this.props.updateX}/>)}
                {this.state.shooting && this.setState({shooting: false, index: this.state.index+1})}
                {values.map((projectile => {
                    return(<div>{projectile}</div>);
                }))}
                <img style={{position: "absolute", left: this.state.x, bottom: this.state.y}} src={this.props.image}/>
            </div>
        );
    }
}


class Projectile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            x: window.innerWidth / 2 - 50,
            y: 0,
        }
    }
    componentDidMount(){
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 10);
        this.setState({x: this.props.x, y: this.props.y})
        this.props.updateX(this.props.x, this.props.index)
    }
    componentDidUpdate() {
        // if (this.state.y > window.innerHeight) {
        //     this.props.delete(this.props.index)
        // }
    }

    render() {
        this.state.y += 5
        this.props.updateY(this.state.y, this.props.index)

        return (
            <div>
                <img style={{position: "absolute", left: this.state.x, bottom: this.state.y}} src={this.props.image}/>
            </div>
        );
    }
}
export default App;
