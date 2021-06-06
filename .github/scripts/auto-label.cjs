/**
 * This Script can be tested locally with
 *
 * export GH_TOKEN=**** GITHUB_REPOSITORY=quisquous/cactbot PR_NUMBER=$NUM
 * node ./.github/scripts/auto-label.cjs
 */
'use strict';
const path = require('path');

const json5 = require('json5');
const lodash = require('lodash');
const recast = require('recast');
const github = require('@actions/github');
const babelParser = require('recast/parsers/babel');
const { HttpClient } = require('@actions/http-client');

const langToLabel = (lang) => `💬${lang}`;

// Only the first match applies.
const regexLabelMap = {
  '^docs/ko-KR/': ['docs', langToLabel('ko')],
  '^docs/zh-CN/': ['docs', langToLabel('cn')],
  '^docs/zh-TW/': ['docs', langToLabel('cn')],
  '.*\\.md$': ['docs'],
  '^docs/': ['docs'],
  '^screenshots/': ['docs'],
  '^resources/': ['resources'],
  '^util/': ['util'],
  '^test/': ['test'],
  '^\\.mocharc.cjs$': ['test'],
  '^eslint/': ['style'],
  '^\\.eslintrc\\.js$': ['style'],
  '^\\.github/workflows/': ['ci'],
  '^\\.github/scripts/': ['ci'],
  '^plugin/': ['plugin'],
  '^ui/config/': ['config'],
  '^ui/eureka/eureka_config': ['config', 'eureka'],
  '^ui/jobs/jobs_config': ['config', 'jobs'],
  '^ui/oopsyraidsy/oopsyraidsy_config': ['config', 'oopsy'],
  '^ui/radar/radar_config': ['config', 'radar'],
  '^ui/raidboss/raidboss_config': ['config', 'raidboss'],
  '^ui/dps/': ['dps'],
  '^ui/eureka/': ['eureka'],
  '^ui/fisher/': ['fishing🎣'],
  '^ui/jobs/': ['jobs'],
  '^ui/oopsyraidsy/': ['oopsy'],
  '^ui/pullcounter/': ['pullcounter'],
  '^ui/radar/': ['radar'],
  '^ui/test/': ['test'],
  '^ui/raidboss/raidemulator': ['raidemulator'],
  '^ui/raidboss/emulator': ['raidemulator'],
  // other raidboss change will match this, don't put this before raidemulator
  '^ui/raidboss/': ['raidboss'],
};

/**
 * @typedef {ReturnType<typeof import("@actions/github").getOctokit>} GitHub
 */

/**
 * @typedef {{ filename: string, patch: string }} File
 */

/**
 * @param {GitHub} github
 * @param {string} owner
 * @param {string} repo
 * @param {number} pullNumber
 * @returns {string[]}
 */
const getLabels = async (github, owner, repo, pullNumber) => {
  /**
   * @typedef {{ owner: string, repo: string, pull_number: number }} identifier
   */

  /**
   * @type identifier
   */
  const prIdentifier = { owner, repo, 'pull_number': pullNumber };
  const httpClient = new HttpClient();

  const { data: pullRequest } = await github.rest.pulls.get(prIdentifier);
  const changedFiles = await getChangedFiles(github, prIdentifier);

  // by file content
  let toSha;
  let fromSha;
  if (pullRequest.mergeable) {
    fromSha = pullRequest.base.sha;
    toSha = pullRequest.merge_commit_sha;
  } else {
    fromSha = (await getPRBaseCommit(github, prIdentifier)).sha;
    toSha = pullRequest.head.sha;
  }

  /**
   * @typedef {{ filename: string, from: string, to: string }} ChangedFileContent
   * @type {ChangedFileContent[]}
   */
  const changedFilesContent = await Promise.all(changedFiles.map((f) => async () => {
    const from = await httpClient.get(rawUrl(owner, repo, fromSha, f.filename),
    );
    const to = await httpClient.get(rawUrl(owner, repo, toSha, f.filename));
    return {
      filename: f.filename,
      from: await readBody(from),
      to: await readBody(to),
    };
  }).map((f) => f()));

  const changedLang = getTimelineReplaceChanges(changedFilesContent);
  changedLang.push(...nonNullUnique(lodash.flatten(changedFiles.map((f) => {
    if (['.js', '.ts'].includes(path.extname(f.filename)))
      return parseChangedLang(f.patch);
  }))));

  // by file path
  const changedModule = nonNullUnique(lodash.flatten(changedFiles.map((f) => {
    for (const [regexStr, labels] of Object.entries(regexLabelMap)) {
      const regex = new RegExp(regexStr);
      if (regex.exec(f.filename)) {
        for (const label of labels)
          console.log(`label: ${label} [filename] (${f.filename})`);
        return labels;
      }
    }
  })));

  return [...changedModule, ...changedLang.map((v) => langToLabel(v))];
};

