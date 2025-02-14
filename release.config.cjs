module.exports = {
    branches: ["main"],
    plugins: [
        [
            "@semantic-release/commit-analyzer",
            {
                parserOpts: {
                    headerPattern:
                        /^.+?\s?([A-Za-z]+)(!?)(?:\((.*)\))?: (.*)$/,
                    headerCorrespondence: [
                        "type",
                        "scope",
                        "breaking",
                        "subject",
                    ],
                },
                releaseRules: [
                    { breaking: "!", release: "major" },
                    { type: "Feat", release: "minor" },
                ],
            },
        ],

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
        // [
        //     "semantic-release-github-pullrequest",
        //     {
        //         assets: ["package.json", "CHANGELOG.md"],
        //         branch: "release/${nextRelease.version}",
        //     },
        // ],
        [
            "@semantic-release/exec",
            {
                publishCmd: "sh sh.sh ${nextRelease.version}",
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
