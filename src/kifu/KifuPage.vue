<template>
  <div>
    <b-tabs content-class="mt-3" @activate-tab="activate_tab">
      <b-tab active>
        <template v-slot:title>
          <i class="fas fa-user-lock"></i>个人棋谱
        </template>
        <div class="table-responsive">
          <b-table
            striped
            hover
            :items="items"
            :fields="fields"
            table-class="text-nowrap"
            responsive
          >
            <template v-slot:cell(actions)="row">
              <b-button
                @click="info(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >下载</b-button>
              <b-button
                @click="open(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >打开</b-button>
              <b-button
                v-if="row.item.is_share==false"
                @click="shared(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >共享</b-button>
              <b-button
                v-if="row.item.is_analyse"
                @click="aiinfo(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >ai</b-button>
            </template>
          </b-table>
        </div>
      </b-tab>
      <b-tab>
        <template v-slot:title>
          <i class="fas fa-user-friends"></i> 共享棋谱
        </template>
        <div class="table-responsive">
          <b-table
            striped
            hover
            :items="share_items"
            :fields="fields"
            table-class="text-nowrap"
            responsive
          >
            <template v-slot:cell(actions)="row">
              <b-button
                @click="info(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >下载</b-button>
              <b-button
                @click="open(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >打开</b-button>
              <b-button
                v-if="account.user.isadmin"
                @click="analyse(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >分析</b-button>
              <b-button
                v-if="row.item.is_analyse"
                @click="aiinfo(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >AI棋谱</b-button>
              <b-button
                v-if="row.item.is_analyse"
                @click="aiwinrate(row.item, row.index, $event.target)"
                class="btn-sm btn-primary"
              >AI胜率</b-button>
            </template>
          </b-table>
        </div>
      </b-tab>
    </b-tabs>
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
          key: "id",
          label: "ID"
          // sortable: true,
        },
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
          key: "moves",
          label: "手数"
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
    ...mapMutations("room", ["SET_SPINNER"]),
    activate_tab(newTabIndex) {
      console.log("new tab index is " + newTabIndex);
      if (newTabIndex == 0) this.getall();
      else this.getShareAll();
    },
    open(item) {
      this.$router.push({ name: "KifuView", params: { game: item } });
    },
    //ai analyse
    analyse(item) {
      gameService.analyseKifu(item.id);
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
    aiwinrate(item, index, event) {
      var that = this;
      gameService.winrate(item.id).then(data => {
        const h = that.$createElement;
        const titleVNode = h("div", {
          domProps: { innerHTML: "胜率分析折线图" }
        });

        const messageVNode = h("div", { class: ["foobar"] }, [
          h("b-img", {
            props: {
              src: config.apiUrl + data.imgPath,
              thumbnail: true,
              center: true,
              fluid: true
              // rounded: "circle"
            }
          })
        ]);
        that.$bvModal.msgBoxOk([messageVNode], {
          title: [titleVNode],
          buttonSize: "sm",
          centered: true,
        });
      });
    },
    aiinfo(item, index, event) {
      console.log(item, index, event);
      let id = item.id;
      let filename;
      const requestOptions = {
        method: "GET",
        headers: authHeader()
      };
      fetch(`${config.apiUrl}/kifus/ai/${id}`, requestOptions)
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
    async fenchData() {
      this.SET_SPINNER(true);
      // this.$store.commit("room/SET_SPINNER", true);
      const requestOptions = {
        method: "GET",
        headers: authHeader()
      };
      return new Promise(resolve => {
        setTimeout(async () => {
          const res = await fetch(`${config.apiUrl}/kifus/`, requestOptions);
          const val = await res.json();
          resolve(val.kifus);
          this.SET_SPINNER(false);
        }, 1000);
      });
    },
    async getall() {
      const _data = await this.fenchData();
      this.items = _data;
    },
    getShareAll() {
      this.SET_SPINNER(true);
      const requestOptions = {
        method: "GET",
        headers: authHeader()
      };
      setTimeout(() => {
        let _data = fetch(`${config.apiUrl}/kifus/share`, requestOptions)
          .then(handleResponse)
          .then(data => {
            this.share_items = data.kifus;
            this.SET_SPINNER(false);
            return data;
          });
      }, 1000);
    }
  }
};
</script>
<style>
.my-class {
  max-width: 300px;
}
</style>
