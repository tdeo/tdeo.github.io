import React from 'react'

import { Button } from 'react-bootstrap'


const ButtonNumber = ({ i, played, setPlayed }) => {
  const togglePlayed = () => {
    setPlayed(state => ({ ...state, [i]: !played[i] }))
  }

  return <Button bsStyle={played[i] ? 'primary' : 'secondary'}
    className="m-1"
    style={{ width: 40 }}
    onClick={togglePlayed}>
     {i}
  </Button>
}

const TheGame = () => {
  const [played, setPlayed] = React.useState({})

  return <>
    {[...Array(10)].map((el, i) => {
      return <div key={i}>
        {[...Array(10)].map((_el, j) => {
          return <ButtonNumber key={j} i={10 * i + j} played={played} setPlayed={setPlayed} />
        })}
      </div>
    })}
  </>
}

export default TheGame
