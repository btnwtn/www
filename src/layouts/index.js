import React from 'react'
import Helmet from 'react-helmet'

require('prismjs/themes/prism-solarizedlight.css')
require('./global.css')

const Layout = ({ children, data }) => (
  <div style={{ maxWidth: '40em', marginLeft: 'auto', marginRight: 'auto' }}>
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
