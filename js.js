//obter elementos da pagina
const frm = document.querySelector("form");
const dvPalco = document.querySelector("#divPalco");

//constante para definir o número de poltronas
const POLTRONAS = 240;

//vetor com as poltronas reservadas
const reservadas = [];

window.addEventListener("load", () => {
    //operador ternário: se houver dados salvos em localStorage, faz um split e atribui esses dados ao array, caso contrário, inicializa o array
    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";") : [];
    
    //montar o número total de poltronas
    for (let i = 1; i <= POLTRONAS; i++){
        const figure = document.createElement("figure"); //cria a tag figure
        const imgStatus = document.createElement("img"); //cria a tag img

        //se a posição estiver ocupada, exibe a imagem ocupado, senão, a imagem disponível
        imgStatus.src = ocupadas.includes(i.toString())
        ? "img/ocupada.jpg"
        : "img/disponivel.jpg";
        imgStatus.className = "poltrona"; //classe com a dimensão da imagem

        const figureCap = document.createElement("figcaption"); //cria figcaption

        //quantidade de zeros antes do número da poltrona
        const zeros = i < 10 ? "00" : i < 100 ? "0" : "";

        const num = document.createTextNode(`[${zeros}${i}]`); //cria o texto

        //define os pais de cada tag criada
        figureCap.appendChild(num);
        figure.appendChild(imgStatus);
        figure.appendChild(figureCap);

        //se i módulo de 24 == 12 (é o corredor: define margem direita 60px)
        if (i % 24 == 12) figure.style.marginRight = "60px"

        dvPalco.appendChild(figure); //indica que a figura é filha de divPalco

        //se i módulo 24 == 0: o código após o && será executado (inserindo quebra de linha)
        (i % 24 == 0) && dvPalco.appendChild(document.createElement("br"));
    }
})

frm.addEventListener("submit", (e) => {
    e.preventDefault();

    //obtem o conteudo do input
    const poltrona = Number(frm.inPoltrona.value);

    //valida o preenchimento da entrada
    if(poltrona > POLTRONAS){
        alert("Informe um número de poltrona válido!");
        frm.inPoltrona.focus();
        return
    }

    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    //validar se a poltrona já estiver ocupada
    if(ocupadas.includes(poltrona.toString())){
        alert(`A poltrona ${poltrona} já está ocupada!`);
        frm.inPoltrona.value = "";
        frm.inPoltrona.focus();
        return;
    }
    const imgPoltrona = dvPalco.querySelectorAll("img")[poltrona - 1];
    imgPoltrona.src = "img/reservada.jpg";
    reservadas.push(poltrona); 
    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
})

frm.btConfirmar.addEventListener("click", () => {
    // verifica se o valor nao é 0
    if (reservadas.length == 0){
        alert("Não há poltronas reservadas!");
        frm.inPoltrona.focus();
        return;
    }

    // local storage
    const ocupadas = localStorage.getItem("teatroOcupadas")
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    // muda a imagem
    for(let i = reservadas.length - 1; i >= 0; i--){
        ocupadas.push(reservadas[i]);
        const imgPoltrona = dvPalco.querySelectorAll("img")[reservadas[i]-1]; 
        imgPoltrona.src = "img/ocupada.jpg"; 
        reservadas.pop(); 
    }

    // arruma local storage
    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
})

frm.btCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    // const
    const cancelar = Number(frm.inPoltrona.value);
    const ocupadas = localStorage.getItem("teatroOcupadas")

    // local storage
    ? localStorage.getItem("teatroOcupadas").split(";")
    : [];

    // verifica se o valor nao é 0
    if (ocupadas.length == 0){
        alert("Confimar cancelamento com alguma poltrona");
        frm.inPoltrona.focus();
        return;
    }
    // confirmar cancelamento
    if (confirm(`Cancelar a poltrona? ${cancelar}?`)){
        for(let i = ocupadas.length - 1; i >= 0; i--){
            if (ocupadas[i] == cancelar){
                const imgPoltrona = dvPalco.querySelectorAll("img")[ocupadas[i]-1]; 
                imgPoltrona.src = "img/disponivel.jpg"; 
                ocupadas.pop();
            }
        }
    }

    // arruma local storage
    frm.inPoltrona.value = "";
    frm.inPoltrona.focus();
    localStorage.setItem("teatroOcupadas", ocupadas.join(";"));
})