module.exports = {
    branches: ["main"],
    plugins: [
        // 分析 commit 信息计算下一个版本号
        [
            "@semantic-release/commit-analyzer",
            {
                preset: "angular",
                // 修改正则：
                // 先匹配任意字符（Emoji 及可能的前置字符），后跟空格，
                // 捕获 Type（要求首字母大写，后续小写），然后捕获一个可选的 "!"（表示 breaking change），
                // 接着捕获可选的 scope（在括号内），最后是 subject。
                parserOpts: {
                    headerPattern:
                        /^.+?\s?([A-Z,a-z]+)(!?)(?:\((.*)\))?: (.*)$/m,
                    // 对应分别为：type, breaking, scope, subject
                    headerCorrespondence: [
                        "type",
                        "breaking",
                        "scope",
                        "subject",
                    ],
                },
                // releaseRules：当 breaking 存在时触发 major release，
                // 否则按照 type 来判断（Feat -> minor, Fix -> patch）
            },
        ],

        // 生成发布日志，用于生成 changelog 内容
        "@semantic-release/release-notes-generator",

        // 执行 npm version 命令，更新 package.json 中的版本字段（不创建 git 标签）
        [
            "@semantic-release/exec",
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
            "semantic-release-github-pullrequest",
            {
                assets: ["package.json", "CHANGELOG.md"],
                baseRef: "main",
                branch: "release/${nextRelease.version}",
            },
        ],
        // [
        //     "@semantic-release/git",
        //     {
        //         assets: ["package.json", "CHANGELOG.md"],
        //         message: "chore(release): ${nextRelease.version} [skip ci]",
        //     },
        // ],
    ],
};
