/**
 * This Script can be tested locally with
 *
 * export GH_TOKEN=**** GITHUB_REPOSITORY=quisquous/cactbot PR_NUMBER=$NUM
 * node ./.github/scripts/lint-pr-title.cjs
 */
'use strict';

const github = require('@actions/github');

const validScope = [
  'resources',
  'ui',
  'pullcounter',
  'raidboss',
  'raidemulater',
  'oopsy',
  'radar',
  'eureka',
  'jobs',
  'test',
  'util',
  'config',
  'lint',
  'build',
  'ci',
  'i18n',
];

const getComment = (title, userName) => `${userName ? '@' + userName : ''} Thanks for your contribution!🚀

Currently your title is: ${title},
but it should be in the format of \`scope: description\`.

\`scope\` can be any of the following:
${validScope.map((s) => `  - ${s}`).join('\n')}

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
  const m = /^(?:\!|\[WIP\])?(?<scope>\w+):\s?.+$/.test(title);

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    'issue_number': pullNumber,
  });

  const myComment = comments.find(({ user }) => user?.login === 'cactbotbot');

  if (m) {
    if (validScope.includes(m.scope)) {
      if (myComment) {
        await octokit.rest.issues.updateComment({
          owner,
          repo,
          'comment_id': myComment.id,
          'body': `${userName ? '@' + userName : ''} Thanks for your contribution!🚀`,
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
