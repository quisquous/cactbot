/**
 * This Script can be tested locally with
 *
 * export GH_TOKEN=**** GITHUB_REPOSITORY=quisquous/cactbot PR_NUMBER=$NUM
 * node ./.github/scripts/lint-pr-title.cjs
 */
'use strict';

const github = require('@actions/github');
const levenshtein = require('fast-levenshtein');

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

const getScopeSuggestion = (prefix, originalScope, description) => {
  // We could attempt to look at every combination, but I think that'd be inefficient
  // and unhelpful.  "raidboss/oopsy" is the most common multiple scope, so just use that.
  const scopes = [...validScope, 'raidboss/oopsy'];

  // Find valid scope with minimum Levenshtein distance to the provided originalScope.
  let bestScope = 'raidboss';
  let bestDistance = Number.MAX_VALUE;
  for (const scope of scopes) {
    const distance = levenshtein.get(scope, originalScope);
    if (distance >= bestDistance)
      continue;
    bestScope = scope;
    bestDistance = distance;
  }

  return `${prefix ?? ''}${bestScope}: ${description}`;
};

const getDefaultScopeSuggestion = (description) => {
  const defaultScope = 'raidboss';
  return `${defaultScope}: ${description}`;
};

const getLengthSuggestion = (text) => {
  const words = text.split(' ');

  // Split at word boundaries.
  let str = words.shift();
  for (const word of words) {
    const text = `${str} ${word}`;
    if (text.length > maxLength)
      return str;
    str = text;
  }
  return str;
};

const thanksComment = (userName) => {
  let userStr = '';
  if (userName)
    userStr = `@${userName} `;
  return `${userStr}Thanks for your contribution! 🌵🚀`;
};

const getComment = (p) =>
  `${thanksComment(p.userName)}

Currently your title is: \`${p.title}\`, but it should:
* ${boolToEmoji(p.formatValid)} be in the format of \`scope: description\`.
* ${boolToEmoji(p.lengthValid)} have at most ${maxLength} characters.

Did you mean: \`${p.suggestion}\`

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
  const m = /^(?<prefix>(?:[\w\[\]]*\s+)!?)?(?<scope>[^:]+): (?<description>.+)$/.exec(title);
  const lengthValid = title.length <= maxLength;
  let formatValid = false;

  const { data: comments } = await octokit.rest.issues.listComments({
    owner,
    repo,
    'issue_number': pullNumber,
  });

  let suggestion = title;

  if (m && m.groups) {
    const groups = m.groups;
    console.log(`Matches: scope: ${groups.scope}, prefix: ${groups.prefix}`);

    const scopes = groups.scope.split('/');
    const scopeValid = scopes.every((scope) => validScope.includes(scope));
    const prefixValid = !groups.prefix || validPrefix.includes(groups.prefix.trim());
    formatValid = scopeValid && prefixValid;

    if (!formatValid) {
      // Prefix can match part of scope, so if the prefix didn't match consider it
      // to be part of the scope.
      const prefix = prefixValid ? groups.prefix : undefined;
      const scope = prefixValid ? groups.scope : `${groups.prefix}${groups.scope}`;
      suggestion = getScopeSuggestion(prefix, scope, groups.description);
    }
  } else {
    console.error('PR title did not match.');
    suggestion = getDefaultScopeSuggestion(title);
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

  // The scope suggestion might make the title too long.
  if (suggestion.length > maxLength)
    suggestion = getLengthSuggestion(suggestion);

  const bodyText = getComment({
    title: title,
    userName: userName,
    formatValid: formatValid,
    lengthValid: lengthValid,
    suggestion: suggestion,
  });
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
