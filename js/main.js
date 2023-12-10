
const Main = {

  tasks: [],

  init: function() {

    this.cacheSelectors()
    // Adiciona eventos
    this.bindEvents()
    // Armazenar o conteudo do localStorage num array tasks: [], que, depois, povoará o html
    this.getStoraged()
    // Povoamento do html a partir do array tasks: []
    this.buildTasks()

  },

  cacheSelectors: function() {
    this.$checkButtons = document.querySelectorAll('.check')
    this.$inputTask = document.querySelector('#inputTask')
    this.$list = document.querySelector('#list')
    this.$removeButtons = document.querySelectorAll('.remove')
  },

  bindEvents: function() {
    const self = this

    this.$checkButtons.forEach(function(button){
      button.onclick = self.Events.checkButton_click
    })

    this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this)

    this.$removeButtons.forEach(function(button){
      button.onclick = self.Events.removeButton_click.bind(self)
    })
  },

  /* 
  Essa função tem a finalidade de fazer o get do item tasks do localStorage e armazanar num array que foi iniciado vazio lá em cima (abaixo do Main)
  */
  getStoraged: function() {
    // Essa const task tem escopo local
    const tasks = localStorage.getItem('tasks')
    // this.tasks tem escopo em ao objeto, ou seja, foi aquela const array declarada e inicializada vazia no Main
    this.tasks = JSON.parse(tasks) // Já passa o conteúdo das tarefas (tasks) como objeto
  },

  // Falta fazer. Se o parametro done for true, deve-se adicionar a classe de riscar a tarefa
  getTaskHtml: function(task, done) {
    return `
      <li>          
        <div class="check"></div>
        <label class="task">
          ${task}
        </label>
          <button class="remove" data-task="${task}"></button>
      </li>
    `
  },

  // Povoamento do html a partir do array tasks: []
  buildTasks: function() {
    let html = ''
    /*
    data-task é um parâmetro que guarda o valor, no caso, ${item.task} em data-task para ser usado em outro momento 
    */
    this.tasks.forEach(item => {
      html += this.getTaskHtml(item.task)
    })
    this.$list.innerHTML = html
    /* Após este ponto, o sistema eixou de marcar as tarefas concluídas e, também, não as exlui nem da tela nem do localStorage????????????
    Foi resolvido, parcialmente, com o chamamamento dos métodos cacheSelectors e bindEvents
    */
    this.cacheSelectors() 
    this.bindEvents() // Adiciona eventos
    /*
    Contudo, o sistema atualiza em tela, mas é recarregado com a atualização da tela (recarregamento da tela). Portanto, não está sendo exluído do localStorage
    Para resolver esse problema e, efetivamente, a terefa seja removida do localStorage, vamos para removeButton_click: function(e)
    */
  },

  Events: {
    checkButton_click: function(e) {
      const li = e.target.parentElement
      const isDone = li.classList.contains('done')
      
      if (!isDone) {
        return li.classList.add('done')       
      }

      li.classList.remove('done')
    },

    inputTask_keypress: function(e){      
      const key = e.key
      const value = e.target.value

      if (key === 'Enter') {
        /*
        data-task é um parâmetro que guarda o valor, no caso, ${value} em data-task para ser usado em outro momento 
        */
        this.$list.innerHTML += this.getTaskHtml(value)

        e.target.value = ''

        this.cacheSelectors()
        this.bindEvents()

        // Pegar todas as tarefas salvas no localStorage e armazená-las na const savedTasks
        const savedTasks = localStorage.getItem('tasks')
        // Transformar em objeto todas as tarefas armazenadas em savedTasks
        const savedTasksObj = JSON.parse(savedTasks)
        /*
        Aqui, abaixo, devemos pegar as tarefas salvas que estão em savedTasksObj, acrescentar a elas (no topo da pilha) a nova tarefa obj. Para isso, utilizaremos o operador do JavaScript Spread Operator ...
        */ 
        const obj = [
          {task: value, done: false},
          ...savedTasksObj
        ]

        // Armazenar em localStorage em formato JSON
        localStorage.setItem('tasks', JSON.stringify(obj))

      }
    },

    removeButton_click: function(e){
      /*
      Devemos pegar o texto que está dentro dessa "li" e procurá-lo dentro do array this.tasks, ou seja, o tasks do Main. Quando achar o texto, remove-o e manad atualizar o localStorage.
      */
      const li = e.target.parentElement
      // Atribuimos o valor da tarefa selecionada a value
      const value = e.target.dataset['task']
      /*
      newTasksState é o array temporário que guardara o array this.tasks menos o elemento da tarefa selecionada, no caso, value
      */ 
      const newTasksState = this.tasks.filter(item => item.task !== value)

      localStorage.setItem('tasks', JSON.stringify(newTasksState))
     

      li.classList.add('removed')

      setTimeout(function(){
        li.classList.add('hidden')
      },300)

    }
  }

}

Main.init()

