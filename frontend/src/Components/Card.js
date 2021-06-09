import React from 'react';

const Card = (props) => {
  return(
    <div className="Card">
      <h2 className="message">{props.msg}</h2>
      <div className="footer">
        <p className="author">{props.author}</p>
        <div className="id"><p>{props.id}</p></div>
      </div>
    </div>
  );
}

export default Card;
