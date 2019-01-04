module.exports = {
    title: 'TEAM',
    description: '',
    base: '/app/gfe-blog/',
    markdown: {
        // markdown-it-anchor 的选项
        anchor: { permalink: true },
        // markdown-it-toc 的选项
        toc: { includeLevel: [1, 2] },
        config: md => {
            md.use(require('markdown-it-task-lists')) // 一个 checkbox 的 TODO List 插件
            .use(require('markdown-it-imsize'), { autofill: true }) // 支持自定义 md 图片大小 ![](http://test.png =200x200)
    }
    },
    themeConfig: {
        logo: '',
        accentColor: '#ac3e40',
        per_page: 9,
        date_format: 'yyyy-MM-dd',
        nav: [
            { text: '首页', link: '/' },
            { text: 'Web开发', link: '/web/' },
            { text: '项目', link: '/project/' },
            { text: '技术周刊', link: '/weekly/' },
            { text: 'GitHub', link: '/github/' },
        ],
        sidebar: [
            ['/', '首页'],
            {
                title: 'Web开发',
                collapsable: true,
                children: [
                    '/web/javascript/',
                    '/web/css/',
                    '/web/html5/',
                    '/web/nodejs/',
                    '/web/h5/',
                ]
            },
            ['/project/', '项目'],
            ['/weekly/', '技术周刊'],
            ['/github/', 'Github'],
        ]
    },
    // chainWebpack: config => {
    //     config.module
    //         .rule('sass')
    //         .test(/\.sass$/)
    //         .use('sass-loader')
    //         .loader('sass-loader')
    //         .end()
    // }
}