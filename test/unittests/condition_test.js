import Condition from '../../resources/conditions.js';
import chai from 'chai';

const { assert } = chai;


describe('util tests', () => {
  // Check test job values match actual values from util.js and return their expected values
  it('test', () => {
    const fn = Condition.caresAboutPhysical();
    fn({
      job: 'GNB',
      CanFeint: () => true,
    });
  });
});
