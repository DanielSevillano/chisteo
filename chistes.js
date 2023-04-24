async function datosChistes() {
    const respuesta = await fetch("data/chistes.json");
    const datos = await respuesta.json();

    // Información a rellenar
    const autores = new Map([]);
    const elementosChiste = [];

    // Chistes
    const contenedorChistes = document.querySelector(".contenedor-chistes");

    datos.forEach((dato) => {
        const autor = dato.autor;
        const chiste = dato.chiste;

        const tarjeta = document.createElement("article");
        const pieTarjeta = document.createElement("div");
        const autorTarjeta = document.createElement("p");
        const numeroTarjeta = document.createElement("p");

        // Actualizamos el conteo de chistes por autor
        if (autores.has(autor)) autores.set(autor, autores.get(autor) + 1);
        else autores.set(autor, 1);

        // Rellenamos los datos
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

        autorTarjeta.textContent = autor;
        numeroTarjeta.textContent = autores.get(autor);
        pieTarjeta.append(numeroTarjeta, autorTarjeta);
        tarjeta.append(contenido, pieTarjeta);
        contenedorChistes.prepend(tarjeta);

        elementosChiste.push({ autor, chiste, tarjeta });
    });

    // Ranking
    const ranking = Array.from(autores.entries()).sort((a, b) => b[1] - a[1]);

    // Filtros
    const numeroFiltros = 10;

    const contenedorFiltros = document.querySelector(".contenedor-filtros");
    const filtroTodos = document.querySelector("button");
    filtroTodos.innerHTML += "<small>" + datos.length + "</small>";
    const filtros = [filtroTodos];

    filtroTodos.addEventListener("click", () => {
        filtros.forEach((filtro) => {
            if (filtro === filtroTodos) filtro.classList.add("seleccionado");
            else filtro.classList.remove("seleccionado");
        });

        elementosChiste.forEach((elemento) => {
            elemento.tarjeta.style.display = "flex";
        });
    });

    ranking.slice(0, numeroFiltros).forEach((puesto) => {
        const autor = puesto[0];
        const numero = puesto[1];

        const botonFiltro = document.createElement("button");
        const textoFiltro = document.createTextNode(autor);
        botonFiltro.type = "button";
        botonFiltro.appendChild(textoFiltro);
        botonFiltro.innerHTML += "<small>" + numero + "</small>";
        contenedorFiltros.append(botonFiltro);

        filtros.push(botonFiltro);

        botonFiltro.addEventListener("click", () => {
            filtros.forEach((filtro) => {
                if (filtro === botonFiltro) filtro.classList.add("seleccionado");
                else filtro.classList.remove("seleccionado");
            });

            elementosChiste.forEach((elemento) => {
                if (elemento.autor !== autor) elemento.tarjeta.style.display = "none";
                else elemento.tarjeta.style.display = "flex";
            });
        });
    });
}

datosChistes();
