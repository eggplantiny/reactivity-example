type WatcherGetter = () => void

class Dep {
  subscribers: WatcherGetter[]
  public static target: WatcherGetter | null

  constructor() {
    this.subscribers = []
  }

  depend() {
    if (Dep.target)
      this.subscribers.push(Dep.target)
  }

  notify() {
    for (const subscribe of this.subscribers)
      subscribe()
  }
}

function defineReactivity<
  Target extends object,
  Key extends keyof Target,
>(target: Target, key: Key) {
  const dep = new Dep()
  let val = target[key]

  Object.defineProperty(target, key, {
    get() {
      dep.depend()
      return val
    },
    set(newValue) {
      if (val === newValue)
        return

      val = newValue
      dep.notify()
    },
  })
}

export function walk(data: any) {
  const keys = Object.keys(data)

  for (const key of keys)
    defineReactivity(data, key)
}

export class Watcher {
  getter: WatcherGetter

  constructor(getter: WatcherGetter) {
    this.getter = getter
    this.get()
  }

  get() {
    Dep.target = this.getter
    this.getter()
    Dep.target = null
  }
}