/**
 * @param {GitHub} github
 * @param {identifier} identifier
 * @returns {Promise<{ sha: string }>}
 */
const getPRBaseCommit = async (github, identifier) => {
  const listFilesOptions = github.rest.pulls.listCommits.endpoint.merge(identifier);
  const commits = await github.paginate(listFilesOptions);
  return commits[0].parents[0];
};

/**
 * @param {GitHub} github
 * @param {identifier} identifier
 * @returns {Promise<File[]>}
 */
const getChangedFiles = async (github, identifier) => {
  const listFilesOptions = github.rest.pulls.listFiles.endpoint.merge(identifier);
  return await github.paginate(listFilesOptions);
};

/**
 * @param {string} patch
 */
const parseChangedLang = (patch) => {
  const set = new Set();
  for (const lang of ['cn', 'de', 'ja', 'fr', 'ko']) {
    const pattern = new RegExp(String.raw`^\+\s*(?:${lang}|'${lang}'): `);
    for (const line of patch.split('\n')) {
      if (pattern.test(line)) {
        // TODO: it'd be nice to add the file/line number here.
        if (!set.has(lang))
          console.log(`label: ${lang} [translation]`);
        set.add(lang);
      }
    }
  }
  return Array.from(set.values());
};

/**
 * @template T
 * @param {T[]} s
 * @returns {T[]}
 */
const nonNullUnique = (s) => {
  return lodash.uniq(s).filter(Boolean);
};

/**
 * @param {string} owner
 * @param {string} repo
 * @param {string} sha
 * @param {string} path
 */
const rawUrl = (owner, repo, sha, path) => {
  return `https://github.com/${owner}/${repo}/raw/${sha}/${path}`;
};

/**
 * @param {ChangedFileContent[]} changedFiles
 * @returns {string[]}
 */
const getTimelineReplaceChanges = (changedFiles) => {
  /**
   * @type {Set<string>}
   */
  const s = new Set();

  changedFiles.forEach((file) => {
    if (!file.filename.startsWith('ui/raidboss/data/'))
      return;

    if (path.extname(file.filename) === '.js') {
      const from = getTimelineReplace(file.from) || {};
      const to = getTimelineReplace(file.to) || {};
      for (const lang of lodash.uniq([...Object.keys(from), ...Object.keys(to)])) {
        if (!lodash.isEqual(from[lang], to[lang])) {
          console.log(`label: ${lang} [timelineReplace] (${file.filename})`);
          s.add(lang);
        }
      }
    }
  });
  return Array.from(s.values());
};

/**
 * @param {string} fileContent
 * @returns {undefined | Record<string, any>}
 */
const getTimelineReplace = (fileContent) => {
  const ast = recast.parse(fileContent, {
    parser: babelParser,
  });

  const exportDefault = ast.program.body
    .filter((body) => body.type === 'ExportDefaultDeclaration')[0];
  if (!exportDefault)
    return;

  const timelineReplace = exportDefault.declaration.properties
    .filter((prop) => prop.key.type === 'Identifier' && prop.key.name === 'timelineReplace')[0];
  if (!timelineReplace)
    return;

  const repl = json5.parse(recast.print(timelineReplace.value).code);
  const ret = {};
  repl.forEach((r) => {
    ret[r.locale] = r;
  });
  return ret;
};

const readBody = async (res) => {
  if (res.message.statusCode !== 404)
    return await res.readBody();
  return '';
};

const run = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = parseInt(process.env.PR_NUMBER, 10);

  const octokit = github.getOctokit(process.env.GH_TOKEN);

  const labels = await getLabels(octokit, owner, repo, pullNumber);
  if (labels && labels.length) {
    console.log(`apply: ${JSON.stringify(labels)}`);
    const res = await octokit.request(`PUT /repos/${owner}/${repo}/issues/${pullNumber}/labels`, { labels });
    if (res.status !== 200)
      console.log(res);
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
