<script setup lang="ts">
import type {AdminGoal} from "~/interfaces";

const props = defineProps({
  goal: {
    type: Object as () => AdminGoal,
    required: true
  }
})

const emit = defineEmits(['show'])

const goal = computed(() => props.goal)

const toShow = () => {
  emit('show', goal.value.id)
}
</script>

<template>
  <div class="_goal_container">
    <div class="_goal_box d-flex">
      <div class="_goal_id d-flex align-items-center _txt_limit">
        <span class="_id_no">No.</span>{{goal.id}}
      </div>
      <div class="_goal_column">
        <div class="_goal_row d-flex justify-content-between _text_free">
          <div class="_goal_left d-flex">
            <div class="_goal_title _txt_limit d-flex">{{goal.title}}</div>
            <div class="_goal_year d-flex justify-content-center">
              {{goal.year}}年
            </div>
            <div class="_goal_month d-flex justify-content-center">
              {{goal.month}}月
            </div>
          </div>
          <div class="d-flex _goal_right">
            <div class="_show_btn_parent">
              <a @click="toShow" class="_show_btn _goal_link">詳細</a>
            </div>
          </div>
        </div>
        <div class="_goal_row _goal_row_2 d-flex">
          <div class="_goal_description _txt_limit">
            {{goal.description}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
._goal_container {
  width: 100%;
  padding: 0 20px;
}
._goal_box {
  width: calc(100% - 20px);
  border-bottom: var(--middle-border);
  margin: 0 10px;
  padding-right: 10px;
}
._goal_id {
  width: 100px;
  padding-left: 10px;
}
._goal_column {
  width: calc(100% - 100px);
  padding-left: 10px;
}
._goal_row {
  padding: 10px 0;
  border-bottom: var(--thin-border);
}
._goal_left {
  width: calc(100% - 60px);
}
._goal_title {
  width: calc(100% - 120px);
  margin-left: 10px;
}
._goal_year {
  width: 100px;
}
._goal_month {
  width: 100px;
}
._show_btn_parent {
  width: 60px;
  padding-left: 5px;
  border-left: var(--thin-border);
  text-align: center;
}
._goal_link {
  color: var(--font-color);
}
._goal_link:hover {
  cursor: pointer;
}
._goal_description {
  width: 90%;
  padding: 0 10px;
  font-size: 0.8rem;
}
._txt_limit {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
._goal_row_2 {
  border-bottom: none;
}
._goal_box {
  width: 100%;
  border-bottom: 0;
  margin: 0;
  padding: 0;
}
@media (max-width: 960px) {
  ._goal_id {
    width: 80px;
  }
  ._goal_column {
    width: calc(100% - 80px);
  }
}
@media (max-width: 768px) {
  ._goal_id {
    padding:0;
  }
  ._goal_title {
    width: calc(100% - 80px);
  }
  ._goal_year {
    width: 90px;
  }
  ._goal_month {
    width: 90px;
  }
}
@media (max-width: 576px) {
  ._id_no {
    display: none;
  }
  ._goal_container {
    width: 100%;
    margin: 0;
    padding: 0 5px 0 10px;
  }
  ._goal_box {
    width: 100%;
  }
  ._goal_column {
    width: calc(100% - 60px);
  }
  ._goal_left {
    width: calc(100% - 40px);
  }
  ._goal_title {
    margin: 0;
  }
  ._goal_row {
    padding: 10px;
  }
  ._goal_id {
    width: 60px;
    justify-content: center;
  }
  ._goal_year {
    width: 70px;
  }
  ._goal_month {
    width: 70px;
  }
  ._show_btn_parent {
    width: 40px;
  }
  ._goal_description {
    padding: 0;
  }
}
@media (max-width: 500px) {
  ._goal_title {
    display: none !important;
  }
  ._goal_year {
    justify-content: start !important;
  }
}
</style>
