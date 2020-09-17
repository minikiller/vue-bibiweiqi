<template>
  <div>
    <b-button @click="uploader">上传棋谱</b-button>
    <input
      type="file"
      ref="file"
      @change="onFileChange(
          $event.target.name, $event.target.files)"
      style="display:none"
    />
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
            <template v-slot:cell(index)="row">{{ row.index + 1 }}</template>
            <template v-slot:cell(id)="row">
              <b class="text-info" :id="'row'+row.item.id">{{ row.item.id }}</b>
              <b-tooltip :target="'row'+row.item.id" variant="danger">{{row.item.comment}}</b-tooltip>
            </template>
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
        <b-row align-v="center">
          <b-col cols="4"></b-col>
          <b-col cols="4">
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              @input="paginate"
            ></b-pagination>
          </b-col>
          <b-col cols="4"></b-col>
          <!-- <p class="mt-3">Current Page: {{ currentPage }}</p> -->
        </b-row>
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
            <template v-slot:cell(index)="row">{{ row.index + 1 }}</template>
            <template v-slot:cell(id)="row">
              <b class="text-info" :id="'row'+row.item.id">{{ row.item.id }}</b>
              <b-tooltip :target="'row'+row.item.id" variant="danger">{{row.item.comment}}</b-tooltip>
            </template>
            <template v-slot:cell(actions)="row">
              <b-dropdown id="dropdown-aria" text="Action" variant="primary" class="m-2">
                <b-dropdown-item-button @click="info(row.item, row.index, $event.target)">下载</b-dropdown-item-button>
                <b-dropdown-item-button @click="open(row.item, row.index, $event.target)">打开</b-dropdown-item-button>
                <b-dropdown-item-button v-if="account.user.isadmin"
                  @click="comment_click(row.item, row.index, $event.target)"
                >备注</b-dropdown-item-button>
                <b-dropdown-item-button
                  v-if="account.user.isadmin"
                  @click="analyse(row.item, row.index, $event.target)"
                >分析</b-dropdown-item-button>
                <b-dropdown-item-button
                  v-if="row.item.is_analyse"
                  @click="aiinfo(row.item, row.index, $event.target)"
                >AI棋谱</b-dropdown-item-button>
                <b-dropdown-item-button
                  v-if="row.item.is_analyse"
                  @click="aiwinrate(row.item, row.index, $event.target)"
                >AI胜率</b-dropdown-item-button>
                <b-dropdown-item-button
                  v-if="row.item.is_analyse"
                  @click="drops(row.item, row.index, $event.target)"
                >AI败招</b-dropdown-item-button>
              </b-dropdown>
            </template>
          </b-table>
        </div>
        <b-row align-v="center">
          <b-col cols="4"></b-col>
          <b-col cols="4">
            <b-pagination
              v-model="share_currentPage"
              :total-rows="share_totalRows"
              :per-page="perPage"
              @input="shared_paginate"
            ></b-pagination>
          </b-col>
          <b-col cols="4"></b-col>
          <!-- <p class="mt-3">Current Page: {{ currentPage }}</p> -->
        </b-row>
      </b-tab>
    </b-tabs>
    <div>
      <b-modal id="modal" title="棋谱备注" @ok="handleOk">
        <b-form-textarea
          id="textarea"
          v-model="comment"
          placeholder="Enter something..."
          rows="3"
          max-rows="6"
        ></b-form-textarea>
        <template v-slot:modal-footer="{ ok, cancel }">
          <!-- Emulate built in modal footer ok and cancel button actions -->
          <b-button size="sm" variant="success" @click="ok()">确定</b-button>
          <b-button size="sm" variant="danger" @click="cancel()">取消</b-button>
          <!-- Button with custom close trigger value -->
        </template>
      </b-modal>
    </div>
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
      account: (state) => state.account,
    }),
  },
  data() {
    return {
      name: "我的棋谱",
      show: false,
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      share_currentPage: 1,
      share_totalRows: 0,
      comment: "",
      id: 0,
      fields: [
        { key: "index", label: "序号" },
        {
          key: "id",
          label: "ID",
          // sortable: true,
        },
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
          key: "moves",
          label: "手数",
        },
        {
          key: "result",
          label: "结果",
        },
        {
          key: "create_date",
          label: "创建时间",
          class: "my-class",
        },
        { key: "actions", label: "Actions" },
      ],
      items: [],
      share_items: [],
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
    //备注
    comment_click(item) {
      //todos add messagebox
      this.comment = item.comment;
      this.id = item.id;
      this.$bvModal.show("modal");
    },
    handleOk() {
      var _data = { comment: this.comment };
      gameService.commentKifu(this.id, _data).then((data) => {
        this.success(data.message);
      });
    },
    //ai analyse
    analyse(item) {
      gameService.analyseKifu(item.id).then((data) => {
        this.success(data.message);
      });
    },
    info(item, index, event) {
      console.log(item, index, event);
      let id = item.id;
      let filename;
      const requestOptions = {
        method: "GET",
        headers: authHeader(),
      };
      fetch(`${config.apiUrl}/kifus/${id}`, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            filename = response.headers.get("x-suggested-filename");

            return response.blob();
          } else {
            return;
          }
        })
        .then((blob) => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
          a.click();
          a.remove(); //afterwards we remove the element again
        });
    },
    drops(item, index, event) {
      if (item.drops_data) alert(item.drops_data);
      else alert("没有找到数据！");
    },
    aiwinrate(item, index, event) {
      var that = this;
      gameService.winrate(item.id).then((data) => {
        const h = that.$createElement;
        const titleVNode = h("div", {
          domProps: { innerHTML: "胜率分析折线图" },
        });

        const messageVNode = h("div", { class: ["foobar"] }, [
          h("b-img", {
            props: {
              src: config.apiUrl + data.imgPath,
              thumbnail: true,
              center: true,
              fluid: true,
              // rounded: "circle"
            },
          }),
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
        headers: authHeader(),
      };
      fetch(`${config.apiUrl}/kifus/ai/${id}`, requestOptions)
        .then((response) => {
          if (response.status === 200) {
            filename = response.headers.get("x-suggested-filename");

            return response.blob();
          } else {
            return;
          }
        })
        .then((blob) => {
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
      gameService.shareKifu(id).then((data) => {
        this.success(data.message);
      });
    },
    async fenchData() {
      this.SET_SPINNER(true);
      // this.$store.commit("room/SET_SPINNER", true);
      const requestOptions = {
        method: "GET",
        headers: authHeader(),
      };
      return new Promise((resolve) => {
        setTimeout(async () => {
          const res = await fetch(
            `${config.apiUrl}/kifus/page?page=${this.currentPage}&per_page=${this.perPage}`,
            requestOptions
          );
          const val = await res.json();
          resolve(val.data);
          this.totalRows = val.total;
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
        headers: authHeader(),
      };
      setTimeout(() => {
        let _data = fetch(
          `${config.apiUrl}/kifus/share/page?page=${this.share_currentPage}&per_page=${this.perPage}`,
          requestOptions
        )
          .then(handleResponse)
          .then((data) => {
            this.share_items = data.data;
            this.share_totalRows = data.total;
            this.SET_SPINNER(false);
            return data;
          });
      }, 1000);
    },
    paginate(currentpage) {
      this.getall();
    },
    shared_paginate(currentpage) {
      this.getShareAll();
    },
    //upload a kifu to analyse
    uploader() {
      this.$refs.file.click();
    },

    onFileChange(fieldName, file) {
      const { maxSize } = this;
      let imageFile = file[0];
      if (file.length > 0) {
        let size = imageFile.size / maxSize / maxSize;
        var allowedExtensions = /(\.sgf)$/i;

        if (!allowedExtensions.exec(imageFile.name)) {
          // check whether the upload is an image
          this.error("请选择一个图像文件！");
        } else if (size > 1) {
          // check whether the size is greater than the size limit
          this.error("请选择一个文件小于1MB的图像文件！");
        } else {
          let formData = new FormData();
          formData.append("file", imageFile);
          fetch(`${config.apiUrl}/kifus/upload`, {
            method: "POST",
            body: formData,
            headers: authHeader(),
          })
            .then(handleResponse)
            .then((res) => {
              this.success(res.message);
            });
        }
      }
    },
  },
};
</script>
<style>
.my-class {
  max-width: 300px;
}
</style>
