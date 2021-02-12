import util from '../../resources/util';

test('PLD is tank', () => {
  expect(util.jobToRole('PLD')).toBe('tank');
});

test('job to role map works', () => {
  expect(util.jobToRoleMap.get('PLD')).toBe('tank');
});
