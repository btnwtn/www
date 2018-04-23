module.exports = {
  siteMetadata: {
    title: 'Gatsby Default Starter',
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-prismjs`,

            options: {
              classPrefix: 'language-',
              inlineCodeMarker: '±',
              aliases: {},
            },
          },
          {
            resolve: `gatsby-remark-twemoji`,
          },
        ],
      },
    },
    'gatsby-plugin-react-helmet',
  ],
}
