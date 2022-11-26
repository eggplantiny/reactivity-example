import { Watcher, walk } from '@/reactivity/vue2'
import { effect, reactive } from '@/reactivity/vue3'

function createVue2ReactivityApp() {
  const data = { a: 1, b: 2 }
  const data2 = { msg: 'sad' }

  walk(data)
  walk(data2)

  let sum = 0
  const sumWatcher = new Watcher(() => {
    sum = data.a + data.b
  })

  let msg = ''
  const msgWatcher = new Watcher(() => {
    msg = `hello ${data2.msg} world!`
  })

  console.log(`sum: ${sum}`) // 3

  data.a = 10

  console.log(`sum: ${sum}`) //  12

  data.b = 5

  console.log(`sum: ${sum}`) // 15

  data2.msg = 'happy'

  console.log(msg) // hello happy world!
}

function createVue3ReactivityApp() {
  const numbers = reactive({
    a: 1,
    b: 2,
  })

  let sum = 0
  let multiply = 0

  effect(() => {
    sum = numbers.a + numbers.b
  })

  effect(() => {
    multiply = numbers.a * numbers.b
  })

  console.log(`sum: ${sum}, multiply: ${multiply}`)

  numbers.a = 5
  numbers.b = 10

  console.log(`sum: ${sum}, multiply: ${multiply}`)
}

// createVue2ReactivityApp()
createVue3ReactivityApp()
