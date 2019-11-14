module.exports = {
  title: '智能制造协同平台',
  description: '智能制造协同平台文档说明',
  port: 1111,
  locales: {
    '/': { lang: 'zh-CN' }
  },
  base: '/one-yard-ui/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: {
        message: '内容已经更新啦～',
        buttonText: '跟我走！'
      }
    }
  },
  themeConfig: {
    editLink: true,
    repo: 'GeneralAndKing/one-yard-ui',
    editLinkText: '帮助我们改进此文档！',
    docsDir: 'docs',
    nav: [
      { text: '主页', link: '/' },
      { text: '需求分析', link: '/demand/' },
      { text: '技术架构', link: '/architecture/' },
      { text: '关于', link: '/about/' },
      { text: 'Github', link: 'https://github.com/GeneralAndKing' }
    ],
    sidebar: {
      '/demand/': [
        ['', '文档说明'],
        {
          title: '基础需求',
          collapsable: false,
          children: [
            '/demand/system/base'
          ]
        },
        {
          title: '物料需求',
          collapsable: false,
          children: [
            '/demand/material-plan/create'
          ]
        }
      ],
      '/architecture/': [
        ''
      ],
      '/about/': [
        ''
      ]
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
}
