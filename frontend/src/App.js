import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import Clock from 'react-live-clock';
import Card from './Components/Card';
import {db} from './Firebase';
import { FillSpinner } from 'react-spinners-kit';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './App.css';

const App = () => {
  const [cards, setCards] = useState([]);
  const [lastTime, setLastTime] = useState(Date.now());

  // const doc = db.collection('cards');
  // const observer = doc.onSnapshot(docSnapshot => {
  //   console.log(docSnapshot.updateTime);
  //   if(lastTime != docSnapshot.updateTime){
  //     setLastTime(docSnapshot.updateTime);
  //     setCards(docSnapshot.docs.map(doc => doc.data()));
  //   }
  // }, err => {
  //   console.log(`Encountered error: ${err}`);
  // });

  useEffect(() => {
    let interval = setInterval( async () => {
      const metaRef = await db.collection('meta').doc('main').get();
      console.log(metaRef.data());

      if(metaRef.data().lastUpdated !== lastTime){
        setLastTime(metaRef.data().lastUpdated);
        const cardsRef = db.collection("cards");
        const snapshot = await cardsRef.get();
        let cardArr = snapshot.docs.map((item) => (item.data()));
        cardArr.sort((a,b) => a.id - b.id);
        console.log(cardArr);
        setCards(cardArr);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div className="appHeader">
        <h1 className="logo">KāDO</h1>
        <h1 className="clock"><Clock format={'hh:mm:ssa'} ticking={true}/></h1>
      </div>
      <div className={ cards.length !== 0 ? "" : "spinnerContainer"}>
        { cards.length !== 0
          ? (
            <TransitionGroup className="cardContainer">

              {cards.map( (item) =>
                (<CSSTransition
                  key={item.id}
                  timeout={200}
                  classNames="animation"
                  >
                    <Card msg={item.msg} author={item.author} id={item.id} />
                </CSSTransition>)
              )}

            </TransitionGroup>
          )
          : <FillSpinner size={50}/>}
      </div>
    </div>
  );
}

export default App;
