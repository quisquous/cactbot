/**
 * This Script can be tested locally with
 *
 * export GH_TOKEN=**** GITHUB_REPOSITORY=quisquous/cactbot PR_NUMBER=$NUM
 * node ./.github/scripts/lint-pr-title.cjs
 */
'use strict';

const github = require('@actions/github');

const botName = 'cactbotbot';

const validScope = [
  // UI Module Scopes
  'config',
  'dps',
  'eureka',
  'fisher',
  'jobs',
  'oopsy',
  'pullcounter',
  'radar',
  'raidboss',
  'raidemulater',

  // Other Scopes
  'build', // changes to webpack or TypeScript/babel toolchain
  'ci', // changes in .github/
  'docs', // documentation anywhere
  'i18n', // translations anywhere
  'lint', // eslint changes
  'plugin', // code in plugin/
  'resources', // code in resources/
  'test', // code in test/ or ui/test/
  'util', // code in util/
];

const validNonScope = [
  '[WIP]',
  '[wip]',
  '!', // means `BREAKING CHANGE!`
];

const thanksComment = (userName) => {
  let userStr = '';
  if (userName)
    userStr = `@${userName} `;
  return `${userStr}Thanks for your contribution!🚀`;
};

const getComment = (title, userName) => `${thanksComment(userName)}

Currently your title is: ${title},
but it should be in the format of \`(nonscope) scope: description\`.

\`scope\` can be any of the following:
${validScope.map((s) => `  - ${s}`).join('\n')}

\`nonscope\` can be any of the following (although this is not always required):
${validNonScope.map((s) => `  - ${s}`).join('\n')}

------
This comment is created and updated by a bot.
`;

/**
 * @param {ReturnType<typeof import("@actions/github").getOctokit>} octokit
 * @param {string} owner
 * @param {string} repo
 * @param {number} pullNumber
 * @return {Promise<boolean>}
 */
const checkTitle = async (octokit, owner, repo, pullNumber) => {
  const { data: pullRequest } = await octokit.rest.pulls.get({
    owner,
    repo,
    'pull_number': pullNumber,
  });
  const { title, user } = pullRequest;
  const userName = user?.login;
  const m = /^((?<nonscope>[\w!\[\]]*)\s*)?\b(?<scope>\w+):\s?.+$/.test(title);

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    'issue_number': pullNumber,
  });

  const myComment = comments.find(({ user }) => user?.login === botName);

  if (m) {
    if (validScope.includes(m.scope) && validNonScope.includes(m.nonscope)) {
      if (myComment) {
        await octokit.rest.issues.updateComment({
          owner,
          repo,
          'comment_id': myComment.id,
          'body': thanksComment(userName),
        });
      }
      return true;
    }
  }

  if (myComment)
    return false;

  await octokit.rest.issues.createComment({
    owner,
    repo,
    'issue_number': pullNumber,
    'body': getComment(title),
  });

  return false;
};

const run = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = parseInt(process.env.PR_NUMBER, 10);

  const octokit = github.getOctokit(process.env.GH_TOKEN);

  await checkTitle(octokit, owner, repo, pullNumber);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
