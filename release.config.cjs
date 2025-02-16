const fs = require("node:fs");

module.exports = {
    branches: ["develop"],
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
        [
            "@semantic-release/git",
            {
                assets: ["package.json", "CHANGELOG.md"], // 只更新文件，不创建标签
                message: "chore(release): ${nextRelease.version}",
            },
        ],
    ],
    verifyConditions: [
        // 手动读取 package.json 版本而不是 Git tag
        () => {
            const packageJson = JSON.parse(
                fs.readFileSync("package.json", "utf8"),
            );
            return packageJson.version;
        },
    ],
};
