module.exports = {
    branches: ["develop"],
    tagFormat: false,
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
                successCmd:
                    'echo "next_version=${nextRelease.version}" >> $GITHUB_OUTPUT',
            },
        ],
    ],
};
