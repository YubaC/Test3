// module.exports = {
//     // 指定进行版本发布的分支
//     branches: ["main"],

//     // 配置需要使用的插件列表，顺序和所依赖的阶段有关
//     plugins: [
//         // 根据 commit 信息分析和计算下一个版本号
//         "@semantic-release/commit-analyzer",

//         // 生成发布日志
//         "@semantic-release/release-notes-generator",

//         // 更新 CHANGELOG 文件内容
//         "@semantic-release/changelog",

//         // 发布 npm 包（如果你的项目涉及到 npm 发布）
//         "@semantic-release/npm",

//         // 在 GitHub 上创建发布记录
//         "@semantic-release/github",
//     ],

//     // 可选：自定义生成发布日志时的选项
//     // releaseNotes: {
//     //   // 配置选项...
//     // },

//     // 可选：自定义提交信息格式等配置
//     // preset: 'angular',
// };
module.exports = {
    repositoryUrl: "git@github.com:YubaC/Test3.git", // 使用 SSH 地址

    // 指定进行版本发布的分支
    branches: ["main"],

    // 配置需要使用的插件列表
    plugins: [
        // 根据 commit 信息分析和计算下一个版本号
        "@semantic-release/commit-analyzer",

        // 生成发布日志（这里只用于生成 changelog 信息）
        "@semantic-release/release-notes-generator",

        // 更新 CHANGELOG 文件内容
        "@semantic-release/changelog",
    ],
};
