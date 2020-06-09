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
                      <b-form-group id="input-group-1" label="选择四位棋手" label-for="input-1">
                        <v-select
                          multiple
                          id="input-1"
                          label="name"
                          :filterable="false"
                          :clearable="false"
                          :options="options"
                          @search="onSearch"
                          v-model="form.opponent"
                        >
                          <template slot="no-options">输入棋友名称，进行搜索</template>
                          <template slot="option" slot-scope="option">
                            <div class="d-center">{{ option.name }}</div>
                          </template>
                        </v-select>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col class="avatars_l">
                      <b-avatar badge="1" badge-variant="dark" size="3rem"></b-avatar>
                      <div v-if="form.opponent[0]">{{ form.opponent[0].name }}</div>
                    </b-col>
                    <b-col class="avatars_r">
                      <b-avatar badge="2" badge-variant="light" size="3rem"></b-avatar>
                      <div v-if="form.opponent[1]">{{ form.opponent[1].name }}</div>
                    </b-col>
                    <b-col class="avatars_l">
                      <b-avatar badge="3" badge-variant="dark" size="3rem"></b-avatar>
                      <div v-if="form.opponent[2]">{{ form.opponent[2].name }}</div>
                    </b-col>
                    <b-col class="avatars_r">
                      <b-avatar badge="4" badge-variant="light" size="3rem"></b-avatar>
                      <div v-if="form.opponent[3]">{{ form.opponent[3].name }}</div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <b-form-group id="input-group-2" label-for="input-2">
                        <b-form-input
                          id="input-2"
                          v-model="form.name"
                          required
                          placeholder="输入对局时间"
                        ></b-form-input>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="danger">Reset</b-button>
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
        opponent: "",
        name: ""
      },
      show: true
    };
  },
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"]),

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
      alert(JSON.stringify(this.form));
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.checked = [];
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
.avatars_l {
  padding: 0.25rem 0.25rem 0.25rem 0.75rem;
}
.avatars_r {
  padding: 0.25rem 0.75rem 0.25rem 0.25rem;
}
</style>
