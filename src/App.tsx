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


class ModeButtonGroup extends Component<any, any>{
  constructor (props: any) {
    super(props);
  }
  
  render() {
    return (
       <ButtonGroup className="btn-group-toggle" data-toggle="buttons">
         <Button className="btn-outline-primary" onClick={() => this.props.onChange("encode")} active={this.props.mode === "encode"}>
           Encode
         </Button>
         <Button className="btn-outline-primary" onClick={() => this.props.onChange("decode")} active={this.props.mode === "decode"}>
           Decode
         </Button>
       </ButtonGroup>
      );
  }
}

class TextArea extends Component<any, any> {

  render() {
    return (
       <FormGroup>
         <Label for={this.props.id}>{this.props.label}</Label>
         <Input 
           type="textarea" 
           name="text" id={this.props.id} 
           onChange={this.props.onChange} 
           invalid={!this.props.valid}
          />
       </FormGroup>
    );
  }
}

class OutputTextArea extends Component<any, any> {

  render() {
    return (
       <FormGroup>
         <Label for={this.props.id}>{this.props.label}</Label>
         <Input type="textarea" name="text" id={this.props.id} value={this.props.value} readOnly/>
       </FormGroup>
    );
  }
}


class ToolBase64 extends Component<any, any> {
  constructor (props: any) {
    super(props);

    this.state = {input: "", mode: "encode", output: "", validInput: true}

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleModeChange = this.handleModeChange.bind(this);

  }

  handleInputChange(event: any) {
    this.setState(
      {input: event.target.value}, 
      () => this.setOutput()
     )
  }

  handleModeChange(mode: string) {
    this.setState(
      {mode},
      () => this.setOutput()
     )
  }

  setOutput() {
    let output
    if (this.state.mode === "encode") {
      output = this.encode(this.state.input)
      this.setState({
        output: output, 
        validInput: true})
    }
    else if(this.state.mode === "decode") {
      try {
        output = this.decode(this.state.input)
        this.setState({
          output: output, 
          validInput: true})
      } catch(e) {
        this.setState({
          validInput: false
        })
      }
    }
  }


  encode(plaintext: string) {
    return btoa(plaintext)

  }

  decode(encodedtext: string) {
    return atob(encodedtext)
  }

  render() {
     return (
       <div>
       <h1>Base 64</h1>
       <div className="card">
       <div className="card-body">
         <TextArea id="input" label="Input" onChange={this.handleInputChange} valid={this.state.validInput}/>
         <FormGroup>
           <ModeButtonGroup onChange={this.handleModeChange} mode={this.state.mode}/>
         </FormGroup>
         <OutputTextArea 
           id="output" 
           label="Output" 
           value={this.state.output} 
          />
       </div>
       </div>
       </div>
       );
  }
}

export default App;
