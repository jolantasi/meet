import React from 'react';
import { render, within, screen } from '@testing-library/react'; // Add screen here
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {
  let AppDOM;
  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', () => {
    // Use querySelector with existing id
    const eventList = AppDOM.querySelector('#event-list');
    expect(eventList).toBeInTheDocument();
  });

  test('renders CitySearch', () => {
    // Use querySelector with existing id
    const citySearch = AppDOM.querySelector('#city-search');
    expect(citySearch).toBeInTheDocument();
  });

  test('renders NumberOfEvents component', () => {
    const { container } = render(<App />);
    const numberInput = container.querySelector('#number-of-events'); // input type=number
    expect(numberInput).toBeInTheDocument();
  });
});

describe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    await user.type(CitySearchInput, "Berlin");
    const berlinSuggestionItem = within(CitySearchDOM).queryByText('Berlin, Germany');
    await user.click(berlinSuggestionItem);

    const EventListDOM = AppDOM.querySelector('#event-list');
    const allRenderedEventItems = within(EventListDOM).queryAllByRole('listitem');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      event => event.location === 'Berlin, Germany'
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });

  test('user can change number of events displayed', async () => {
    const user = userEvent.setup(); // Add this for consistency
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    // Find the input box for number of events using querySelector (consistent with your other tests)
    const numberOfEventsInput = AppDOM.querySelector('#number-of-events');

    // Erase default "32" and type "10"
    await user.clear(numberOfEventsInput);
    await user.type(numberOfEventsInput, '10');

    // Check that the correct number of events is displayed
    const EventListDOM = AppDOM.querySelector('#event-list');
    const events = within(EventListDOM).queryAllByRole('listitem');
    
    expect(events).toHaveLength(10);
  });
});