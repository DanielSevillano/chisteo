import { CategoryScale, Chart, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from "https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.js/+esm";

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function actualizarGrafica() {
    graficas.forEach((grafica) => {
        grafica.data.datasets[0].borderColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary");
        grafica.data.datasets[1].borderColor = getComputedStyle(document.body).getPropertyValue("--md-sys-color-inverse-primary");
        grafica.options.scales.x.grid.color = getComputedStyle(document.body).getPropertyValue("--md-sys-color-outline-variant");
        grafica.options.scales.y.grid.color = getComputedStyle(document.body).getPropertyValue("--md-sys-color-outline-variant");
        grafica.options.scales.x.ticks.color = getComputedStyle(document.body).getPropertyValue("--md-sys-color-on-background");
        grafica.options.scales.y.ticks.color = getComputedStyle(document.body).getPropertyValue("--md-sys-color-on-background");
        grafica.options.plugins.legend.labels.color = getComputedStyle(document.body).getPropertyValue("--md-sys-color-on-background");
        grafica.update();
    });
}

async function crearGrafica(url, id) {
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
                    borderColor: getComputedStyle(document.body).getPropertyValue("--md-sys-color-primary")
                },
                {
                    label: "Aproximación",
                    data: ejeY2,
                    borderColor: getComputedStyle(document.body).getPropertyValue("--md-sys-color-inverse-primary")
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue("--md-sys-color-on-background")
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue("--md-sys-color-outline-variant")
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--md-sys-color-on-background")
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.body).getPropertyValue("--md-sys-color-outline-variant")
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue("--md-sys-color-on-background")
                    }
                }
            }
        }
    });

    return grafica;
}

const datosGraficas = [
    { archivo: "data/chisteo-inferido.json", elemento: "grafica-inferida" },
    { archivo: "data/chisteo-ampliado.json", elemento: "grafica-ampliada" },
    { archivo: "data/chisteo-multivariante.json", elemento: "grafica-multivariante" },
];

const graficas = [];
datosGraficas.forEach((dato) => {
    crearGrafica(dato.archivo, dato.elemento).then((grafica) => {
        graficas.push(grafica);
    });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", actualizarGrafica);