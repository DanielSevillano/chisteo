async function fraseCelebre() {
    const respuesta = await fetch("data/frases.json")
    const datos = await respuesta.json()
    const cita = document.querySelector("blockquote")
    cita.textContent = datos[Math.floor(Math.random() * datos.length)]
}

async function graficaChisteo(url, id) {
    const ejeX = []
    const ejeY1 = []
    const ejeY2 = []

    const respuesta = await fetch(url)
    const datos = await respuesta.json()

    datos.forEach(dato => {
        const { dia, chistes, aproximacion } = dato
        
        ejeX.push(dia)
        ejeY1.push(chistes)
        ejeY2.push(aproximacion)
    })

    const ctx = document.getElementById(id)
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ejeX,
            datasets: [{
                label: "Chisteo exacto",
                data: ejeY1,
                borderColor: '#1e6d00',
            },
            {
                label: "Aproximación",
                data: ejeY2,
                borderColor: '#84db63',
            }]
        }
    })
}

async function datosChistes() {
    const respuesta = await fetch("data/chistes.json")
    const datos = await respuesta.json()
    
    return datos
}

async function datosChistes() {
    const respuesta = await fetch("data/chistes.json")
    const datos = await respuesta.json()

    // Información a rellenar
    const autores = new Map([])
    const elementosChiste = []

    // Chistes
    const contenedorChistes = document.querySelector(".contenedor-chistes")
    const plantilla = document.querySelector("[plantilla]")

    datos.forEach(dato => {
        const autor = dato.autor
        const chiste = dato.chiste

        // Actualizamos el conteo de chistes por autor
        if (autores.has(autor)) autores.set(autor, autores.get(autor)+1)
        else autores.set(autor, 1)

        // Rellenamos los datos en la plantilla 
        const tarjeta = plantilla.content.cloneNode(true).children[0]
        const contenidoPlantilla = tarjeta.querySelector("[contenido]")
        const autorPlantilla = tarjeta.querySelector("[autor]")
        const numeroPlantilla = tarjeta.querySelector("[numero]")
        contenidoPlantilla.innerHTML = chiste
        autorPlantilla.textContent = autor
        numeroPlantilla.textContent = autores.get(autor)
        contenedorChistes.prepend(tarjeta)

        elementosChiste.push({autor, chiste, tarjeta})
    })

    // Ranking
    const ranking = Array.from(autores.entries()).sort((a, b) => b[1] - a[1])

    // Filtros
    const contenedorFiltros = document.querySelector(".contenedor-filtros")
    const filtroTodos = document.querySelector("button")
    filtroTodos.innerHTML += "<small>" + datos.length + "</small>"
    const filtros = [filtroTodos]

    filtroTodos.addEventListener("click", () => {
        filtros.forEach(filtro => {
            if (filtro === filtroTodos) filtro.classList.add("seleccionado")
            else filtro.classList.remove("seleccionado");
        })
    
        elementosChiste.forEach(elemento => {
            elemento.tarjeta.style.display = "flex"
        })
    })

    ranking.slice(0, 6).forEach(puesto => {
        const autor = puesto[0]
        const numero = puesto[1]

        const botonFiltro = document.createElement("button")
        const textoFiltro = document.createTextNode(autor)
        botonFiltro.appendChild(textoFiltro)
        botonFiltro.innerHTML += "<small>" + numero + "</small>"
        contenedorFiltros.append(botonFiltro)

        filtros.push(botonFiltro)

        botonFiltro.addEventListener("click", () => {
            filtros.forEach(filtro => {
                if (filtro === botonFiltro) filtro.classList.add("seleccionado")
                else filtro.classList.remove("seleccionado");
            })

            elementosChiste.forEach(elemento => {
                if (elemento.autor !== autor) elemento.tarjeta.style.display = "none"
                else elemento.tarjeta.style.display = "flex" 
            })
        })
    })

    // Gráfica
    const ejeY = []
    const ejeX = []

    ranking.slice(0, 5).forEach(dato => {
        ejeY.push(dato[0])
        ejeX.push(dato[1])
    })

    const ctx = document.getElementById("grafica-ranking")
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ejeY,
            datasets: [{
                label: "Chistes",
                data: ejeX,
                backgroundColor: '#1e6d00',
            }]
        },
        options: {
            indexAxis: 'y',
        }
    })
}

fraseCelebre()
graficaChisteo("data/chisteo-junio.json", "grafica-junio")
graficaChisteo("data/chisteo-septiembre.json", "grafica-septiembre")
datosChistes()