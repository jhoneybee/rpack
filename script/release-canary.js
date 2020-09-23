const { execSync } = require("child_process");
const { join } = require('path')
const { writeFileSync } = require('fs');

console.log(PR_TITLE)
if (/release:\s+.*/.test(PR_TITLE)) {
    const version = PR_TITLE.replace(/release:\s+/i, '').trim()
    reactUIPackages.version = version
    writeFileSync(join(__dirname, '..', 'packages', 'react-ui', 'package.json'), JSON.stringify(reactUIPackages))
    execSync(`cd ./packages/react-ui/ && npm publish`)
    execSync(`git commit -m '${version}'`)
    execSync(`git push`)
    execSync('cd packages/react-ui && npm install && npm publish --access public --tag canary')
}
