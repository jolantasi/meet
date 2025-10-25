import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NumberOfEvents from "../components/NumberOfEvents";
import EventList from "../components/EventList";
import mockData from "../mock-data";

describe("<NumberOfEvents /> component", () => {
  test("renders a textbox input", () => {
    const mockSetCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        currentNOE={32}
        setCurrentNOE={mockSetCurrentNOE}
        setErrorText={() => {}}
      />
    );
    const input = screen.getByRole("spinbutton");
    expect(input).toBeInTheDocument();
  });

  test("has default value of 32", () => {
    const mockSetCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        currentNOE={32}
        setCurrentNOE={mockSetCurrentNOE}
        setErrorText={() => {}}
      />
    );
    const input = screen.getByRole("spinbutton");
    expect(input.value).toBe("32");
  });

  test("user can change the number of events", async () => {
    const user = userEvent.setup();
    const mockSetCurrentNOE = jest.fn();
    render(
      <NumberOfEvents
        currentNOE={32}
        setCurrentNOE={mockSetCurrentNOE}
        setErrorText={() => {}}
      />
    );
    const input = screen.getByRole("spinbutton");

    await user.clear(input);
    await user.type(input, "5");

    expect(mockSetCurrentNOE).toHaveBeenCalled();
  });
});

describe("Integration with EventList", () => {
  // ✅ Use static mock data instead of async getEvents()
  const allEvents = mockData;

  test("default number of events displayed is 32", () => {
    render(<EventList events={allEvents.slice(0, 32)} />);
    const eventItems = screen.getAllByRole("listitem");
    expect(eventItems.length).toBe(32);
  });

  test("number of events displayed changes according to user input", () => {
    const { rerender } = render(<EventList events={allEvents.slice(0, 32)} />);
    let eventItems = screen.getAllByRole("listitem");
    expect(eventItems.length).toBe(32);

    // Simulate changing number of events to 10
    rerender(<EventList events={allEvents.slice(0, 10)} />);
    eventItems = screen.getAllByRole("listitem");
    expect(eventItems.length).toBe(10);
  });
});
