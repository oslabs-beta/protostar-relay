import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreDisplayer from '../src/devtools/view/StoreDisplayer';

configure({ adapter: new Adapter() });

describe('StoreDisplayer', () => {

  let wrapper;
  const store = { "hi": "there" }

  beforeAll(() => {
    wrapper = shallow(<StoreDisplayer store={store} />);
  });

  it("Has a reset button", () => {
    wrapper.find('button').simulate('click');
    expect(wrapper.find('Record').props()).toEqual(store)
  })

});