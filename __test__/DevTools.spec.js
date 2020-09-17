import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import DevTools from '../src/devtools/DevTools';
import Store from '../src/devtools/store';

configure({ adapter: new Adapter() });

describe('DevTools', () => {
  let wrapper;
  const props = {
    store: {
      getEnvironmentIDs: () => [1],
      getEnvironmentName: (id) => id
    }
  }

  beforeAll(() => {
    wrapper = shallow(<DevTools {...props} />);
  });

  it("My Test Case", () => {
    expect(true).toEqual(true);
  });

});