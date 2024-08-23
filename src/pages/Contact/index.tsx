import React from 'react'
import BackButton from '../../components/BackButton';

function Contact() {
  return (
    <div className='contentDiv scrollMiddle'>
     <div className="backIcon">
      <BackButton />
      </div>
      <div>
      <main className="contentDiv scrollMiddle">
       <>
       <h1>Do you want to buy this script only  / with domain?</h1>

       <p>Features:</p>
       <ul>
        <li>People / doctor can resgister and activate by secure email link</li>
        <li>Admin can Enter new symptoms</li>
        <li>User can post his symptom name with photo anonymously</li>
        <li>Doctor can see the user's request and add description for that symptom name</li>
        <li>When user search any symptom, nearby doctors displays in rightside</li>
        <li>When user goto symptom details page, nearby doctors in same department displayin rightside</li>
        <li>In doctor's page all doctors list showing, you can filter according departments</li>
        <li>In department page all the department with small description listed there</li>
       </ul>
       </>

       <p>If you wany any customization like new feature addition then let me know</p>
       <p>Contact me at badalray@yahoo.com</p>

    </main>
      </div>
    </div>
  )
}

export default Contact