import React from 'react'
import Link from 'gatsby-link'

export default ({ data }) => (
  <div>
    <h1>BRandons Kewl Website</h1>
    yo <Link to="/files">files</Link>
    <h2>Blog Posts: {data.allMarkdownRemark.totalCount}</h2>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <section key={node.id}>
        <h1>
          <Link to={node.fields.permalink}>
            {node.frontmatter.title}{' '}
            <span style={{ fontSize: '1rem', color: '#65767d' }}>
              {node.frontmatter.date}
            </span>
          </Link>
        </h1>
        <Link to={node.fields.permalink}>
          <p>
            {node.frontmatter.excerpt ? node.frontmatter.excerpt : node.excerpt}
          </p>
        </Link>
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
