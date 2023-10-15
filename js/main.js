import { BarController, BarElement, CategoryScale, Chart, LinearScale, PointElement } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";

Chart.register(BarController, BarElement, PointElement, CategoryScale, LinearScale);

function cambiarColor(color) {
    if (color == localStorage.getItem("color")) return;
    document.body.removeAttribute("class");

    if (color != undefined) document.body.classList.add(color);
    localStorage.setItem("color", color);

    const datos = grafica.data.datasets;
    if (datos.length === 2) {
        datos[0].borderColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary");
        datos[1].borderColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-inverse-primary");
    } else {
        datos[0].backgroundColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary");
    }
    grafica.update();
}

function chistesRecientes(datos, numeroChistes) {
    const contenedorChistes = document.querySelector(".contenedor-chistes");

    datos.slice(-numeroChistes).forEach((dato) => {
        const tarjeta = document.createElement("article");
        const autor = document.createElement("p");

        const contenido = document.createElement(dato.tipo);
        if (dato.tipo == "p") {
            contenido.innerHTML = dato.chiste;
        } else if (dato.tipo == "img") {
            contenido.src = "img/" + dato.chiste;
            contenido.alt = "Chiste";
            contenido.loading = "lazy";
        } else if (dato.tipo == "video") {
            contenido.src = "video/" + dato.chiste;
            contenido.controls = true;
        } else if (dato.tipo == "audio") {
            contenido.src = "audio/" + dato.chiste;
            contenido.controls = true;
        }

        autor.textContent = dato.autor;
        tarjeta.append(contenido, autor);
        contenedorChistes.prepend(tarjeta);
    });
}

async function datosChistes() {
    const respuesta = await fetch("data/chistes.json");
    const datos = await respuesta.json();

    chistesRecientes(datos, 18);
    grafica = rankingChistes(datos, 5);
}

function rankingChistes(datos, numeroPersonas) {
    const autores = new Map([]);

    datos.forEach((dato) => {
        const autor = dato.autor;

        if (autores.has(autor)) autores.set(autor, autores.get(autor) + 1);
        else autores.set(autor, 1);
    });

    // Ranking
    const ranking = Array.from(autores.entries()).sort((a, b) => b[1] - a[1]);

    // Gráfica
    const ejeY = [];
    const ejeX = [];

    ranking.slice(0, numeroPersonas).forEach((dato) => {
        ejeY.push(dato[0]);
        ejeX.push(dato[1]);
    });

    const ctx = document.getElementById("grafica-ranking");
    const grafica = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ejeY,
            datasets: [
                {
                    label: "Chistes",
                    data: ejeX,
                    backgroundColor: getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary")
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: "y"
        }
    });

    return grafica;
}

let grafica = null;

// Frase célebre
const frases = [
    "Pienso, luego chisteo.",
    "Solo hay dos cosas infinitas: el universo y el chisteo. Y no estoy tan seguro de la primera.",
    "Detesto a la gente que lleva camisetas del Che sin haber escuchado nunca un disco suyo.",
    "Mirar una ventana es como mirar una pared, pero en vez de una pared es una ventana.",
    "Halcón lego.",
    "Existe un relación clara entre la topología algebraica y el código penal.",
    "Al final tuve que aceptar el resultado, al igual que las sentencias judiciales, ¿qué remedio?",
    "Me encantan las jeringas 💉👍",
];

const cita = document.querySelector("blockquote");
cita.textContent = frases[Math.floor(Math.random() * frases.length)];

// Diálogo
const botonTemas = document.querySelector("#temas");
const dialogo = document.querySelector("dialog");
const botonCerrar = document.querySelector("#cerrar");

botonTemas.addEventListener("click", () => {
    dialogo.showModal();
});

botonCerrar.addEventListener("click", () => {
    dialogo.close();
});

// Temas
const botonesColor = document.querySelectorAll(".color");
botonesColor.forEach((boton) => {
    boton.addEventListener("click", () => {
        if (boton.id === "verde") cambiarColor(undefined);
        else cambiarColor(boton.id);
    });
});

// Chistes
datosChistes();