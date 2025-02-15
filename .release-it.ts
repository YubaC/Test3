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
            // ???
            // "git push --set-upstream origin HEAD:release/v${version}",
            // "gh pr create --base main --title 'Release v${version}' --body 'Automated release PR'",
        ],
        "after:release": "echo 'Successfully released v${version}'",
    },
    plugins: {
        "@release-it/conventional-changelog": {
            preset: "angular",
            infile: "CHANGELOG.md",
        },
    },
} satisfies Config;
