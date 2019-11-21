module.exports = {
  title: '智能制造协同平台',
  description: '文档说明',
  port: 1111,
  locales: {
    '/': { lang: 'zh-CN' }
  },
  base: '/one-yard-ui/',
  head: [
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', href: '/favicon-32x32.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#ffffff' }]
],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: {
        message: '内容已经更新啦～',
        buttonText: '跟我走！'
      }
    },
    '@vuepress/back-to-top': true
  },
  themeConfig: {
    repo: 'GeneralAndKing/one-yard-ui',
    editLinkText: '帮助我们改进此文档！',
    editLinks: true,
    docsDir: 'docs',
    nav: [
      { text: '主页', link: '/' },
      { text: '操作手册', link: '/demand/' },
      { text: '技术架构', link: '/architecture/' }
    ],
    sidebar: {
      '/demand/': [
        ['', '文档说明'],
        {
          title: '基础操作',
          collapsable: false,
          children: [
            '/demand/system/base',
            '/demand/system/admin',
            '/demand/system/ready'
          ]
        },
        ['/demand/action/start', '整体流程'],
        ['/demand/action/adaptation', '移动端适配']
      ],
      '/architecture/': [
        ['', '概览'],
        ['maintain', '运维'],
        ['back', '后端'],
        ['web', '前端'],
        ['summary', '总结'],
        ['other', '附录：接口设计表格']
      ]
    },
    sidebarDepth: 2,
    lastUpdated: 'Last Updated'
  }
}
