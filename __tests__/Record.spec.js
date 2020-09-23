import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';

import renderer from 'react-test-renderer';

import Record from '../src/devtools/view/Components/Record';

configure({ adapter: new Adapter() });

describe('Record', () => {
  let wrapper;
  let children; //alternative to .next, not always required.
  const props = { //hardcode in what to pass into component
    "hi": true,
    "nested": { "this": "that" }
  }

  beforeAll(() => {
    wrapper = shallow(<Record {...props} />);
    children = wrapper.children()
  });

  it('Renders a <div> tag with a className of "records"', () => { //we are using methods from enzyme library so look at the docs
    expect(wrapper.type()).toEqual('div');
    expect(wrapper.hasClass('records')).toEqual(true);
  });

  it('Has two children divs: one with className objectProperty and the other with className nestedObject', () => {
    expect(children.length).toEqual(2);
    expect(children.first().hasClass('objectProperty')).toEqual(true);
    expect(children.last().hasClass('nestedObject')).toEqual(true);
  })

  it('Has a object property child with two spans, first has class of key and second has class of value. And has text values for the key and stringifies boolean values.', () => {
    const rootChildren = children.first().children();
    expect(rootChildren.length).toEqual(2);
    expect(rootChildren.first().hasClass('key')).toEqual(true);
    expect(rootChildren.first().text()).toEqual('hi: ');
    expect(rootChildren.last().hasClass('value')).toEqual(true);
    expect(rootChildren.last().text()).toEqual('true');
  })

  it('has a nested object child that has a span with class of key and a div with class of records. It also has a first child that has text of "nested: "', () => {
    const rootChildren = children.last().children();
    expect(rootChildren.first().text()).toEqual('nested: ');
    expect(rootChildren.length).toEqual(2);
    expect(rootChildren.first().hasClass('key')).toEqual(true);
    expect(rootChildren.last().find(Record).length).toEqual(1)
  })
});