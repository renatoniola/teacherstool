import React from 'react'
import { shallow, mount, render ,configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store'

import Lobby from './Lobby'

configure({ adapter: new Adapter() });



let mockedStore = configureStore([])({});
test('some test', () => {
  const wrapper = shallow(<Lobby />, {
    context: { store: mockedStore }
  });
  //console.log(wrapper.html())
  expect(wrapper.find('h1').length).toHaveLength(1);

  //lobby.find('#batchNumber').simulate('change', { value: 'blah@gmail.com'} );
   //expect(lobby.find('#batch-number')).to.have.length(1);
});
