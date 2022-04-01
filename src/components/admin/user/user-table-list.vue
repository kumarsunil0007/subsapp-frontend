<template>
<div>
  <a-table
    class="gx-table-responsive"
    :columns="columns"
    :data-source="schedule"
    :row-key="record => record.id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
  >
    <div slot="startTimeRender" slot-scope="text">{{ nTime(text) }}</div>
    <div slot="sessionLength" slot-scope="text">
      {{ floatToHour(text) }} Hours
    </div>

    <div slot="created_at" slot-scope="text">{{ nFormat(text) }}</div>
    <div slot="phone" slot-scope="text">
      <template v-if="text">+353 {{ text }}</template>
      <template v-else>N/A</template>
    </div>
    <div slot="commission" slot-scope="text">
      <template v-if="text">{{ text }}</template>
    
      
      <template v-else>N/A</template>
          <div slot="handlers2" slot-scope="text, record" class="gx-text-right">
              <a-icon type="edit" @click="editClick(record)" />
    </div>
    </div>


    <div slot="handlers" slot-scope="text, record" class="gx-text-right">
      <a-button size="small" type="primary" @click="viewClub(record)"
        >View</a-button
      >
    </div>

    <div slot="handlers2" slot-scope="text, record" class="gx-text-right">
      <a-button size="small" type="primary" @click="editClick(record)"
        >Update Commission</a-button
      >
    </div>
  </a-table>
    <a-modal :visible="visible" title="Update Commission" @cancel="close">
    <template slot="footer">
      <a-button key="back" @click="close" >
        Cancel
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="updateCommission"
      >
        Update Commission
      </a-button>
    </template>
    <a-form :form="form" layout="vertical">
      <div class="info">
        <a-form-item label="Commission">
          <a-input v-decorator="fields.commission" placeholder="Enter Commission" />
        </a-form-item>
      </div>
    </a-form>
  </a-modal>

</div>
</template>

<script>
import nTime from "@/mixins/time";
import nCurrency from "@/mixins/currency";

const columns = [
  {
    title: "Club Name",
    dataIndex: "club_name",
    key: "club_name",
    sorter: (a, b) => {
      if (a.preferred_name < b.preferred_name) {
        return -1;
      }
      if (a.preferred_name > b.preferred_name) {
        return 1;
      }
      return 0;
    }
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    sorter: (a, b) => {
      if (a.work_email < b.work_email) {
        return -1;
      }
      if (a.work_email > b.work_email) {
        return 1;
      }
      return 0;
    }
  },
  {
    title: "Phone",
    dataIndex: "contact_number",
    key: "contact_number",
    scopedSlots: {
      customRender: "phone"
    }
  },
  {
    title: "Club Admin",
    dataIndex: "club_admin",
    key: "club_admin"
  },
  {
    title: "Commission",
    dataIndex: "commission",
    key: "commission",
    scopedSlots: {
      customRender: "commission"
    }
  },
  {
    dataIndex: "handlers",
    key: "handlers",
    scopedSlots: {
      customRender: "handlers"
    }
  },
  {
    dataIndex: "handlers2",
    key: "handlers2",
    scopedSlots: {
      customRender: "handlers2"
    }
  },
];
import notifications from "@/common/notifications/notification.service";
import { memberService } from "@/common/api/api.service";
import { adminService } from "@/common/api/api.service";
// import NPage from "@/components/ui/n-page/n-page";
// import  updateClubComission  from "@/components/club-member/update-commission-modal/update-commission-modal";
export default {
  name: "ClubMemberTable",
  mixins: [nTime, nCurrency],
  props: {
    filters: {
      required: false,
      type: Object,
      default: function() {
        return {};
      }
    },
    visible: {
      default: false,
      required: true,
      type: Boolean
    },
  },
  data() {
    return {
      columns,
      schedule: [],
      pagination: { pageSize: 10 },
      loading: false,
      form: this.$form.createForm(this),
      dataLoading: false,
      loading: false,
      idsss :'',
       fields: {
        commission: [
          "commission",
          {
            rules: [
              {
                required: true,
                message: "Commission is required"
              }
            ]
          }
        ],
      }
    };    
  },
  watch: {
    filters: {
      handler: function() {
        this.getClubMembers();
      },
      deep: true
    }
  },
  mounted() {
    this.getClubMembers();
  },
  methods: {
    viewClub({ id }) {
      this.$router.push(`/admin/club-info/${id}`);
    },
    updateClubComission(record){

      var id = record.id;
      var commission = record.commission;
      
      
    },
    userTableList(memberId, status) {
      memberService
        .userTableList(memberId, {
          status: status,
          clubId: this.clubId
        })
        .then(resp => {
          if (resp.data.success) {
            this.getClubMembers();
          }
        });
    },
    updateCommission(record) {
      console.log(record);
      //e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true;
          values.id = this.idsss;
          memberService
            .updateCommission(values)
            .then(resp => {
              this.loading = false;
              if (resp.data.success) {
                notifications.success("Commission Update Successfully");
                this.getClubMembers();
                this.visible=false;
              } else {
                notifications.warn(resp.data.message);
                this.getClubMembers();
                this.visible=false;
              }
            })
            .catch(error => {
              this.loading = false;
              this.visible=false;
              this.getClubMembers();
              console.log(error);
            });
        }
      });
    },


    editClick(record){
      this.visible =true;
      this.idsss = record.id;
     // console.log(record.id,record.commission);
      this.form.setFieldsValue({
        commission: record.commission,
        id: record.id
      });
      
    },  
    close() {
      this.form.resetFields();
      this.visible=false;
      this.$emit("close");
    },
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.getClubMembers({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    getClubMembers(params = {}) {
      this.loading = true;
      let data;

      if (this.filters) {
        if (this.filters.keyword) {
          data = { keyword: this.filters.keyword };
        }
      }
      adminService
        .query({
          results: this.pagination.pageSize,
          ...params,
          ...data
        })
        .then(resp => {
          this.loading = false;
          if (resp.data.success) {
            const pagination = { ...this.pagination };
            pagination.total = resp.data.result.total;
            this.pagination = pagination;
            this.schedule = resp.data.result.data;
          }
        });
    }
  }
};
</script>
