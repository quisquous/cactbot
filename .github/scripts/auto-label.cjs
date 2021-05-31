'use strict';
const path = require('path');

const babelParser = require('recast/parsers/babel');
const json5 = require('json5');
const lodash = require('lodash');
const recast = require('recast');
const github = require('@actions/github');
const { HttpClient } = require('@actions/http-client');

const prefixLabelMap = {
  'resources/': 'resources',
  'util/': 'util',
  'test/': 'test',
  '.mocharc.cjs': 'test',
  'eslint/': 'style',
  '.eslintrc.js': 'style',
  '.github/workflows/': 'ci',
  '.github/scripts/': 'ci',
  'ui/config/': 'config',
  'ui/dps/': 'dps',
  'ui/eureka/': 'eureka',
  'ui/fisher/': 'fishing🎣',
  'ui/jobs/': 'jobs',
  'ui/oopsyraidsy/': 'oopsy',
  'ui/pullcounter/': 'pullcounter',
  'ui/radar/': 'radar',
  'ui/raidboss/': 'raidboss',
  'ui/test/': 'test',
};

const getLabels = async (github, owner, repo, pullNumber) => {
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
    fromSha = getPRBaseCommit(github, prIdentifier).sha;
    toSha = pullRequest.head.sha;
  }

  const changedFilesContent = await Promise.all(changedFiles.map((f) => async () => {
    const from = await httpClient.get(rawUrl(owner, repo, fromSha, f.filename));
    const to = await httpClient.get(rawUrl(owner, repo, toSha, f.filename));
    return {
      filepath: f.filename,
      from: await from.readBody(),
      to: await to.readBody(),
    };
  }).map((f) => f()));

  const changedLang = getTimelineReplaceChanges(changedFilesContent);
  console.log(`changed timelineReplace ${changedLang}`);
  changedLang.push(...nonNullUnique(lodash.flatten(changedFiles.map((f) => {
    if (['.js', '.ts'].includes(path.extname(f.filename)))
      return parseChangedLang(f.patch);
  }))));

  // by file path
  const changedModule = nonNullUnique(changedFiles.map((f) => {
    for (const [prefix, label] of Object.entries(prefixLabelMap)) {
      if (f.filename.startsWith(prefix))
        return label;
    }
  }));

  return [...changedModule, ...changedLang.map((v) => `💬${v.toUpperCase()}`)];
};

const getPRBaseCommit = async (github, identifier) => {
  const listFilesOptions = github.rest.pulls.listCommits.endpoint.merge(identifier);
  const commits = await github.paginate(listFilesOptions);
  return commits[0].parents[0];
};

const getChangedFiles = async (github, identifier) => {
  const listFilesOptions = github.rest.pulls.listFiles.endpoint.merge(identifier);
  return await github.paginate(listFilesOptions);
};

const parseChangedLang = (patch) => {
  const set = new Set();
  for (const lang of ['cn', 'de', 'ja', 'fr']) {
    const pattern = new RegExp(`^\s*[+].*(?:${lang}|'${lang}'): `);
    for (const line of patch.split('\n')) {
      if (pattern.test(line))
        set.add(lang);
    }
  }
  return Array.from(set.values());
};

const nonNullUnique = (s) => {
  return lodash.uniq(s).filter(Boolean);
};

const rawUrl = (owner, repo, sha, path) => {
  return `https://github.com/${owner}/${repo}/raw/${sha}/${path}`;
};

const getTimelineReplaceChanges = (changedFiles) => {
  const s = new Set();

  changedFiles.forEach((file) => {
    if (!file.filepath.startsWith('ui/raidboss/data/'))
      return;

    if (path.extname(file.filepath) === '.js') {
      const from = getTimelineReplace(file.from);
      const to = getTimelineReplace(file.to);
      for (const lang of lodash.uniq([...Object.keys(from), ...Object.keys(to)])) {
        if (!lodash.isEqual(from[lang], to[lang]))
          s.add(lang);
      }
    }
  });
  return Array.from(s.values());
};

const getTimelineReplace = (fileContent) => {
  const ast = recast.parse(fileContent, {
    parser: babelParser,
  });

  const exportDefault = ast.program.body.filter((body) => body.type === 'ExportDefaultDeclaration')[0];
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

const run = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = process.env.PR_NUMBER;

  const octokit = github.getOctokit(process.env.GH_TOKEN);

  const labels = await getLabels(octokit, owner, repo, pullNumber);
  if (labels && labels.length) {
    console.log(`set ${labels}`);
    const res = await octokit.request(`PUT /repos/${owner}/${repo}/issues/${pullNumber}/labels`, { labels });
    if (res.status !== 200)
      console.log(res);
  }
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
