import { ElMessage, ElButton, ElInput, ElForm, ElFormItem, ElSelect, ElOption, ElInputNumber, ElPagination, ElLoading } from 'element-plus'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      ElMessage,
      ElButton,
      ElInput,
      ElForm,
      ElFormItem,
      ElSelect,
      ElOption,
      ElInputNumber,
      ElPagination,
      ElLoading
    }
  }
}) 