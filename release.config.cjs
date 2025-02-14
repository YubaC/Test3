module.exports = {
    branches: ["main"],
    plugins: [
        "@semantic-release/commit-analyzer",

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
                publishCmd: `
                    git checkout -b release/\${nextRelease.version} &&
                    git add package.json CHANGELOG.md &&
                    git commit -m "chore(release): \${nextRelease.version} [skip ci]" &&
                    git push origin release/\${nextRelease.version} &&
                    gh pr create --fill --base main`,
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
