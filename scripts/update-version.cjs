const GITHUB_API_URL = "https://api.github.com/repos/kuzudb/kuzu/releases/latest";
const fs = require('fs/promises');
const path = require('path');

(async () => {
    try {
        console.log("Fetching latest version from GitHub...");
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        let version = data.tag_name;
        if (!version || typeof version !== 'string') {
            throw new Error('Failed to fetch version: tag_name is missing or not a string');
        }
        version = version.trim();
        version = version.startsWith('v') ? version.substring(1) : version;
        console.log(`Latest version is ${version}`);
        console.log("Updating version.json...");
        const pathToJson = path.resolve(path.join(__dirname, "..", "src", "version.json"));
        console.log("Path to version.json: ", pathToJson);
        const json = JSON.stringify({ version }, null, 2);
        await fs.writeFile(pathToJson, json);
        console.log("version.json updated successfully.");
        console.log("Done.");
    } catch (err) {
        console.error("Error updating version:", err);
        process.exit(1);
    }
})();
