import React from 'react'
import BackButton from '../../components/BackButton';

function Contact() {
  return (
    <div className='contentDiv scrollMiddle'>
     <div className="backIcon">
      <BackButton />
      </div>
      <div>
        <h1>Contact</h1>
        <article>Contact text</article>
      </div>
    </div>
  )
}

export default Contact