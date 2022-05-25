async function listarTodasAsPaletas() {
  const response = await fetch("http://localhost:3000/paletas/listar-todas");
  const paletas = await response.json(); //sempre q pegar a resposta no fetch, tem que tratar com json

  paletas.forEach((paleta) => {
    document.getElementById("paletaList").insertAdjacentHTML(
      "beforeend",
      `
        <div class="PaletaListaItem" id="PaletaListaItem_${paleta.id}">
            <div>
             <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
             <div class="PaletaListaItem__preco">${paleta.preco}</div>
             <div class="PaletaListaItem__descricao">${paleta.descricao}</div>

             <div class= "PaletaListaItem__acoes Acoes">
              <button class= "Acoes__editar btn"onclick="abrirModal(${paleta.id})">Editar</button>
              <button class= "Acoes__apagar btn" >Apagar</button>
              </div>
            </div>
            <img class="PaletaListaItem__foto" src="${paleta.foto}" alt= "Paleta de ${paleta.sabor}"/>

        </div>
        `
    );
  });
}

async function paletaPorId() {
  const id = document.querySelector("#idPaleta").value;

  const response = await fetch(`http://localhost:3000/paletas/paleta/${id}`);
  const paleta = await response.json();

  const paletaEscolhidaDiv = document.querySelector("#paletaEscolhida");

  paletaEscolhidaDiv.innerHTML = ` 
    <div class="PaletaCardItem" id="PaletaListaItem_${paleta.id}">
        <div>
            <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
            <div class="PaletaCardItem__preco">${paleta.preco}</div>
            <div class="PaletaCardItem__descricao">${paleta.descricao}</div>
        </div>
        <div class= "PaletaListaItem__acoes Acoes">
          <button class= "Acoes__editar btn"onclick="abrirModal(${paleta.id})">Editar</button>
          <button class= "Acoes__apagar btn" >Apagar</button>
        </div>
      </div>
        <img class="PaletaCardItem__foto" src="${paleta.foto}" alt= "Paleta de ${paleta.sabor}"/>
</div>`;
}

listarTodasAsPaletas();

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText ="Atualizar uma paleta";
    document.querySelector("#button-form-modal").innerText ="Atualizar uma paleta";

    

    const response = await fetch(`http://localhost:3000/paletas/paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#id").value = paleta.id;
    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma paleta";

    document.querySelector("#button-form-modal").innerText ="Atualizar";
  }

  document.querySelector(".modal-overlay").style.display = "flex";
}

function fecharModalCadastro() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function createPaleta() {
  const id = document.querySelector("#id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;
  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };
  const modoEdicaoAtivado = id > 0;
  const endpoint = `http://localhost:3000/paletas/` + (modoEdicaoAtivado ? `/atualizar-paleta/${id}` : `/criar-paleta`);


  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });
  const novaPaleta = await response.json();
  const html = ` 
    <div class="PaletaListaItem" id="PaletaListaItem_${paleta.id}">
        <div>
            <div class="PaletaListaItem__sabor">${novaPaleta.sabor}</div>
            <div class="PaletaListaItem__preco">${novaPaleta.preco}</div>
            <div class="PaletaListaItem__descricao">${novaPaleta.descricao}</div>
        </div>
        <div class= "PaletaListaItem__acoes Acoes">
          <button class= "Acoes__editar btn"onclick="abrirModal(${paleta.id})">Editar</button>
          <button class= "Acoes__apagar btn">Apagar</button>
        </div>
      </div>
        <img class="PaletaListaItem__foto" src="${novaPaleta.foto}" alt= "Paleta de ${novaPaleta.sabor}"/>
  </div>`;

  if(modoEdicaoAtivado){
    document.querySelector(`#PaletaListaItem_${id}`).outerHTML = html
  }else{
    document.querySelector("#paletaList").insertAdjacentHTML("beforeend", html);
  }

  fecharModalCadastro();
}
