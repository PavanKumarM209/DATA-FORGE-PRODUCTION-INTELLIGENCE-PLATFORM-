import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

function checkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory() && f !== 'node_modules') {
            checkDir(full);
        } else if (f.endsWith('.js')) {
            try {
                execSync(`node --check "${full}"`, { stdio: 'ignore' });
            } catch (e) {
                console.log("SYNTAX ERROR IN:", full);
            }
        }
    }
}
checkDir('.'); 
