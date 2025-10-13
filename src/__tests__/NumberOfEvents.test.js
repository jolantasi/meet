import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberOfEvents from "../components/NumberOfEvents";
import EventList from "../components/EventList"; // assuming EventList shows events
import { getEvents } from "../api";

describe("<NumberOfEvents /> component", () => {
  test("renders a textbox input", () => {
    render(<NumberOfEvents />);
    const input = screen.getByRole("spinbutton"); // input type=number
    expect(input).toBeInTheDocument();
  });

  test("has default value of 32", () => {
    render(<NumberOfEvents />);
    const input = screen.getByRole("spinbutton");
    expect(input.value).toBe("32");
  });

  test("user can change the number of events", async () => {
    const user = userEvent.setup();
    render(<NumberOfEvents />);
    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "10");
    expect(input.value).toBe("10");
  });
});

describe("Integration with EventList", () => {
  let allEvents;

  beforeAll(async () => {
    allEvents = await getEvents();
  });

  test("default number of events displayed is 32", () => {
    render(<EventList events={allEvents.slice(0, 32)} />);
    const eventItems = screen.getAllByRole("listitem");
    expect(eventItems.length).toBe(32);
  });

  test("number of events displayed changes according to user input", async () => {
    const user = userEvent.setup();

    // start with default 32
    const { rerender } = render(<EventList events={allEvents.slice(0, 32)} />);
    let eventItems = screen.getAllByRole("listitem");
    expect(eventItems.length).toBe(32);

    // simulate changing number of events to 10
    rerender(<EventList events={allEvents.slice(0, 10)} />);
    eventItems = screen.getAllByRole("listitem");
    expect(eventItems.length).toBe(10);
  });
});
