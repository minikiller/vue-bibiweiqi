<template>
  <div>
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
import { authHeader } from "../_helpers";
export default {
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
      fetch(`${config.apiUrl}/kifus`, requestOptions).then(this.handleResponse);
    },
    handleResponse(response) {
      return response.text().then((text) => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
          if (response.status === 401) {
            // auto logout if 401 response returned from api
            localStorage.removeItem("user");
            location.reload(true);
          }

          const error = (data && data.message) || response.statusText;
          return Promise.reject(error);
        }
        this.items = data.kifus;
        return data;
      });
    },
  },
};
</script>
<style>
.my-class {
  max-width: 300px;
}
</style>
