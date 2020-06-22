<template>
  <div class="table-responsive">
    <b-overlay :show="show" rounded="sm">
      <b-tabs content-class="mt-3" @activate-tab="activate_tab">
        <b-tab active>
          <template v-slot:title><i class="fas fa-user-lock"></i>个人棋谱</template>
          <b-table striped hover :items="items" :fields="fields">
            <template v-slot:cell(actions)="row">
              <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">下载</b-button>
              <router-link
                :to="{ name: 'KifuView', params: { game: row.item } }"
                class="btn-sm btn-primary"
              >打开</router-link>
              <b-button
                size="sm"
                v-if="row.item.is_share==false"
                @click="shared(row.item, row.index, $event.target)"
                class="mr-1"
              >共享</b-button>
            </template>
          </b-table>
        </b-tab>
        <b-tab>
          <template v-slot:title><i class="fas fa-user-friends"></i>  共享棋谱</template>
          <b-table striped hover :items="share_items" :fields="fields">
            <template v-slot:cell(actions)="row">
              <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">下载</b-button>
              <router-link
                :to="{ name: 'KifuView', params: { game: row.item } }"
                class="btn-sm btn-primary"
              >打开</router-link>
            </template>
          </b-table>
        </b-tab>
      </b-tabs>
    </b-overlay>
  </div>
</template>
<script>
import config from "config";
import { authHeader, handleResponse } from "../_helpers";
import { userService, gameService } from "../_services";
import { mapState, mapMutations } from "vuex";
export default {
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  data() {
    return {
      name: "我的棋谱",
      show: false,
      fields: [
        {
          key: "black_info",
          label: "黑方信息"
          // sortable: true,
        },
        {
          key: "white_info",
          label: "白方信息"
        },
        {
          key: "result",
          label: "结果"
        },
        {
          key: "create_date",
          label: "创建时间",
          class: "my-class"
        },
        { key: "actions", label: "Actions" }
      ],
      items: [],
      share_items: []
    };
  },
  mounted() {
    this.getall();

    this.updateNavTitle(this.name);
  },
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"]),
    ...mapMutations("alert", ["success", "error", "clear"]),
    activate_tab(newTabIndex) {
      console.log("new tab index is " + newTabIndex);
      if (newTabIndex == 0) this.getall();
      else this.getShareAll();
    },
    info(item, index, event) {
      console.log(item, index, event);
      let id = item.id;
      let filename;
      const requestOptions = {
        method: "GET",
        headers: authHeader()
      };
      fetch(`${config.apiUrl}/kifus/${id}`, requestOptions)
        .then(response => {
          if (response.status === 200) {
            filename = response.headers.get("x-suggested-filename");

            return response.blob();
          } else {
            return;
          }
        })
        .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
        });
    },
    shared(item, index, event) {
      let id = item.id;
      gameService.shareKifu(id).then(data => {
        this.success(data.message);
      });
    },
    getall() {
      this.show = true;
      const requestOptions = {
        method: "GET",
        headers: authHeader()
      };
      let _data = fetch(`${config.apiUrl}/kifus/`, requestOptions)
        .then(handleResponse)
        .then(data => {
          this.items = data.kifus;
          this.show = false;
          return data;
        });
    },
    getShareAll() {
      this.show = true;
      const requestOptions = {
        method: "GET",
        headers: authHeader()
      };
      let _data = fetch(`${config.apiUrl}/kifus/share`, requestOptions)
        .then(handleResponse)
        .then(data => {
          this.show = false;
          this.share_items = data.kifus;
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
