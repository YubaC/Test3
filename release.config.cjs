module.exports = {
    branches: ["develop"],
    // 设置空的 tagFormat 禁用 git tag 的生成
    tagFormat: "",
    plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
            "@semantic-release/exec",
            {
                publishCmd:
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
                successCmd:
                    'echo "next_version=${nextRelease.version}" >> $GITHUB_OUTPUT',
            },
        ],
    ],
};
