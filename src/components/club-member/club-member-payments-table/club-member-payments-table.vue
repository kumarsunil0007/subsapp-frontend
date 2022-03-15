<template>
  <q-table
    title="Member Payment History"
    :data="tableData"
    :columns="columns"
    row-key="name"
  >
  </q-table>
</template>

<script>
export default {
  name: "ClubMemberPaymentsTable",
  data: () => ({
    columns: [
      {
        label: "Session Date",
        name: "desc",
        required: false,
        align: "left",
        field: "date",
        sortable: true
      },
      {
        label: "Total",
        required: false,
        align: "center",
        field: "amount",
        sortable: true
      },
      {
        label: "Status",
        required: false,
        align: "center",
        field: "status",
        sortable: true
      }
    ],
    tableData: [
      {
        date: "09/02/2019",
        amount: "€2.00",
        status: "PAID"
      },
      {
        date: "10/02/2019",
        amount: "€2.00",
        status: "PAID"
      },
      {
        date: "11/02/2019",
        amount: "€2.00",
        status: "PENDING"
      }
    ]
  })
};
</script>

<style scoped></style>
