class SelectedInfo extends HTMLElement {
  constructor() {
    super();

    // Attach Shadow DOM
    this.attachShadow({ mode: "open" });

    // Initial values
    this.destination = "Not selected";
    this.date = "Not selected";

    this.updateDisplay();
  }

  connectedCallback() {
    // Listen to custom events from other components
    document.addEventListener("destinationSelected", (e) => {
      this.destination = e.detail.destination;
      this.updateDisplay();
    });

    document.addEventListener("dateSelected", (e) => {
      // Convert date format from YYYY-MM-DD to DD.MM.YYYY
      this.date = this.formatToGermanDate(e.detail.date);
      this.updateDisplay();
    });
  }

  formatToGermanDate(dateStr) {
    // Reason: This solution is lightweight and sufficient for our needs,
    // hence no need to add external libraries like moment.js or date-fns.
    const [year, month, day] = dateStr.split("-");

    return `${day}.${month}.${year}`;
  }

  updateDisplay() {
    this.shadowRoot.innerHTML = `
            <div>Selected Destination: ${this.destination}</div>
            <div>Selected Date: ${this.date}</div>
        `;
  }
}

customElements.define("selected-info", SelectedInfo);
