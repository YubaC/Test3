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
        [
            "@semantic-release/exec",
            {
                // 注意：这里的 set-output 用法适用于较早版本的 GitHub Actions，若遇到 set-output 废弃问题，
                // 可参考 GitHub 文档使用环境文件的方法，例如：
                // echo "next_version=${nextRelease.version}" >> $GITHUB_OUTPUT
                successCmd:
                    'echo "next_version=${nextRelease.version}" >> $GITHUB_OUTPUT',
                // 'echo "::set-output name=next_version::${nextRelease.version}"',
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
        // [
        //     "@semantic-release/exec",
        //     {
        //         publishCmd: `
        //             git checkout -b release/\${nextRelease.version} &&
        //             git add package.json CHANGELOG.md &&
        //             git commit -m "chore(release): \${nextRelease.version} [skip ci]" &&
        //             git push origin release/\${nextRelease.version} &&
        //             gh pr create --fill --base main`,
        //     },
        // ],
        // [
        //     "@semantic-release/git",
        //     {
        //         assets: ["package.json", "CHANGELOG.md"],
        //         message: "chore(release): ${nextRelease.version} [skip ci]",
        //     },
        // ],
    ],
};
