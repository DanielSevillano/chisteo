import * as materialColorUtilities from "https://cdn.jsdelivr.net/npm/@material/material-color-utilities/+esm";
export { actualizarColor };

function actualizarColor(color) {
    const tema = materialColorUtilities.themeFromSourceColor(materialColorUtilities.argbFromHex(color));
    const temaOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    materialColorUtilities.applyTheme(tema, {
        target: document.body,
        dark: temaOscuro
    });

    localStorage.setItem("color", color);
}

const colorInicial = localStorage.getItem("color");

if (colorInicial == "null") actualizarColor("#008000");
else actualizarColor(colorInicial);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", function () {
    actualizarColor(localStorage.getItem("color"));
});