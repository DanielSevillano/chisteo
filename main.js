function fraseCelebre() {
    const frases = [
        "Pienso, luego chisteo.",
        "Solo hay dos cosas infinitas: el universo y el chisteo. Y no estoy tan seguro de la primera.",
        "Detesto a la gente que lleva camisetas del Che sin haber escuchado nunca un disco suyo.",
        "Mirar una ventana es como mirar una pared, pero en vez de una pared es una ventana.",
        "Halcón lego.",
        "Existe un relación clara entre la topología algebraica y el código penal.",
    ];

    const cita = document.querySelector("blockquote");
    cita.textContent = frases[Math.floor(Math.random() * frases.length)];
}

async function graficaChisteo(url, id) {
    const ejeX = [];
    const ejeY1 = [];
    const ejeY2 = [];

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    datos.forEach((dato) => {
        const { dia, chistes, aproximacion } = dato;

        ejeX.push(dia);
        ejeY1.push(chistes);
        ejeY2.push(aproximacion);
    });

    const ctx = document.getElementById(id);
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ejeX,
            datasets: [
                {
                    label: "Chisteo exacto",
                    data: ejeY1,
                    borderColor: "#1e6d00",
                },
                {
                    label: "Aproximación",
                    data: ejeY2,
                    borderColor: "#84db63",
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
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
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ejeY,
            datasets: [
                {
                    label: "Chistes",
                    data: ejeX,
                    backgroundColor: "#1e6d00",
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: "y",
        },
    });
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

    rankingChistes(datos, 5);
    chistesRecientes(datos, 10);
}

function imagenesManeo() {
    const datos = ["Mantecado", "Mango", "Mandril", "Mancuerna", "Manguera", "Mantequilla", "Manga", "Manguitos", "Manguito", "Manjula", "Museo", "Manifold"];

    const contenedorManeo = document.querySelector(".contenedor-maneo");

    datos.forEach((dato) => {
        const nombre = dato.toLowerCase();
        const imagen = document.createElement("img");
        imagen.src = "img/maneo-" + nombre + ".jpg";
        imagen.alt = "Maneo " + nombre;
        imagen.loading = "lazy";
        contenedorManeo.append(imagen);
    });
}

fraseCelebre();
graficaChisteo("data/chisteo-inferido.json", "grafica-inferida");
graficaChisteo("data/chisteo-ampliado.json", "grafica-ampliada");
graficaChisteo("data/chisteo-multivariante.json", "grafica-multivariante");
datosChistes();
imagenesManeo();