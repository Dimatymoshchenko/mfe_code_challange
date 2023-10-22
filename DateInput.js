class DateInput extends HTMLElement {
  constructor() {
    super();

    this.init();
  }

  init() {
    this.attachShadow({ mode: "open" });

    this.createElements();
    this.appendChildren();
  }

  createElements() {
    this.input = document.createElement("input");
    this.input.type = "date";
  }

  appendChildren() {
    this.shadowRoot.appendChild(this.input);
  }

  attachEvents() {
    this.input.addEventListener("change", this.emitDateEvent.bind(this));
  }

  connectedCallback() {
    this.attachEvents();
    this.appendChildren();
  }

  disconnectedCallback() {
    this.input.removeEventListener("change", this.emitDateEvent.bind(this));
  }

  // When the date is changed, this function will emit a custom event
  emitDateEvent(e) {
    const selectedDateObject = new Date(e.target.value);
    // format date to YYYY-MM-DD
    const formattedDate = `${selectedDateObject.getFullYear()}-${String(
      selectedDateObject.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDateObject.getDate()).padStart(
      2,
      "0"
    )}`;

    // Create and dispatch a custom event with the chosen date
    const dateEvent = new CustomEvent("dateSelected", {
      bubbles: true,
      composed: true,
      detail: {
        date: formattedDate,
      },
    });

    this.dispatchEvent(dateEvent);
  }
}

// Define the new custom element
customElements.define("date-input", DateInput);
