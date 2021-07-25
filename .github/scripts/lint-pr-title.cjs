/**
 * This Script can be tested locally with
 *
 * export GH_TOKEN=**** GITHUB_REPOSITORY=quisquous/cactbot PR_NUMBER=$NUM
 * node ./.github/scripts/lint-pr-title.cjs
 */
'use strict';

const github = require('@actions/github');

const botName = 'cactbotbot';

const maxLength = 60;

const boolToEmoji = (bool) => bool ? '✅' : '❌';

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
  'raidemulator',

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

const validPrefix = [
  '[WIP]',
  '[wip]',
  '!', // means `BREAKING CHANGE!`
];

const thanksComment = (userName) => {
  let userStr = '';
  if (userName)
    userStr = `@${userName} `;
  return `${userStr}Thanks for your contribution! 🌵🚀`;
};

const getComment = (title, userName, formatValid, lengthValid) => `${thanksComment(userName)}

Currently your title is: \`${title}\`, but it should:
* ${boolToEmoji(formatValid)} be in the format of \`scope: description\`.
* ${boolToEmoji(lengthValid)} have at most ${maxLength} characters.

<details>
<summary>More Information</summary>

\`scope\` can be any of the following:
${[...validScope].sort().map((s) => `- \`${s}\``).join('\n')}

Multiple scopes can be combined with slashes if needed, e.g. \`raidboss/oopsy\`.

Valid Title Examples:
- \`i18n: translating a bunch of new stuff\`
- \`raidboss: fix bug in New Ultimate Fight\`
- \`plugin: update Bozja CE code for patch 6.34\`
- \`lint: change @typescript/irritating-lint warning\`
- \`raidboss/oopsy: support shiny new dungeon\`

Drafts can also use \`[wip]\` as a prefix to show that they are a "work in progress", e.g. \`[wip] plugin: refactoring everything\`.

Breaking changes can use \`!\` as a prefix to mark a breaking change, e.g. \`!plugin: change all the apis\`.

</details>

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
  const m = /^(?<prefix>(?:[\w\[\]]*\s+)!?)?(?<scope>[\w\/]+):\s?.+$/.exec(title);
  const lengthValid = title.length <= maxLength;
  let formatValid = false;

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    'issue_number': pullNumber,
  });

  if (m && m.groups) {
    const groups = m.groups;
    console.log(`Matches: scope: ${groups.scope}, prefix: ${groups.prefix}`);

    const scopes = groups.scope.split('/');
    const scopeValid = scopes.every((scope) => validScope.includes(scope));
    const prefixValid = !groups.prefix || validPrefix.includes(groups.prefix.trim());
    formatValid = scopeValid && prefixValid;
  } else {
    console.error('PR title did not match.');
  }

  const myComment = comments.find(({ user }) => user?.login === botName);

  if (formatValid && lengthValid) {
    if (myComment) {
      console.error('PR title good, updating comment.');
      await octokit.rest.issues.updateComment({
        owner,
        repo,
        'comment_id': myComment.id,
        'body': thanksComment(userName),
      });
    } else {
      console.error('PR title good, no comment to update.');
    }
    return true;
  }

  const bodyText = getComment(title, userName, formatValid, lengthValid);
  console.error(`Comment text:\n--snip--\n${bodyText}\n--snip--\n`);

  if (myComment) {
    console.error('PR title still incorrect, updating existing comment.');
    console.error('PR title good, updating comment.');
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      'comment_id': myComment.id,
      'body': bodyText,
    });
  } else {
    console.error('PR title incorrect, creating comment.');
    await octokit.rest.issues.createComment({
      owner,
      repo,
      'issue_number': pullNumber,
      'body': bodyText,
    });
  }

  return false;
};

const run = async () => {
  const owner = github.context.repo.owner;
  const repo = github.context.repo.repo;
  const pullNumber = parseInt(process.env.PR_NUMBER, 10);

  const octokit = github.getOctokit(process.env.GH_TOKEN);

  const result = await checkTitle(octokit, owner, repo, pullNumber);
  process.exit(result ? 0 : 2);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
