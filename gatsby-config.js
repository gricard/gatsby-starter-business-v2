const config = require('./meta/config')
const pathPrefix = config.pathPrefix === '/' ? '' : config.pathPrefix

module.exports = {
  siteMetadata: {
    title: config.siteTitle,
    author: config.userName,
    description: config.siteDescription,
    siteUrl: config.siteUrl,
    rssMetadata: {
      site_url: config.siteUrl + pathPrefix,
      feed_url: config.siteUrl + pathPrefix + config.siteRss,
      title: config.siteTitle,
      description: config.siteDescription,
      image_url: `${config.siteUrl + pathPrefix}/icons/icon-512x512.png`,
      author: config.userName,
      copyright: config.copyright,
    },
  },
  pathPrefix: '/gatsby-starter-blog',
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages`,
        name: 'pages',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          'gatsby-remark-prismjs',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-smartypants',
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        //trackingId: `ADD YOUR TRACKING ID HERE`,
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        setup (ref) {
          const ret = ref.query.site.siteMetadata.rssMetadata
          ret.allMarkdownRemark = ref.query.allMarkdownRemark
          ret.generator = 'GatsbyJS Business Starter'
          return ret
        },
        query: `
          {
            site {
              siteMetadata {
                rssMetadata {
                  site_url
                  feed_url
                  title
                  description
                  image_url
                  author
                  copyright
                }
              }
            }
          }
        `,
        feeds: [
          {
            serialize (ctx) {
              const rssMetadata = ctx.query.site.siteMetadata.rssMetadata
              return ctx.query.allMarkdownRemark.edges
                .filter(edge => edge.node.frontmatter.templateKey === 'article-page')
                .map(edge => ({
                  categories: edge.node.frontmatter.tags,
                  date: edge.node.frontmatter.date,
                  title: edge.node.frontmatter.title,
                  description: edge.node.excerpt,
                  author: rssMetadata.author,
                  url: rssMetadata.site_url + edge.node.fields.slug,
                  guid: rssMetadata.site_url + edge.node.fields.slug,
                  custom_elements: [{'content:encoded': edge.node.html}],
                }))
            },
            query: `
              {
                allMarkdownRemark(
                  limit: 1000,
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  edges {
                    node {
                      excerpt(pruneLength: 400)
                      html
                      id
                      fields { slug }
                      frontmatter {
                        title
                        templateKey
                        cover
                        date(formatString: "MMMM DD, YYYY")
                        tags
                      }
                    }
                  }
                }
              }
            `,
            output: config.siteRss,
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: config.siteTitle,
        short_name: config.siteTitleAlt,
        start_url: `/`,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: `minimal-ui`,
        //display: 'standalone', // from v1
        //icon: `src/assets/gatsby-icon.png`, //v2
        icons: [
          {
            src: `/icons/icon-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `/icons/icon-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
      },
    },
    `gatsby-plugin-offline`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: 'gatsby-plugin-netlify-cms',
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    `gatsby-plugin-offline`,
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: config.themeColor,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: config.googleTagManagerID,
        includeInDevelopment: false,
      },
    },
    'gatsby-plugin-netlify',
  ],
}
