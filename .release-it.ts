import type { Config } from "release-it";

export default {
    git: {
        requireBranch: "*",
        commitMessage: "chore: release v${version}",
        tagName: "v${version}",
        pushRepo: "origin",
    },
    hooks: {
        "after:bump": [
            // "git push --set-upstream origin HEAD:release/v${version}",
            // "gh pr create --base main --title 'Release v${version}' --body 'Automated release PR'",
        ],
        "after:release": "echo 'Successfully released v${version}'",
    },
    plugins: {
        "@release-it/conventional-changelog": {
            preset: "angular",
            infile: "CHANGELOG.md",
            options: {
                parserOpts: {
                    // 匹配可选的 emoji（Unicode 范围可能需根据情况调整），后面跟空格，再匹配大写 type、可选 scope、冒号、空格和 subject
                    headerPattern:
                        /^([\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}]+\s?)?([A-Z]+)(?:\((.*)\))?:\s(.*)$/u,
                    headerCorrespondence: [
                        "emoji",
                        "type",
                        "scope",
                        "subject",
                    ],
                },
            },
        },
    },
} satisfies Config;
