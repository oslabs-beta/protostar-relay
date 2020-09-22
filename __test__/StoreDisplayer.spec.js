import React from 'react';
import { configure, shallow, render, mount } from 'enzyme';
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
    wrapper = shallow(
      <StoreDisplayer
        store={store}
      />
    );

    parent = wrapper.children().first();
    button = parent.find("button");
  });

  it('Has an input field with an onchange method', () => {
    expect(parent.find('input[type="text"]').length).toEqual(1);
    expect(wrapper.find("input").prop("onChange")).not.toEqual(undefined);
  });

  it("Has a Record component with the filtered records passed as props", () => {

  })

  it("Has a reset button that removes any selectors", () => {
    wrapper.find('button').simulate('click');
    expect(wrapper.find('Record').props()).toEqual(store)
  })
  
  it('Has one button with text label "Reset" ', () => {
    expect(button).toHaveLength(1);
    expect(button.text()).toEqual("Reset");
  });

  it('Reset button has the following class names: "button", "is-small", "is-link" ', () => {
    expect(button.hasClass("button")).toEqual(true);
    expect(button.hasClass("is-small")).toEqual(true);
    expect(button.hasClass("is-link")).toEqual(true);
  });

  it('Store Displayer parent container is a div tag', () => {
    expect(parent.type()).toEqual("div");
    expect(parent.hasClass("column")).toEqual(true);
  });

  it('The Aside html element has two child elements. A "p" tag with the label "Record List" and a "ul" tag', () => {
    const rootChildren = parent.children().last();
    expect(rootChildren.type()).toEqual('aside');
    expect(rootChildren.children().length).toEqual(2);

    //p tag tests
    expect(rootChildren.children().first().type()).toEqual('p');
    expect(rootChildren.children().first().hasClass('menu-label')).toEqual(true);
    expect(rootChildren.children().first().text()).toEqual('Record List');

    //ul tag tests
    expect(rootChildren.children().last().type()).toEqual('ul');
    expect(rootChildren.children().last().hasClass('menu-list')).toEqual(true);
  });

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