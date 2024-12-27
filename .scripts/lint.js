/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable no-debugger */
/* eslint-disable no-undef */
'use strict';

/**
 *
 * @returns {Promise<number>} - Promise that resolves to 0 "success" if linting passes, "error" otherwise
 */
async function executeLint() {
    return new Promise((resolve, reject) => {
        const npmCommand = /^win/.test(process.platform) ? 'npm.cmd' : 'npm';

        const lint = require('child_process').spawn(
            npmCommand,
            ['run', 'lint'],
            {
                stdio: 'inherit',
            },
        );

        lint.on('close', (code) => {
            resolve(code);
        });

        lint.on('error', (error) => {
            reject(error);
        });
    });
}

module.exports = {
    executeLint: executeLint,
};
