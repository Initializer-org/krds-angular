<script setup lang="ts">
import { computed } from 'vue'
import { data } from './component-meta.data'

const props = defineProps<{ name: string }>()
const api = computed(() => data[props.name])
</script>

<template>
  <template v-if="api">
    <p v-if="api.selector">
      선택자 <code>{{ api.selector }}</code
      ><template v-if="api.exportAs"
        >, 템플릿 참조 <code>#ref="{{ api.exportAs }}"</code></template
      >
    </p>

    <template v-if="api.selector || api.inputs.length">
      <h3>Inputs</h3>
      <table v-if="api.inputs.length">
        <thead>
          <tr>
            <th>이름</th>
            <th>타입</th>
            <th>기본값</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="input in api.inputs" :key="input.name">
            <td>
              <code>{{ input.twoWay ? `[(${input.name})]` : input.name }}</code
              ><span v-if="input.required"> (필수)</span>
            </td>
            <td>
              <code>{{ input.type }}</code>
            </td>
            <td>
              <code v-if="input.default">{{ input.default }}</code
              ><template v-else>-</template>
            </td>
            <td>{{ input.description }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else>없음</p>
    </template>

    <template v-if="api.outputs.length">
      <h3>Outputs</h3>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>값</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="output in api.outputs" :key="output.name">
            <td>
              <code>{{ output.name }}</code>
            </td>
            <td>
              <code>{{ output.type }}</code>
            </td>
            <td>{{ output.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-if="api.methods.length">
      <h3>Methods</h3>
      <table>
        <thead>
          <tr>
            <th>이름</th>
            <th>시그니처</th>
            <th>설명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="method in api.methods" :key="method.name">
            <td>
              <code>{{ method.name }}</code>
            </td>
            <td>
              <code>{{ method.signature }}</code>
            </td>
            <td>{{ method.description }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <template v-if="api.types">
      <h3>타입</h3>
      <div v-html="api.types"></div>
    </template>
  </template>
</template>
