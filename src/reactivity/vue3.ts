let activeEffect: (() => void) | null = null
const targetMap = new WeakMap<object, Map<string, Set<() => void>>>()

function track<
  Target extends object,
  Key extends keyof Target,
>(target: Target, key: Key) {
  if (!activeEffect)
    return

  let depsMap = targetMap.get(target)

  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  if (!dep.has(activeEffect))
    dep.add(activeEffect)
}

function trigger<
  Target extends object,
  Key extends keyof Target,
>(target: Target, key: Key) {
  const depsMap = targetMap.get(target)

  if (!depsMap)
    return

  const dep = depsMap.get(key)

  if (dep)
    dep.forEach(effect => effect())
}

export function reactive<
  Target extends object,
  Key extends keyof Target,
  >(target: Target) {
  const proxy = new Proxy(target, {
    get(target, key: Key, receiver) {
      const res = Reflect.get(target, key, receiver)
      track(target, key)

      return res
    },
    set(target, key: Key, value, receiver) {
      const oldValue = target[key]
      const res = Reflect.set(target, key, value, receiver)

      if (oldValue !== res)
        trigger(target, key)

      return res
    },
  })

  return proxy
}

export function effect(fn: () => void) {
  activeEffect = fn
  fn()
  activeEffect = null
}
