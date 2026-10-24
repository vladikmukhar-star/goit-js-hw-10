import { PREP_TIME } from "./src/js/menu.js";
const form = document.querySelector(".form");
const orderLog = document.querySelector(".order-log");

function makeOrder(delay, shouldResolve) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}

function addOrderRow(drinkName) {
  const li = document.createElement("li");
  li.classList.add("row-pending");
  li.textContent = `⏳ ${drinkName} · у роботі…`;
  orderLog.prepend(li);
  return li;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const formData = new FormData(form);
  const drink = formData.get("drink");
  const state = formData.get("state");

  const delay = PREP_TIME[drink];
  const shouldResolve = state === "fulfilled";

  const row = addOrderRow(drink);

  makeOrder(delay, shouldResolve)
    .then(resolvedDelay => {
      row.className = "row-ok";
      row.textContent = `✅ ${drink} · готове · ${resolvedDelay} ms`;
    })
    .catch(rejectedDelay => {
      row.className = "row-err";
      row.textContent = `❌ ${drink} · скасовано · ${rejectedDelay} ms`;
    })
    .finally(() => {
      const timeString = new Date().toLocaleTimeString("uk-UA");
      row.textContent += ` · ${timeString}`;
    });
});