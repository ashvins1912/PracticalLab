import React, { useState } from 'react';
import './App.css';
function Addition(props) {

  const handleAddition = () => { props.method(props.value) }
  return <button onClick={handleAddition}> +{props.value}</button>
}

function Substraction(props) {

  const handleSubstraction = () => { props.method(props.value) }
  return <button onClick={handleSubstraction}> -{props.value}</button>
}

function Division(props) {

  const handleDivision = () => { props.method(props.value) }
  return <button onClick={handleDivision}> /{props.value}</button>
}


function Mulitiple(props) {

  const handleMulitiple = () => { props.method(props.value) }
  return <button onClick={handleMulitiple}> *{props.value}</button>
}

function ShowVariable(props){

  return <div>{props.value} </div>
}

function App() {
  const [variable, setVariable] = useState(0);

  const incrementValue = (param) => {
    setVariable(variable + param);
  }

  const decrementValue = (param) => {
    setVariable(variable - param);
  }

  const multipleValue = (param) => {
    setVariable(variable * param);
  }

   
  return (
    <>
      <Addition value={1} method={incrementValue} />
      <Substraction value={1} method={decrementValue} />
       <Mulitiple value={2} method={multipleValue}/>
      <ShowVariable value={variable}/>
    </>
  );
}

export default App;
