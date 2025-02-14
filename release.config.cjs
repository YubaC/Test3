module.exports = {
    branches: ["main"],
    plugins: [
        // 分析 commit 信息计算下一个版本号
        "@semantic-release/commit-analyzer",

        // 生成发布日志，用于生成 changelog 内容
        "@semantic-release/release-notes-generator",

        // 执行 npm version 命令，更新 package.json 中的版本字段（不创建 git 标签）
        [
            "semantic-release/exec",
            {
                prepareCmd:
                    "npm version ${nextRelease.version} --no-git-tag-version",
            },
        ],

        // 更新 CHANGELOG 文件内容
        [
            "@semantic-release/changelog",
            {
                changelogFile: "CHANGELOG.md",
            },
        ],

        // 将更新后的 package.json 和 CHANGELOG.md 提交到仓库
        [
            "@semantic-release/git",
            {
                assets: ["package.json", "CHANGELOG.md"],
                message: "chore(release): ${nextRelease.version} [skip ci]",
            },
        ],
    ],
};
