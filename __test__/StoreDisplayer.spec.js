import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreDisplayer from '../src/devtools/view/StoreDisplayer';

configure({ adapter: new Adapter() });

describe('StoreDisplayer', () => {

  let wrapper;
  const store = {
    '1': {
      '__id': '1',
      '__typename': 'User',
      'name': 'Marc'
    },
    '2': {
      '__id': '2',
      '__typename': 'User',
      'name': 'Aryeh'
    },
    '3': {
      '__id': '3',
      '__typename': 'User',
      'name': 'Liz'
    },
    '4': {
      '__id': '4',
      '__typename': 'User',
      'name': 'Qwen'
    },
    '5': {
      '__id': '5',
      '__typename': 'Post',
      'text': 'Hi'
    }
  }


  beforeAll(() => {
    wrapper = shallow(<StoreDisplayer store={store} />);
  });

  it("Has a Record component with the filtered records passed as props", () => {

  })

  it("Has a reset button that removes any selectors", () => {
    wrapper.find('button').simulate('click');
    expect(wrapper.find('Record').props()).toEqual(store)
  })

  it("Generates a list of menu items from the store object", () => {
    const menu = wrapper.find('.menu');
    expect(menu.length).toEqual(1)
  })

  it("Has menu items with an onClick event that filters the results displayed on the screen based on ID", () => {

  })

  it("Has menu items with an onClick event that filters the results displayed on the screen based on type", () => {

  })

  it("Adds an 'is-active' class when a menu item is selected", () => {

  })

  it("Removes the 'is-active' class when another menu item is selected", () => {

  })

  it("Removes the 'is-active' class when the reset button is clicked", () => {

  })

  it("Has a reset button that removes any selectors", () => {

  })

  it("Has a search box that filters the menu items", () => {

  })

  it("Has a search box that filters the records items", () => {

  })

  it("Has a search box with a debounced input", () => {

  })

  it('Renders correctly', () => {
    const tree = renderer.create(<StoreDisplayer store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  })

});