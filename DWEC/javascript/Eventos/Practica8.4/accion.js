const TOPE_SUPERIOR = 120;
const TOPE_INFERIOR = 0;
let velocidad = document.querySelector("span");
document.body.addEventListener("keydown", (ev) => {
  let v = Number(velocidad.textContent);
  if (ev.key == "ArrowUp") {
    if (v < TOPE_SUPERIOR) velocidad.textContent = v + 1;
  } else if (ev.key == "ArrowDown") {
    if (v > TOPE_INFERIOR) velocidad.textContent = v - 1;
  }
});
