

const tela_nome = document.getElementById("tela_nome") 
const input_nome = document.getElementById("input_nome")
const btn_iniciar = document.getElementById("btn_adicionar")
const container = document.getElementById("container")
const msg_nome = document.getElementById("mensagem_nome")



let nome_usuario = ''

// variaveis lista de compras
const lista_compras = document.getElementById("lista_compras")
const add_item = document.getElementById("input_item")
const btn_adicionar_item = document.getElementById("btn_adicionar_item")
const contador = document.getElementById("contador")
let itens = []
let itemArrastadoIndex = null;


btn_iniciar.onclick = () => {
    nome_usuario = input_nome.value.trim()
    if (nome_usuario.length <3){
        alert("Digite um nome válido")
        input_nome.focus()
        return
    }
    tela_nome.style.display = "none"
    container.classList.remove("hidden")
    msg_nome.textContent = "Olá " + nome_usuario + "! Monte sua lista!"
}


btn_adicionar_item.onclick = () =>  {
    const item = add_item.value.trim()
    if (item.length <3){
        alert("Digite um item válido")
        add_item.focus()
        return
    }
    itens.push({nome: item, comprado: false})
    add_item.value = ""
    atualizarlista()

}
function atualizarlista(){
    lista_compras.innerHTML = "";
    itens.forEach((item, index) => {
     
        const li = document.createElement("li") ;
         li.setAttribute("draggable","true");
         li.classList.add("item");
         li.dataset.index = index;
        
        const checkbox =  document.createElement ("input");
          
     
       checkbox.type = "checkbox";
       checkbox.checked = item.comprado;
       
       checkbox.onchange = () => {
        item.comprado = checkbox.checked;
        atualizarlista();
        
       };
       li.style.textDecoration = item.comprado ? "line-through" : "none";
       li.appendChild(checkbox);
       li.appendChild(document.createTextNode(" " + item.nome));
      

       lista_compras.appendChild(li);

       li.addEventListener("dragstart", () => {
        itemArrastadoIndex = index;
        li.classList.add("dragging");
       });
       li.addEventListener("dragend", () => {
        li.classList.remove("dragging");

       });
        

      
    });
        
       const ativos = itens.filter(item => !item.comprado);
        const total_ativos = ativos.length;
    contador.textContent = `${total_ativos} de ${itens.length} item(ns) pendentes.`;
   
}
function getNewPosition(container, mousey){
    const elementos = [...container.querySelectorAll("li:not(.dragging)")];
    let closest = null;
    let closestOffset = Number.NEGATIVE_INFINITY;


    for (const item of elementos) {
        const box = item.getBoundingClientRect();
        const offset = mousey - box.top - box.height / 2;
        if (offset < 0 && offset > closestOffset) {
            closestOffset = offset;
            closest = item;
        }
    }
    return closest;

    
}
lista_compras.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getNewPosition(lista_compras, e.clientY);
    const draggingItem = document.querySelector(".dragging");

    if (!draggingItem) return;

    if (afterElement == null) {
        lista_compras.appendChild(draggingItem);
    } else {
        lista_compras.insertBefore(draggingItem, afterElement);
    }
});

lista_compras.addEventListener("drop", () => {
    const newList = [];
    lista_compras.querySelectorAll("li").forEach((li) => {
        const index = parseInt(li.dataset.index);
        newList.push(itens[index]);
    });
    itens = newList;
    atualizarlista();
});

const lixeira = document.getElementById("lixeira");

lixeira.addEventListener("dragover", (e) => {
    e.preventDefault();
    lixeira.classList.add("hover");
});

lixeira.addEventListener("dragleave", () => {
    lixeira.classList.remove("hover");
});

lixeira.addEventListener("drop", () => {
    if (itemArrastadoIndex !== null) {
        itens.splice(itemArrastadoIndex, 1); // remove item
        itemArrastadoIndex = null;
        atualizarlista();
        lixeira.classList.remove("hover");
    }
});