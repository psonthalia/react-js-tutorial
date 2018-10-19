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
        for (let i = 0; i < 10; i++) {
            enemies.push(<Enemy x={Math.floor(Math.random() * (window.innerWidth - 150))} y = {Math.floor(Math.random() * 200 + window.innerHeight - 400)} image={"./enemy.png"} getY={this.getY} getX={this.getX}/>)
        }
        this.setState({enemies: enemies})
    }
    updateY = (y, index) => {
        this.state.y[index] = y
    }
    updateX = (x, index) => {
        this.state.x[index] = x
    }
    getY = () => {
        return this.state.y
    }
    getX = () => {
        return this.state.x
    }
  render() {
    return (
      <div className="App" style={{background: "#000000"}}>
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
            if (this.props.getY()[key] >= (this.state.y-20) && this.props.getY()[key] <= (this.state.y+20) && this.props.getX()[key] >= (this.state.x-20) && this.props.getX()[key] <= (this.state.x+20)) {
                this.deleteSelf()
            }
        }
    }
    render() {
        if (this.state.direction) {
            this.state.x += 5
        } else {
            this.state.x -= 5
        }
        if (this.state.x < 20 || this.state.x > (window.innerWidth - 90)) {
            this.state.direction = !this.state.direction
        }
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
        if(event.keyCode === 32) {
            this.setState({shooting: true})
        }
    }
    arrowUpFunction(event) {
        this.setState({movingUp: false, movingLeft: false, movingRight: false, movingDown: false, shooting: false})
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
        if (this.state.movingUp) {
            this.state.y += 3
        }
        if (this.state.movingLeft) {
            this.state.x -= 3
        }
        if (this.state.movingRight) {
            this.state.x += 3
        }
        if (this.state.movingDown) {
            this.state.y -= 3
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
        if (this.state.y > window.innerHeight) {
            this.props.delete(this.props.index)
        }
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
