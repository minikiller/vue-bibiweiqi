<template>
  <b-container fluid>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-row>
        <b-col sm="6">
          <b-card>
            <b-container fluid>
              <b-row>
                <b-col>
                  <b-row>
                    <b-col>
                      <b-input-group prepend="对局名称">
                        <b-form-input id="input-0" v-model="form.name" required></b-form-input>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group id="input-group-1" label="参赛棋手" label-for="input-1">
                        <v-select
                          multiple
                          id="input-1"
                          label="name"
                          :filterable="false"
                          :clearable="false"
                          :options="options"
                          @search="onSearch"
                          v-model="form.opponent"
                          :selectable="() => form.opponent.length < 4"
                        >
                          <template slot="no-options">输入棋友名称，进行搜索</template>
                          <template slot="option" slot-scope="option">
                            <div class="d-center">
                              <b-avatar variant="dark" :src="option.avatar" size="sm" />
                              {{ option.name }}
                            </div>
                          </template>
                        </v-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row class="row_avatars">
                    <b-col class="avatars">
                      <div v-if="form.opponent[0]">
                        <b-avatar
                          badge="1"
                          badge-variant="dark"
                          :src="form.opponent[0].avatar"
                          size="4rem"
                        />
                        {{ form.opponent[0].name }}
                      </div>
                      <div v-else>
                        <b-avatar variant="primary" size="4rem">黑棋一</b-avatar>
                      </div>
                    </b-col>
                    <b-col class="avatars">
                      <div v-if="form.opponent[1]">
                        <b-avatar
                          badge="1"
                          badge-variant="light"
                          :src="form.opponent[1].avatar"
                          size="4rem"
                        />
                        {{ form.opponent[1].name }}
                      </div>
                      <div v-else>
                        <b-avatar variant="primary" size="4rem">白棋一</b-avatar>
                      </div>
                    </b-col>
                    <b-col class="avatars">
                      <div v-if="form.opponent[2]">
                        <b-avatar
                          badge="2"
                          badge-variant="dark"
                          :src="form.opponent[2].avatar"
                          size="4rem"
                        />
                        {{ form.opponent[2].name }}
                      </div>
                      <div v-else>
                        <b-avatar variant="primary" size="4rem">黑棋二</b-avatar>
                      </div>
                    </b-col>
                    <b-col class="avatars">
                      <div v-if="form.opponent[3]">
                        <b-avatar
                          badge="2"
                          badge-variant="light"
                          :src="form.opponent[3].avatar"
                          size="4rem"
                        />
                        {{ form.opponent[3].name }}
                      </div>
                      <div v-else>
                        <b-avatar variant="primary" size="4rem">白棋二</b-avatar>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-input-group prepend="对局时间" append="分钟">
                        <b-form-input id="input-2" v-model="form.total_time" required></b-form-input>
                      </b-input-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-button type="submit" block variant="success">提交</b-button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-container>
          </b-card>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import "vue-select/dist/vue-select.css";
import { debounce } from "lodash";
import { mapState, mapMutations } from "vuex";
import { gameService } from "../_services";
import config from "config";
export default {
  mounted() {
    this.updateNavTitle(this.name);
  },
  data() {
    return {
      name: "新建对局",
      selected: null, // this needs to be filled with the selected value (id or object), but it stays empty
      options: [],
      form: {
        opponent: [],
        total_time: "",
        name: "",
        public: true,
        password: "",
        comment: ""
      },
      show: true
    };
  },
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"]),
    ...mapMutations("alert", ["success", "error", "clear"]),

    onSearch(search, loading) {
      loading(true);
      this.search(loading, search, this);
    },
    search: debounce((loading, search, vm) => {
      fetch(`${config.apiUrl}/users/data?userName=${escape(search)}`).then(
        res => {
          res.json().then(json => {
            vm.options = json;
          });
          loading(false);
        }
      );
    }, 350),

    onSubmit(evt) {
      evt.preventDefault();
      // alert(JSON.stringify(this.form));
      gameService.newGame(this.form).then(data => {
        this.success(data.message);
      });
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form valuesopponent: "",
      this.form.opponent = "";
      this.form.name = "";
      this.form.total_time = "";
      this.form.comment = "";
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    }
  }
};
</script>

<style scoped>
.col {
  padding: 0.25rem 1rem;
}
.b-avatar {
  margin: 0.5rem;
}
.avatars {
  padding: 0.5rem;

  text-align: center;
}
.row_avatars {
  padding-left: 4rem;
  padding-right: 4rem;
  height: 9rem;
  text-align: center;
}
</style>
