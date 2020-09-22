import React from 'react';
import { configure, shallow, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import StoreDisplayer from '../src/devtools/view/StoreDisplayer';

configure({ adapter: new Adapter() });

describe('StoreDisplayer', () => {

  let wrapper;
  let useEffect;
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

  const mockUseEffect = () => {
    useEffect.mockImplementationOnce(f => f());
  };


  beforeEach(() => {
    useEffect = jest.spyOn(React, "useEffect");
    mockUseEffect();
    wrapper = shallow(<StoreDisplayer store={store} />);
  });

  it("Has a Record component with the filtered records passed as props", () => {
    expect(wrapper.find('Record').length).toEqual(1);
    expect(wrapper.find('Record').props()).toEqual(store);
  })

  it("Has a menu", () => {
    expect(wrapper.find('.menu').length).toEqual(1);
  })

  describe("Menu", () => {
    let menu;

    beforeEach(() => {
      menu = wrapper.find('.menu');
    })

    it("Generates a list of menu items from the store object", () => {
      expect(menu.find("#type-User").length).toEqual(1);
      expect(menu.find("#type-Post").length).toEqual(1);
      Object.keys(store).forEach(k => {
        expect(menu.find(`#id-${k}`).length).toEqual(1);
      })
    })

    it("Has menu items with an onClick event that filters the results displayed on the screen based on ID", () => {
      Object.keys(store).forEach(k => {
        menu.find(`#id-${k}`).simulate('click');
        expect(wrapper.find("Record").props()).toEqual({ [k]: store[k] })
      })
    })

    it("Has menu items with an onClick event that filters the results displayed on the screen based on type", () => {
      menu.find(`#type-User`).simulate('click');
      expect(wrapper.find("Record").props()).toEqual({
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
        }
      })
    })

    it("Adds an 'is-active' class to the currently selected menu item", () => {
      Object.keys(store).forEach(k => {
        let menuItem = wrapper.find(`#id-${k}`)
        expect(menuItem.length).toEqual(1)
        menuItem.props().onClick();
        menuItem = wrapper.find(`#id-${k}`)
        expect(menuItem.hasClass('is-active')).toEqual(true)
        expect(menuItem.hasClass('is-active')).toEqual(true)
        menu.find("a").forEach(el => {
          if (el !== menuItem) expect(el.hasClass('is-active')).toEqual(false)
        })
      })

      let menuItem = wrapper.find(`#type-User`)
      expect(menuItem.length).toEqual(1)
      menuItem.simulate('click');
      menuItem = wrapper.find(`#type-User`)
      expect(menuItem.hasClass('is-active')).toEqual(true)
      menu.find("a").forEach(el => {
        if (el !== menuItem) expect(el.hasClass('is-active')).toEqual(false)
      })
      menuItem = wrapper.find(`#type-Post`)
      expect(menuItem.length).toEqual(1)
      menuItem.simulate('click');
      menuItem = wrapper.find(`#type-Post`)
      expect(menuItem.hasClass('is-active')).toEqual(true)
      menu.find("a").forEach(el => {
        if (el !== menuItem) expect(el.hasClass('is-active')).toEqual(false)
      })
    })

    it("Removes the 'is-active' class when the reset button is clicked", () => {
      let menuItem = menu.find(`#type-User`)
      expect(menuItem.length).toEqual(1)
      menuItem.simulate('click');
      expect(wrapper.find('.menu').find(".is-active").length).toEqual(1);
      wrapper.find('button').simulate('click');
      expect(wrapper.find('.menu').find(".is-active").length).toEqual(0);
    })

    it('Has a search input with an onChange property', () => {
      expect(wrapper.find('input').length).toEqual(1);
      expect(wrapper.find('input').prop('onChange')).not.toBe(undefined);
    });

    describe('Search Box', () => {
      let search;

      beforeEach(() => {
        search = wrapper.find('input');
      })

      it("Filters the menu items", () => {
        search.prop('onChange')({ target: { value: 'Marc' } });
        jest.runAllTimers();
        expect(wrapper.find(`#id-1`).length).toEqual(1);
        Object.keys(store).forEach(k => {
          if (k !== '1') expect(wrapper.find(`#id-${k}`).length).toEqual(0);
        })
      })

      it("Debounces the input", () => {
        search.prop('onChange')({ target: { value: 'Marc' } });
        Object.keys(store).forEach(k => {
          if (k !== '1') expect(wrapper.find(`#id-${k}`).length).toEqual(1);
        })
        jest.runAllTimers();
        Object.keys(store).forEach(k => {
          if (k !== '1') expect(wrapper.find(`#id-${k}`).length).toEqual(0);
        })
      })
    });

    it('Has a Reset Button with an onClick property', () => {
      expect(wrapper.find('button').length).toEqual(1);
      expect(wrapper.find('button').prop('onClick')).not.toBe(undefined);
    });

    describe('Reset Button', () => {
      it("Has a reset button that removes any selectors", () => {
        menu.find(`#type-User`).simulate('click');
        expect(wrapper.find('Record').props()).not.toEqual(store)
        wrapper.find('button').simulate('click');
        expect(wrapper.find('Record').props()).toEqual(store)
      })
    });

  })

  it('Renders correctly', () => {
    const tree = renderer.create(<StoreDisplayer store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  })

});