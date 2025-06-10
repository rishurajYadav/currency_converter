const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.innerText = currCode;
    option.value = currCode;
    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;
    select.appendChild(option);
  }
  select.addEventListener("change", (e) => updateFlag(e.target));
}

// Update flags on load
updateFlag(fromCurr);
updateFlag(toCurr);

function updateFlag(element) {
  let countryCode = countryList[element.value];
  let img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

btn.addEventListener("click", async (e) => {
  e.preventDefault();

  let amountInput = document.querySelector(".amount input");
  let amount = amountInput.value;
  if (amount === "" || amount < 1) {
    amount = 1;
    amountInput.value = "1";
  }

  const fromCode = fromCurr.value;
  const toCode = toCurr.value;

  try {
    const response = await fetch(`${BASE_URL}/${fromCode}`);
    if (!response.ok) throw new Error("Failed to fetch rates");
    const data = await response.json();

    // rates is an object { "EUR": 0.95, "INR": 82.5, ... }
    const rate = data.rates[toCode];

    if (!rate) throw new Error(`Rate for ${toCode} not found`);

    const total = (rate * amount).toFixed(2);

    document.querySelector(".msg").innerText = `${amount} ${fromCode} = ${total} ${toCode}`;
  } catch (error) {
    document.querySelector(".msg").innerText = `Error: ${error.message}`;
  }
});
