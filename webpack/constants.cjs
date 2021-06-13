'use strict';

const cactbotModules = {
  config: 'ui/config/config',
  coverage: 'util/coverage/coverage',
  rdmty: 'ui/dps/rdmty/dps',
  xephero: 'ui/dps/xephero/xephero',
  eureka: 'ui/eureka/eureka',
  fisher: 'ui/fisher/fisher',
  jobs: 'ui/jobs/jobs',
  oopsyraidsyLive: 'ui/oopsyraidsy/oopsy_live',
  oopsyraidsySummary: 'ui/oopsyraidsy/oopsy_summary',
  pullcounter: 'ui/pullcounter/pullcounter',
  radar: 'ui/radar/radar',
  raidboss: 'ui/raidboss/raidboss',
  raidemulator: 'ui/raidboss/raidemulator',
  test: 'ui/test/test',
};

const cactbotChunks = {
  raidbossData: 'ui/common/raidboss_data',
  oopsyraidsyData: 'ui/common/oopsyraidsy_data',
};

const cactbotHtmlChunksMap = {
  'ui/config/config.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotChunks.oopsyraidsyData,
      cactbotModules.config,
    ],
  },
  'util/coverage/coverage.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotChunks.oopsyraidsyData,
      cactbotModules.coverage,
    ],
  },
  'ui/dps/rdmty/dps.html': {
    chunks: [
      cactbotModules.rdmty,
    ],
  },
  'ui/dps/xephero/xephero-cactbot.html': {
    chunks: [
      cactbotModules.xephero,
    ],
  },
  'ui/eureka/eureka.html': {
    chunks: [
      cactbotModules.eureka,
    ],
  },
  'ui/fisher/fisher.html': {
    chunks: [
      cactbotModules.fisher,
    ],
  },
  'ui/jobs/jobs.html': {
    chunks: [
      cactbotModules.jobs,
    ],
  },
  'ui/oopsyraidsy/oopsy_summary.html': {
    chunks: [
      cactbotChunks.oopsyraidsyData,
      cactbotModules.oopsyraidsySummary,
    ],
  },
  'ui/oopsyraidsy/oopsyraidsy.html': {
    chunks: [
      cactbotChunks.oopsyraidsyData,
      cactbotModules.oopsyraidsyLive,
    ],
  },
  'ui/pullcounter/pullcounter.html': {
    chunks: [
      cactbotModules.pullcounter,
    ],
  },
  'ui/radar/radar.html': {
    chunks: [
      cactbotModules.radar,
    ],
  },
  'ui/raidboss/raidboss.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotModules.raidboss,
    ],
  },
  'ui/raidboss/raidemulator.html': {
    chunks: [
      cactbotChunks.raidbossData,
      cactbotModules.raidemulator,
    ],
  },
  'ui/test/test.html': {
    chunks: [
      cactbotModules.test,
    ],
  },
};

module.exports = {
  cactbotModules,
  cactbotChunks,
  cactbotHtmlChunksMap,
};
