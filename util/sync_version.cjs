#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ASSEMBLY_INFO_FILES = [
  path.resolve(__dirname, '..', 'plugin/CactbotEventSource/Properties/AssemblyInfo.cs'),
  path.resolve(__dirname, '..', 'plugin/CactbotOverlay/Properties/AssemblyInfo.cs'),
];
const ASSEMBLY_VERSION_REGEX = /(?<=Assembly(File)?Version)\(".*"\)/gm;

const packageJson = require('../package.json');
const version = packageJson.version;

ASSEMBLY_INFO_FILES.forEach((filePath) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const newData = data.replace(ASSEMBLY_VERSION_REGEX, `("${version}.0")`);

    fs.writeFile(filePath, newData, 'utf8', (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });
});
