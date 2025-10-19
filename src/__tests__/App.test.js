import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import App from '../App';

describe('<App /> component', () => {
  let AppDOM;
  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', () => {
    const eventList = AppDOM.querySelector('#event-list');
    expect(eventList).toBeInTheDocument();
  });

  test('renders CitySearch', () => {
    const citySearch = AppDOM.querySelector('#city-search');
    expect(citySearch).toBeInTheDocument();
  });

  test('renders NumberOfEvents component', () => {
    const numberInput = AppDOM.querySelector('#number-of-events');
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
    const berlinEvents = allEvents.filter(event => event.location === 'Berlin, Germany');

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);
    allRenderedEventItems.forEach(event => {
      expect(event.textContent).toContain("Berlin, Germany");
    });
  });

  test('user can change number of events displayed', async () => {
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    const numberOfEventsInput = AppDOM.querySelector('#number-of-events');

    // Clear default and type new number
    await user.clear(numberOfEventsInput);
    await user.type(numberOfEventsInput, '10');

    // Wait for events to update
    const EventListDOM = AppDOM.querySelector('#event-list');
    const events = within(EventListDOM).queryAllByRole('listitem');

    expect(events.length).toBe(10);
  });
});
