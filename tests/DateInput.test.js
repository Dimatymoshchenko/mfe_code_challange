require("../DateInput");

describe("DateInput Web Component", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("date-input");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  it("should render input element of type date", () => {
    const inputElement = container.shadowRoot.querySelector("input");
    expect(inputElement).not.toBeNull();
    expect(inputElement.type).toBe("date");
  });

  it("should emit dateSelected event with correct date format when date changes", (done) => {
    const inputElement = container.shadowRoot.querySelector("input");

    container.addEventListener("dateSelected", (event) => {
      expect(event.detail.date).toBe("2023-10-21");
      done();
    });

    inputElement.value = "2023-10-21";
    inputElement.dispatchEvent(new Event("change"));
  });
});
