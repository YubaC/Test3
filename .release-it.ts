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
            preset: "conventionalcommits",
            infile: "CHANGELOG.md",
            options: {
                parserOpts: {
                    //         // 匹配可选的 emoji（Unicode 范围可能需根据情况调整），后面跟空格，再匹配大写 type、可选 scope、冒号、空格和 subject
                    headerPattern: /^.?\s?([A-Za-z]+)(?:\((.*)\))?: (.*)$/,
                    //         headerCorrespondence: [
                    //             "type",
                    //             "scope",
                    //             "breaking",
                    //             "subject",
                    //         ],
                    //         releaseRules: [
                    //             { breaking: true, release: "major" },
                    //             { type: "Feat", release: "minor" },
                    //             { type: "Fix", release: "patch" },
                    //         ],
                },
            },
        },
    },
} satisfies Config;
