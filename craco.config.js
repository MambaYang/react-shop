// craco 自定义antd主题颜色

const CracoLessPlugin = require("craco-less")

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { "@primary-color": "#1DA57A" },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    // 支持装饰器语法
    babel: {
        plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
    },
}
