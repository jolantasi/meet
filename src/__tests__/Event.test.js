import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Event from "../components/Event";
import { getEvents } from "../api";

// helper to escape regex special characters in strings
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe("<Event /> component", () => {
  let allEvents;
  let event;

  beforeAll(async () => {
    allEvents = await getEvents();
    event = allEvents[0]; // use the first event
  });

  test("renders event title correctly", () => {
    render(<Event event={event} />);
    expect(screen.queryByText(event.summary)).toBeInTheDocument();
  });

  test("renders event start time correctly", () => {
    render(<Event event={event} />);
    const escapedStart = escapeRegExp(event.start.dateTime);
    expect(screen.queryByText(new RegExp(escapedStart))).toBeInTheDocument();
  });

  test("renders event location correctly", () => {
    render(<Event event={event} />);
    const escapedLocation = escapeRegExp(event.location);
    expect(screen.queryByText(new RegExp(escapedLocation))).toBeInTheDocument();
  });

  test("renders 'show details' button", () => {
    render(<Event event={event} />);
    const button = screen.queryByText(/show details/i);
    expect(button).toBeInTheDocument();
  });

  test("by default, event details are hidden", () => {
    render(<Event event={event} />);
    const escapedDescription = escapeRegExp(event.description.slice(0, 20));
    const details = screen.queryByText(new RegExp(escapedDescription));
    expect(details).not.toBeInTheDocument();
  });

  test("shows details when 'show details' is clicked", async () => {
    const user = userEvent.setup();
    render(<Event event={event} />);
    const button = screen.getByText(/show details/i);
    await user.click(button);

    const escapedDescription = escapeRegExp(event.description.slice(0, 20));
    const details = screen.queryByText(new RegExp(escapedDescription));
    expect(details).toBeInTheDocument();
  });

  test("hides details when 'hide details' is clicked", async () => {
    const user = userEvent.setup();
    render(<Event event={event} />);
    const showButton = screen.getByText(/show details/i);
    await user.click(showButton);

    const hideButton = screen.getByText(/hide details/i);
    await user.click(hideButton);

    const escapedDescription = escapeRegExp(event.description.slice(0, 20));
    const details = screen.queryByText(new RegExp(escapedDescription));
    expect(details).not.toBeInTheDocument();
  });
});
