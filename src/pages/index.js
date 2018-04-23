import React from 'react'
import Link from 'gatsby-link'

export default ({ data }) => (
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
