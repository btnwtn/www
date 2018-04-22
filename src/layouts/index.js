import React from 'react'
import Helmet from 'react-helmet'

const Layout = ({ children, data }) => (
  <div>
    <Helmet title={data.site.siteMetadata.title} />
    <div>{children()}</div>
  </div>
)

export default Layout

export const query = graphql`
  query SiteTitleQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`
