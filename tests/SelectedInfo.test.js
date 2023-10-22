require("../SelectedInfo");

describe("SelectedInfo Web Component", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("selected-info");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it("should render initial values correctly", () => {
    const destinationText =
      container.shadowRoot.querySelector("div:nth-child(1)").textContent;
    const dateText =
      container.shadowRoot.querySelector("div:nth-child(2)").textContent;

    expect(destinationText).toBe("Selected Destination: Not selected");
    expect(dateText).toBe("Selected Date: Not selected");
  });

  it("should update destination when destinationSelected event is fired", () => {
    const destinationEvent = new CustomEvent("destinationSelected", {
      detail: { destination: "Bali" },
    });
    document.dispatchEvent(destinationEvent);

    const destinationText =
      container.shadowRoot.querySelector("div:nth-child(1)").textContent;
    expect(destinationText).toBe("Selected Destination: Bali");
  });

  it("should update date when dateSelected event is fired and format it correctly", () => {
    const dateEvent = new CustomEvent("dateSelected", {
      detail: { date: "2023-10-21" },
    });
    document.dispatchEvent(dateEvent);

    const dateText =
      container.shadowRoot.querySelector("div:nth-child(2)").textContent;
    expect(dateText).toBe("Selected Date: 21.10.2023");
  });
});
