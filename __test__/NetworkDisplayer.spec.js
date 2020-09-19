import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import NetworkDisplayer from '../src/devtools/view/NetworkDisplayer';

configure({ adapter: new Adapter() });

xdescribe('NetworkDisplayer', () => {
  let wrapper;
  const props = {}

  beforeAll(() => {
    wrapper = shallow(<NetworkDisplayer {...props} />);
  });

  it("My Test Case", () => {
    expect(true).toEqual(true);
  });

});