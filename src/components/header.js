import React from 'react'
import Link from 'gatsby-link'
import profileImage from './profile.jpg'

export default () => (
  <div style={{ marginTop: '2em' }}>
    <h1 style={{ fontSize: '1rem', marginTop: 0, marginBottom: '2em' }}>
      <Link to="/">btnwtn</Link>
    </h1>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '3em',
      }}
    >
      <div style={{ marginRight: '1.5em' }}>
        <img
          src={profileImage}
          alt=""
          style={{
            display: 'block',
            width: '75px',
            height: '75px',
            borderRadius: '50%',
          }}
        />
      </div>
      <p style={{ margin: 0 }}>
        Brandon Newton is a <i>Software Engineer</i> specializing in performant
        and responsive Frontend development. Currently located in Brooklyn, NY.
      </p>
    </div>
  </div>
)
