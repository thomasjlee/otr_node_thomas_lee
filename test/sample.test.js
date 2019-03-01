import { expect } from 'chai';
import itWorks from '../src/it-works'

describe('it works', () => {
  it('works', () => {
    expect(itWorks()).to.eql('foo');
  });
});
