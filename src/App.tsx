import React, { Component } from 'react';
import { Container, FormGroup, Label, Input, ButtonGroup, Button } from 'reactstrap';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <Container className="App">
        <ReturnButton />
        <ToolBase64 />
      </Container>
    );
  }
}

class ReturnButton extends Component {
  render() {
    return (
        <a className="return" href="/">Cryptographic Crypt</a>
      );
  }
}

interface IModeProps {

}

interface IModeState {
  rSelected: number
}

class ModeButtonGroup extends Component<IModeProps, IModeState>{
  constructor (props: IModeProps) {
    super(props);

    this.state = { rSelected: 1 };

    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
  }

  onRadioBtnClick(rSelected: any) {
    this.setState({ rSelected });
  }
  
  render() {
    return (
       <ButtonGroup className="btn-group-toggle" data-toggle="buttons">
         <Button className="btn-outline-primary" onClick={() => this.onRadioBtnClick(1)} active={this.state.rSelected === 1}>
           Encode
         </Button>
         <Button className="btn-outline-primary" onClick={() => this.onRadioBtnClick(2)} active={this.state.rSelected === 2}>
           Decode
         </Button>
       </ButtonGroup>
      );
  }
}


class ToolBase64 extends Component {
  constructor (props: any) {
    super(props);
    
  }

  render() {
     return (
       <div>
         <h1>Base 64</h1>
         <FormGroup>
           <Label for="exampleText">Input</Label>
           <Input type="textarea" name="text" id="exampleText" />
         </FormGroup>
         <FormGroup>
           <ModeButtonGroup />
         </FormGroup>
         <FormGroup>
           <Label for="exampleText">Output</Label>
           <Input type="textarea" name="text" id="exampleText" />
         </FormGroup>
       </div>
       );
  }
}

export default App;
