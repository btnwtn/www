import React from 'react'
import Link from 'gatsby-link'

import profileImage from './profile.jpg'

export default ({ data }) => (
  <div>
    <h1 style={{ fontSize: '1rem', marginTop: '2em', marginBottom: '2em' }}>
      btnwtn
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
    <div>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <section key={node.id} style={{ marginBottom: '1.5em' }}>
          <h1 style={{ margin: 0, marginBottom: '.75rem' }}>
            <Link to={node.fields.permalink}>{node.frontmatter.title}</Link>
          </h1>
          <p style={{ margin: 0, marginBottom: '.5em' }}>
            {node.frontmatter.excerpt ? node.frontmatter.excerpt : node.excerpt}
          </p>
          <span style={{ fontSize: '.75em', color: '#65767d' }}>
            {node.frontmatter.date}
          </span>
        </section>
      ))}
    </div>
  </div>
)

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            excerpt
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
          fields {
            slug
            permalink
          }
        }
      }
    }
  }
`
