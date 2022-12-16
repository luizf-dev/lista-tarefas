const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.divDelete button')
const ul = document.querySelector('ul')



var itensDB = []

/*btnDeleteAll.onclick = () => {
  itensDB = []
  updateDB()
}*/

btnDeleteAll.onclick = function(){

    if(itensDB == ''){
      alert('Não existem tarefas salvas para deletar!');
    }else{
       const confirmDelete = confirm("Atenção!! Deseja mesmo excluir todas as tarefas? Se não deseja excluir todas as tarefas, clique em cancelar e selecione uma tarefa específica para deletar!");
        if(confirmDelete){
          itensDB = [];
          updateDB();
          window.location.reload();
        }
    }  
}

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB()
  }
})

btnInsert.onclick = () => {

  if(texto.value == ""){
    alert("Digite alguma tarefa válida!");
  }else if(texto.value != ""){
    setItemDB()    
  }
  /*
  if (texto.value != '') {
    setItemDB()
  }*/
}

function setItemDB() {
  if (itensDB.length >= 200) {
    alert('Limite máximo de 200 itens atingido! Exclua algumas tarefas! ')
    return
  }



  itensDB.push({ 'item': texto.value, 'status': '' })
  updateDB()
}

function updateDB() {
  localStorage.setItem('todolist', JSON.stringify(itensDB))
  loadItens()
}

function loadItens() {
  ul.innerHTML = "";
  itensDB = JSON.parse(localStorage.getItem('todolist')) ?? []
  itensDB.forEach((item, i) => {
    insertItemTela(item.item, item.status, i)
  })
}

function insertItemTela(text, status, i) {
  const li = document.createElement('li')
  
  
  li.innerHTML = `
    <div class="div-li">
      <input type="checkbox" ${status} data-i=${i} onchange="done(this, ${i});" />
      <span id='tarefa-1' data-si=${i}>${text}</span>
      <button class="btn" onclick="removeItem(${i})" data-i=${i}><i class='fas fa-trash text-danger'></i></button>
    </div>
    `
  ul.appendChild(li)

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through')
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }

  texto.value = ''
  
}

function done(chk, i) {

  if (chk.checked) {
    itensDB[i].status = 'checked' 
  } else {
    itensDB[i].status = '' 
  }

  updateDB()
}

function removeItem(i) {
  itensDB.splice(i, 1)
  updateDB()
}

loadItens()