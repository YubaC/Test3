#!/usr/bin/env node
// filepath: /scripts/syncLabels.js

/*
Usage:
  Set environment variable GITHUB_TOKEN with your personal access token.
  Run the script:
    node syncLabels.js <sourceOwner/sourceRepo> <targetOwner/targetRepo>
Example:
    node syncLabels.js octocat/source-repo octocat/target-repo
*/

const axios = require("axios");

async function syncLabels(sourceRepo, targetRepo, token) {
    const [srcOwner, srcRepo] = sourceRepo.split("/");
    const [tgtOwner, tgtRepo] = targetRepo.split("/");

    const headers = {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
    };

    // Fetch labels from source repository
    const srcUrl = `https://api.github.com/repos/${srcOwner}/${srcRepo}/labels?per_page=100`;
    const srcResponse = await axios.get(srcUrl, { headers });
    const srcLabels = srcResponse.data;

    // Fetch labels from target repository
    const tgtUrl = `https://api.github.com/repos/${tgtOwner}/${tgtRepo}/labels?per_page=100`;
    const tgtResponse = await axios.get(tgtUrl, { headers });
    const tgtLabels = tgtResponse.data;
    const tgtLabelNames = new Set(tgtLabels.map((label) => label.name));

    for (const label of srcLabels) {
        if (tgtLabelNames.has(label.name)) {
            console.log(`Label "${label.name}" already exists. Skipping.`);
            continue;
        }

        console.log(`Creating label "${label.name}"...`);
        try {
            await axios.post(
                `https://api.github.com/repos/${tgtOwner}/${tgtRepo}/labels`,
                {
                    name: label.name,
                    color: label.color,
                    description: label.description || "",
                },
                { headers },
            );
            console.log(`Label "${label.name}" created.`);
        } catch (error) {
            console.error(
                `Failed to create label "${label.name}":`,
                error.response ? error.response.data.message : error.message,
            );
        }
    }
}

async function main() {
    // const [, , sourceRepo, targetRepo] = process.argv;
    const sourceRepo = "Yuba-Technology/Archives-Core";
    const targetRepo = "Yuba-Technology/WorkflowX";
    if (!sourceRepo || !targetRepo) {
        console.error(
            "Usage: node syncLabels.js <sourceOwner/sourceRepo> <targetOwner/targetRepo>",
        );
        process.exit(1);
    }

    const token = "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";
    if (!token) {
        console.error("Please set the GITHUB_TOKEN environment variable.");
        process.exit(1);
    }

    await syncLabels(sourceRepo, targetRepo, token);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
