// A Node.js script to help you sync your local project with Firebase Studio.
//
// HOW TO USE:
// 1. Save this file as `create-sync-script.js` in the ROOT of your LOCAL project folder.
// 2. Open your local terminal (like Git Bash, PowerShell, or VS Code's terminal).
// 3. Make sure you are in your project's root directory.
// 4. Run the script by typing: node create-sync-script.js
// 5. This will create a new file named `sync-for-studio.xml`.
// 6. Open `sync-for-studio.xml`, copy its entire content, and paste it into the chat with the App Prototyper.
//

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

// --- Configuration ---
const includePaths = [
    'src',
    'public',
    'package.json',
    'package-lock.json',
    'next.config.ts',
    'tailwind.config.ts',
    'tsconfig.json',
    'components.json',
    '.env.local',
    'README.md',
    'HOW_TO_DEPLOY.md',
    'DOCUMENTATION.md',
    'apphosting.yaml'
];

const excludePatterns = [
    'node_modules',
    '.next',
    '.git',
    'create-sync-script.js',
    'sync-for-studio.xml',
    '.vscode',
    'pull-from-github.sh',
    'push-to-github.sh'
];

function isExcluded(filePath) {
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    return excludePatterns.some(pattern => relativePath.startsWith(pattern));
}

function getAllFiles(dirPath, arrayOfFiles = []) {
    try {
        const files = fs.readdirSync(dirPath);

        files.forEach(function(file) {
            const fullPath = path.join(dirPath, file);

            if (isExcluded(fullPath)) {
                return;
            }

            if (fs.statSync(fullPath).isDirectory()) {
                arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
            } else {
                arrayOfFiles.push(fullPath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }

    return arrayOfFiles;
}

function generateSyncXml() {
    console.log('Starting to scan project files based on your configuration...');
    let allFiles = [];

    includePaths.forEach(p => {
        const fullPath = path.join(projectRoot, p);
        if (!fs.existsSync(fullPath)) {
            console.warn(`Warning: Path '${p}' not found in your local project. Skipping.`);
            return;
        }
        if (fs.statSync(fullPath).isDirectory()) {
            allFiles.push(...getAllFiles(fullPath));
        } else {
            if (!isExcluded(fullPath)) {
                allFiles.push(fullPath);
            }
        }
    });

    allFiles = [...new Set(allFiles)];

    console.log(`Found ${allFiles.length} files to sync.`);
    if (allFiles.length === 0) {
        console.error("\nError: No files were found to sync. Please check your `includePaths` configuration in the script.");
        return;
    }

    let xmlContent = '<changes>\n';
    xmlContent += '  <description>Sync all project files from local environment using the sync script.</description>\n';

    allFiles.forEach(filePath => {
        try {
            const relativePath = '/' + path.relative(projectRoot, filePath).replace(/\\/g, '/');
            const fileContent = fs.readFileSync(filePath, 'utf8');

            // Safely handle ]]>
            const cdataSafeContent = fileContent.split(']]>').join(']]]]><![CDATA[]>');

            xmlContent += '  <change>\n';
            xmlContent += `    <file>${relativePath}</file>\n`;
            xmlContent += `    <content><![CDATA[${cdataSafeContent}]]></content>\n`;
            xmlContent += '  </change>\n';
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
        }
    });

    xmlContent += '</changes>\n';

    const outputFilePath = path.join(projectRoot, 'sync-for-studio.xml');
    try {
        fs.writeFileSync(outputFilePath, xmlContent);
        console.log('\n✅ Success!');
        console.log(`Script has finished. The XML has been saved to: ${outputFilePath}`);
        console.log('\nNext Step: Open `sync-for-studio.xml`, copy its contents, and paste it into the Firebase Studio chat.');
    } catch (error) {
        console.error(`\nError writing the final XML file to ${outputFilePath}:`, error);
    }
}

generateSyncXml();
