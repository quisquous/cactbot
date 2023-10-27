import { TestMochaGlobal } from '../test_data_files';

import testOopsyFiles from './test_oopsy';
import testTimelineFiles from './test_timeline';
import testTriggerFiles from './test_trigger';

// This file is added to mocha by test_data_files.ts when Mocha is being
// run programmatically.  This makes it possible for lint-staged to run
// tests on individual files via `node test_data_files.ts filename`.
//
// In the case of normal Mocha execution that finds all the files in test/
// and runs them, this file will not be run.  Instead, test_data_files.ts
// will call these test functions below itself.

const annotatedGlobal: TestMochaGlobal = global;

testTriggerFiles(annotatedGlobal.triggerFiles ?? []);
testTimelineFiles(annotatedGlobal.timelineFiles ?? []);
testOopsyFiles(annotatedGlobal.oopsyFiles ?? []);
