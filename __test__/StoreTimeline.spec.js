import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreTimeline from '../src/devtools/view/StoreTimeline';

configure({ adapter: new Adapter() });

describe('StoreTimeline', () => {
  let wrapper;
  const props = {}

  beforeAll(() => {
    wrapper = shallow(<StoreTimeline {...props} />);
  });

  it("My Test Case", () => {
    expect(true).toEqual(true);
  });

});