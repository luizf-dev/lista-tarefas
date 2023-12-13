const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.divDelete button')
const ul = document.querySelector('ul')

var itensDB = [];

btnDeleteAll.onclick = function(){

    if(itensDB == ''){
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ops! :(',
        text: 'Não existem tarefas salvas para deletar!',
        showConfirmButton: false,
        timer: 4000
      })
    }else{
      const deleteAll = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        }    
      })  
      deleteAll.fire({
        title: 'Deseja deletar todas as tarefas?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, deletar!',
        cancelButtonText: 'Não, cancelar!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // Se o usuário clicar em "deletar", todas as tarefa serão excluídas
          itensDB = [];
          updateDB();
          deleteAll.fire(
            'Deletado!',
            'Todas as tarefas foram apagadas!',
            'success'
          )
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          deleteAll.fire(
            'Cancelado!',
            'Suas tarefas estão salvas! :)',
            'success'
          )
        }
      })   
      
    }  
}

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB()
  }
})

btnInsert.onclick = () => {

  if(texto.value == ""){
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'Ops!',
      text: 'Preencha o campo corretamente!',
      showConfirmButton: false,
      timer: 4000
    })
  }else if(texto.value != ""){
    setItemDB()  
  }
}

function setItemDB() {
  if (itensDB.length >= 200) {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Limite de 200 tarefas atingido!',
      text: 'Exclua algumas tarefas!',
      showConfirmButton: false,
      timer: 4000
    }) 
    return    
  }else{
    itensDB.push({ 'item': texto.value, 'status': '' })
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Sua tarefa foi salva!',
      showConfirmButton: false,
      timer: 3000
    })    
    updateDB()
  }
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
      <button class="btn" onclick="removeItem(${i})" data-i=${i}><i class='fas fa-trash'></i></button>
    </div>
    `
  ul.appendChild(li)

  if (status) {
    document.querySelector(`[data-si="${i}"]`).classList.add('line-through');
    document.querySelector(`.div-li`).classList.add('bg');
  } else {
    document.querySelector(`[data-si="${i}"]`).classList.remove('line-through')
  }

  texto.value = '';  
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
  const removeItens = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    }    
  })  
  removeItens.fire({
    title: 'Deseja excluir o item?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sim, deletar!',
    cancelButtonText: 'Não, cancelar!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Se o usuário clicar em "Remover", a tarefa será excluída
      itensDB.splice(i, 1);
      updateDB();
      removeItens.fire(
        'Deletado!',
        'Sua tarefa foi apagada!',
        'success'
      )
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      removeItens.fire(
        'Cancelado!',
        'Sua tarefa está salva! :)',
        'success'
      )
    }
  })    
}  

loadItens()

