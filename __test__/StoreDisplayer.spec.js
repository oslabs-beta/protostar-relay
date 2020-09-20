import React from 'react';
import { configure, shallow, render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreDisplayer from '../src/devtools/view/StoreDisplayer';

configure({ adapter: new Adapter() });

describe('StoreDisplayer', () => {
   let wrapper;
   let children;
   let parent;
   let button;
  const store = { "hi": "there" }
  const testState = { search: '' }

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

  //============================================
  //Search Result still needs to be updated.
  //============================================
  // it('Input field updates the state', () => {
  //   expect(wrapper.find('input'))
  // });

  it('Has a reset button', () => {
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

});