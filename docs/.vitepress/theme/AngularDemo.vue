<script setup lang="ts">
import { createComponent, type ApplicationRef, type Type } from '@angular/core'
import { createApplication } from '@angular/platform-browser'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Angular 예제(docs/components/demos/<이름>.ts의 default export 컴포넌트)를 이 자리에 붙인다.
 * 문서 사이트는 Vue(VitePress)라 예제는 브라우저에서만, 예제마다 Angular 애플리케이션(zoneless)을 하나씩 만들어 그린다
 */
const props = defineProps<{ name: string }>()
const demos = import.meta.glob<{ default: Type<unknown> }>('../../components/demos/**/*.ts')

const el = ref<HTMLElement>()
let app: ApplicationRef | undefined
let unmounted = false
const loaded = ref(false)

onMounted(async () => {
  const load = demos[`../../components/demos/${props.name}.ts`]
  if (!load) throw new Error(`예제가 없습니다: ${props.name}`)
  const [{ default: Demo }, appRef] = await Promise.all([load(), createApplication()])
  if (unmounted) return appRef.destroy()
  app = appRef
  app.attachView(createComponent(Demo, { environmentInjector: app.injector, hostElement: el.value! }).hostView)
  loaded.value = true
})
onBeforeUnmount(() => {
  unmounted = true
  app?.destroy()
})
</script>

<template>
  <slot v-if="!loaded" />
  <div ref="el" class="angular-demo"></div>
</template>
