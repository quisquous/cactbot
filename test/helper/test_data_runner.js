import testTimelineFiles from './test_timeline.js';

// This file is added to mocha by test_raidboss_data.js when Mocha is being
// run programatically.  This makes it possible for lint-staged to run
// tests on individual files via `node test_raidboss_data.js filename`.
//
// In the case of normal Mocha execution that finds all the files in test/
// and runs them, this file will not be run.  Instead, test_raidboss_data.js
// will call these test functions below itself.

testTimelineFiles(global.timelineFiles);
// TODO: also test manifests and triggers here.
