import { BarController, BarElement, CategoryScale, Chart, LinearScale, LineController, LineElement, PointElement, Tooltip } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";
export { graficaChisteo, rankingChistes };

Chart.register(BarController, BarElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip);

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
    const grafica = new Chart(ctx, {
        type: "line",
        data: {
            labels: ejeX,
            datasets: [
                {
                    label: "Chisteo exacto",
                    data: ejeY1,
                    borderColor: getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary"),
                },
                {
                    label: "Aproximación",
                    data: ejeY2,
                    borderColor: getComputedStyle(document.body).getPropertyValue("--md-sys-color-inverse-primary"),
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

    return grafica;
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
                    backgroundColor: getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary"),
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            indexAxis: "y",
        },
    });

    return grafica;
}