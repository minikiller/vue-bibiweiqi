<template>
  <div>
    <h2>{{account.user.name}}</h2>
    <b-table striped hover :items="items" :fields="fields">
      <template v-slot:cell(actions)="row">
        <b-button
          size="sm"
          @click="info(row.item, row.index, $event.target)"
          class="mr-1"
          >下载</b-button
        >
      </template>
    </b-table>
  </div>
</template>
<script>
import config from "config";
import { authHeader,handleResponse } from "../_helpers";
import { userService } from "../_services";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  data() {
    return {
      fields: [
        {
          key: "black_info",
          label: "黑方信息",
          // sortable: true,
        },
        {
          key: "white_info",
          label: "白方信息",
        },
        {
          key: "create_date",
          label: "创建时间",
          class: "my-class",
        },
        { key: "actions", label: "Actions" },
      ],
      items: [],
    };
  },
  mounted() {
    this.getall();
  },
  methods: {
    getall() {
      const requestOptions = {
        method: "GET",
        headers: authHeader(),
      };
      let _data = fetch(`${config.apiUrl}/kifus`, requestOptions)
        .then(handleResponse)
        .then(data => {
          this.items = data.kifus;
          return data;
        });
    }
  }
};
</script>
<style>
.my-class {
  max-width: 300px;
}
</style>
