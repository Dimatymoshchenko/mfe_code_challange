require("../AutocompleteInput");

describe("AutocompleteInput Component", () => {
  let container;

  beforeEach(() => {
    container = document.createElement("autocomplete-input");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should be defined", () => {
    expect(customElements.get("autocomplete-input")).toBeDefined();
  });

  it("should display results on input", async () => {
    const input = container.shadowRoot.querySelector("input");
    input.value = "test";
    input.dispatchEvent(new Event("input"));

    await new Promise((r) => setTimeout(r, 300)); // debounce delay

    const results = container.shadowRoot.querySelectorAll(
      ".resultContainer > div"
    );
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].textContent).toBe("test-result");
  });

  it("should emit destinationSelected event on result click", (done) => {
    container.addEventListener("destinationSelected", (e) => {
      expect(e.detail.destination).toBe("test-result");
      done();
    });

    const input = container.shadowRoot.querySelector("input");
    input.value = "test";
    input.dispatchEvent(new Event("input"));

    setTimeout(() => {
      const results = container.shadowRoot.querySelector(
        ".resultContainer > div"
      );
      results.click();
    }, 300);
  });
});
