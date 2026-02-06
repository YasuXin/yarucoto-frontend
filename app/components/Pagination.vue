<script setup lang="ts">
const props = defineProps({
  isPagination: {
    type: Boolean,
    default: false
  },
  paginationCurrentNum: {
    type: Number,
    default: 1
  },
  paginationTotalNum: {
    type: Number,
  }
})

const emit = defineEmits(['moveFirst', 'move', 'moveLast'])

const paginationCurrentNum = computed(() => props.paginationCurrentNum)
const paginationTotalNum = computed(() => props.paginationTotalNum)
const isPagination = computed(() => props.isPagination)

const moveFirstPaginationEvent = () => {
  emit('moveFirst')
}
const movePaginationEvent = (e: any) => {
  emit('move', Number(e.target.dataset.num))
}
const moveLastPaginationEvent = () => {
  emit('moveLast')
}
</script>

<template>
  <nav v-if="isPagination" aria-label="Page navigation example" class="d-flex justify-content-center mt-4 mb-3">
    <ul class="pagination _pagination">
      <li class="page-item _page_item">
        <button @click="moveFirstPaginationEvent" :disabled="paginationCurrentNum === 1" :class="{'_disabled' : paginationCurrentNum === 1}" class="page-link _page_link" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </button>
      </li>
      <li v-for="num in paginationTotalNum" class="page-item _page_item">
        <button @click="movePaginationEvent" :data-num="num" v-if="num > paginationCurrentNum - 4 && num < paginationCurrentNum + 4" :disabled="paginationCurrentNum === num" :class="{'_disabled' : paginationCurrentNum === num}" class="page-link _page_link">{{num}}</button>
      </li>
      <li class="page-item _page_item">
        <button @click="moveLastPaginationEvent" :disabled="paginationCurrentNum === paginationTotalNum" :class="{'_disabled' : paginationCurrentNum === paginationTotalNum}" class="page-link _page_link" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
._page_link {
  background-color: var(--pagination-bg-color);
  color: var(--pagination-font-color);
  border: none;
}
._page_link:hover {
  background-color: var(--no-active-task-box-bg-color);
}
._pagination {
  justify-content: center;
  box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
  -webkit-box-shadow: 1px 1px 4px rgba(0,0,0,0.2);
  border-radius: var(--bs-pagination-border-radius)!important;
}
._disabled {
  box-shadow: inset 2px 2px 5px rgba(0,0,0,0.2);
}
</style>
