const texto = document.querySelector('input')
const btnInsert = document.querySelector('.divInsert button')
const btnDeleteAll = document.querySelector('.divDelete button')
const ul = document.querySelector('ul')



var itensDB = []



btnDeleteAll.onclick = function(){

    if(itensDB == ''){
      swal("Ops!", "Não existem tarefas salvas para deletar!", "info");
    }else{
      /* const confirmDelete = confirm("Atenção!! Deseja mesmo excluir todas as tarefas? Se não deseja excluir todas as tarefas, clique em cancelar e selecione uma tarefa específica para deletar!");*/
      const confirmDelete = swal({
        title: "Deseja excluir tudo?",
        text: "Você está prestes a deletar todas as tarefas!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((confirmDelete) => {
        if (confirmDelete) {
          swal("Todas as suas tarefas foram deletadas!", {
            icon: "success",
          }); 
          itensDB = [];
          updateDB();
          /*window.location.reload();         */
        } else {
          swal("Suas tarefas estão a salvo!", {
            icon: "success",
          });  
        }
      }); 
    }  
}

texto.addEventListener('keypress', e => {
  if (e.key == 'Enter' && texto.value != '') {
    setItemDB()
  }
})

btnInsert.onclick = () => {

  if(texto.value == ""){
    swal("Ops! :(", "Preencha os campos para cadastrar uma tarefa válida!", "error");
  }else if(texto.value != ""){
    setItemDB()  
  }
}

function setItemDB() {
  if (itensDB.length >= 20) {
    swal("Limite máximo de 20 tarefas!", "Exclua algumas tarefas!", "error");
    return    
  }else{
    itensDB.push({ 'item': texto.value, 'status': '' })
    swal("Sucesso", "Sua tarefa foi cadastrada com sucesso!", "success");
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
    // Exibe um SweetAlert de confirmação
    swal({
      title: "Tem certeza?",
      text: "Você deseja remover esta tarefa?",
      icon: "warning",
      buttons: ["Cancelar", "Remover"],
      dangerMode: true
    })
    .then((willDelete) => {
      if (willDelete) {
        // Se o usuário clicar em "Remover", a tarefa será excluída
        itensDB.splice(i, 1);
        updateDB();
        // Exibe um SweetAlert de sucesso após a remoção
        swal("Tarefa removida com sucesso!", {
          icon: "success",
        });
      } else {
        // Se o usuário cancelar, não faz nada
        swal("Sua tarefa está a salvo!", {
          icon: "info",
        });
      }
    });
  }  

loadItens()

