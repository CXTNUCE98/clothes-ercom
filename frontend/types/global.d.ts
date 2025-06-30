declare module '#app' {
  interface NuxtApp {
    $ElMessage: typeof import('element-plus')['ElMessage']
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ElMessage: typeof import('element-plus')['ElMessage']
  }
}

export {} 