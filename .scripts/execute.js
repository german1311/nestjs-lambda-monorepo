#!/usr/bin/env node
/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
var testAged = require('./testaged-coverage');
var lint = require('./lint');

(async function () {
    const lintCode = await lint.executeLint();
    if (lintCode !== 0) {
        process.exit(1);
    }

    await testAged.executeTests();
})();
