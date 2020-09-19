import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreDisplayer from '../src/devtools/view/StoreDisplayer';

configure({ adapter: new Adapter() });

xdescribe('StoreDisplayer', () => {
  let wrapper;
  const props = {}

  beforeAll(() => {
    wrapper = shallow(<StoreDisplayer {...props} />);
  });

  it("My Test Case", () => {
    expect(true).toEqual(true);
  });

});