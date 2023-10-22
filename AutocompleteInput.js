const DEFAULT_DELAY = 200;
const DEFAULT_API_URL =
  "https://api.cloud.tui.com/search-destination/v2/de/package/TUICOM/2/autosuggest/peakwork/";

function debounce(func, delay = DEFAULT_DELAY) {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      func.apply(this, args);
      timerId = null;
    }, delay);
  };
}

function isNotEmpty(value) {
  return value !== null && value !== undefined && value !== "";
}

class AutocompleteInput extends HTMLElement {
  static get observedAttributes() {
    return ["api-url"];
  }

  constructor() {
    super();

    this.init();
  }

  init() {
    this.shadow = this.attachShadow({ mode: "open" });
    this.apiUrl = this.getAttribute("api-url") || DEFAULT_API_URL;

    this.createElements();
  }

  initStyles() {
    this.wrapper.classList.add("wrapper");
    this.result.classList.add("resultContainer");
    this.clearButton.classList.add("clearButton");

    const style = document.createElement("style");
    style.textContent = `
            .wrapper {
                position: relative;
            }
            .resultContainer {
                background-color: rgb(223 240 253);
                max-height: 300px;
                overflow-y: scroll;
                visibility: hidden;
                transition: visibility .8s;
            }
            .resultContainer.active {
                visibility: visible;
            }
            .clearButton {
                position: absolute;
                right: 5px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                display: none;
            }
            .clearButton.active {
                display: block;
            }
            input {
                border: none;
                border-bottom: 1px solid #68c5f0;
            }
            input:focus{
                outline: none;
            }
            div > div {
                padding: 5px;
                cursor: pointer;
            }
            div > div:hover {
                background-color: #eaeaea;
            }
            input {
                width: 100%;
                box-sizing: border-box;
            }
        `;
    this.shadow.appendChild(style);
  }

  handleOutsideClick(event) {
    if (!this.result.contains(event.target)) {
      this.clearResults();
    }
  }

  clickElementHandler(event) {
    const clickedElement = event.target;

    if (clickedElement && clickedElement.tagName === "DIV") {
      this.input.value = clickedElement.textContent;
      this.clearResults();
    }
  }

  createClearButton() {
    this.clearButton = document.createElement("span");
    this.clearButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="10px" height="10px">
        <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"/>
    </svg>
`;
  }

  createElements() {
    this.input = document.createElement("input");
    this.wrapper = document.createElement("div");
    this.result = document.createElement("div");
    this.createClearButton();
  }

  attachListeners() {
    this.debouncedFetchResults = debounce(this.fetchResults.bind(this));
    this.input.addEventListener("input", this.onInput.bind(this));
    this.clearButton.addEventListener("click", this.clearInput.bind(this));
    this.result.addEventListener("click", this.clickElementHandler.bind(this));
  }

  appendChildren() {
    this.shadow.appendChild(this.wrapper);
    this.shadow.appendChild(this.result);
    this.wrapper.appendChild(this.input);
    this.wrapper.appendChild(this.clearButton);
  }

  connectedCallback() {
    this.attachListeners();
    this.appendChildren();
    this.initStyles();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "api-url") {
      this.apiUrl = newValue;
    }
  }

  disconnectedCallback() {
    this.input.removeEventListener("input", this.onInput.bind(this));
    this.result.removeEventListener(
      "click",
      this.clickElementHandler.bind(this)
    );
    this.clearButton.removeEventListener("click", this.clearInput.bind(this));
  }

  onInput(e) {
    const value = e.target.value;
    if (isNotEmpty(value)) {
      this.debouncedFetchResults(value);
    } else {
      this.clearResults();
    }
  }

  async fetchResults(keyword) {
    try {
      const response = await fetch(`${this.apiUrl}${keyword}`);
      const data = await response.json();

      this.displayResults(data?.[0]?.items || []);
    } catch (err) {
      console.error("Error while fetching data:", err);
    }
  }

  displayResults(results) {
    this.clearResults();

    this.result.classList.add("active");
    this.clearButton.classList.add("active");

    document.addEventListener("click", this.handleOutsideClick.bind(this));

    results.forEach((item) => {
      const resultDiv = document.createElement("div");
      resultDiv.textContent = item.name;
      this.result.appendChild(resultDiv);
    });
  }

  clearResults() {
    document.removeEventListener("click", this.handleOutsideClick.bind(this));
    this.clearButton.classList.remove("active");

    while (this.result.firstChild) {
      this.result.removeChild(this.result.firstChild);
    }
  }

  clearInput() {
    this.input.value = "";
    this.clearButton.style.display = "none";
    this.clearResults();
  }
}

customElements.define("autocomplete-input", AutocompleteInput);
