<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  countAll: {
    type: Number,
    required: true
  },
  countByFreeMember: {
    type: Number,
    required: true
  },
  countByPaidMember: {
    type: Number,
  },
  countAllCreatedBeforeMonth: {
    type: Number,
    required: true
  },
  countByFreeMemberCreatedBeforeMonth: {
    type: Number,
    required: true
  },
  countByPaidMemberCreatedBeforeMonth: {
    type: Number,
  },
  isWide: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="_table_parent">
    <h5 class="_table_title">{{title}}：</h5>
    <table class="_table w-100"
           :count-all="countAll"
           :count-all-created-before-month="countAllCreatedBeforeMonth"
           :count-by-free-member="countByFreeMember"
           :count-by-free-member-created-before-month="countByFreeMemberCreatedBeforeMonth"
           :title="title">
      <thead>
      <tr>
        <th></th>
        <th>すべて</th>
        <th>新規<span v-show="isWide">（1か月以内）</span></th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <th>全<span v-show="isWide">会員</span></th>
        <td>{{countAll}}</td>
        <td>{{countAllCreatedBeforeMonth}}</td>
      </tr>
      <tr>
        <th>無料<span v-show="isWide">会員</span></th>
        <td>{{countByFreeMember}}</td>
        <td>{{countByFreeMemberCreatedBeforeMonth}}</td>
      </tr>
      <tr>
        <th>有料<span v-show="isWide">会員</span></th>
        <td>{{countByPaidMember}}</td>
        <td>{{countByPaidMemberCreatedBeforeMonth}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
._table_parent {
  border: var(--middle-border);
  border-radius: 10px;
  box-shadow: var(--task-shadow);
  padding: 20px 20px 40px 20px;
}
._table_title {
  margin-left: 10px;
}
table._table {
  border: var(--thick-border);
  border-collapse: collapse;
}
tr, th, td {
  border: var(--middle-border);
  border-collapse: collapse;
  padding: 5px 5px;
}
th {
  text-align: center;
  background-color: var(--theme-color5);
  color: rgb(220,220,220);
}
td {
  text-align: end;
}
</style>
