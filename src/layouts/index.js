import React from 'react'
import Helmet from 'react-helmet'

import 'prism-solarized-dark/prism-solarizeddark.css'
import './global.css'

import Header from '../components/header'

const Layout = ({ children, data }) => (
  <div style={{ maxWidth: '40em', marginLeft: 'auto', marginRight: 'auto' }}>
    <Helmet title={data.site.siteMetadata.title} />
    <Header />
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
