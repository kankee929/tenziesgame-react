import "./App.css";
import Die from "./Components/Die";
import React from "react";
import Confetti from "react-confetti";

function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [counter, setCounter] = React.useState(0);
  const [timer, setTimer] = React.useState(getTime);
  const [bestTime, setBestTime] = React.useState(
    JSON.parse(localStorage.getItem("time"))
  );

  function getTime() {
    var today = new Date();
    var time = Date.now();
    // today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    return time;
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      const rand = Math.ceil(Math.random() * 6);
      const newDiceObj = { id: i, value: rand, isHeld: false };
      newDice.push(newDiceObj);
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      setCounter((prevCount) => prevCount + 1);
      setDice((OldDie) =>
        OldDie.map((die) =>
          die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
        )
      );
    } else {
      if (bestTime > timer || bestTime === null) {
        setBestTime(timer);
        localStorage.setItem("time", JSON.stringify(timer));
      }
      setTimer(getTime());
      setTenzies(false);
      setDice(allNewDice());
      setCounter(0);
    }
  }

  function dieHold(id) {
    if (counter === 0) {
      setTimer(getTime());
    }
    setDice((OldDie) =>
      OldDie.map((die) =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  const diceElements = dice.map((item) => (
    <Die
      key={item.id}
      isHeld={item.isHeld}
      dieHold={() => dieHold(item.id)}
      value={item.value}
    />
  ));

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      setTimer((prevTime) => Math.abs(getTime() - prevTime) / 1000);
    }
  }, [dice]);

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <br />
      <div className="tenzie-stats">
        <div className="roll-counter">No. of Rolls: {counter}</div>
        <div className="roll-time">
          Time Taken: {tenzies && Math.floor(timer)} seconds
        </div>
        <div className="best-time">
          Best Time:{Math.floor(bestTime)} seconds{" "}
        </div>
      </div>
    </main>
  );
}

export default App;
