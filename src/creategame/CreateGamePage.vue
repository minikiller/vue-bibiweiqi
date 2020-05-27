<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <div>
          <b-container fluid>
            <b-row>
              <b-col>
                <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <v-select
                    label="name"
                    :filterable="false"
                    :options="options"
                    @search="onSearch"
                    placeholder="黑一"
                  >
                    <template slot="no-options">請選擇棋友 </template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">{{ option.name }}</div>
                    </template>
                  </v-select>
                </b-form></b-col
              >
              <b-col>
                <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <v-select
                    label="name"
                    :filterable="false"
                    :options="options"
                    @search="onSearch"
                    placeholder="白一"
                  >
                    <template slot="no-options">請選擇棋友 </template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">{{ option.name }}</div>
                    </template>
                  </v-select>
                </b-form></b-col
              >
            </b-row>
            <b-row>
              <b-col>
                <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <v-select
                    label="name"
                    :filterable="false"
                    :options="options"
                    @search="onSearch"
                    placeholder="白二"
                  >
                    <template slot="no-options">請選擇棋友 </template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">{{ option.name }}</div>
                    </template>
                  </v-select>
                </b-form></b-col
              >
              <b-col>
                <b-form @submit="onSubmit" @reset="onReset" v-if="show">
                  <v-select
                    label="name"
                    :filterable="false"
                    :options="options"
                    @search="onSearch"
                    placeholder="黑二"
                  >
                    <template slot="no-options">請選擇棋友 </template>
                    <template slot="option" slot-scope="option">
                      <div class="d-center">{{ option.name }}</div>
                    </template>
                  </v-select>
                </b-form></b-col
              >
            </b-row>
          </b-container>
        </div></b-col
      >
      <b-col>
        <div>
          <label for="example-datepicker">Choose a date</label>
          <b-form-datepicker
            id="example-datepicker"
            v-model="value"
            class="mb-2"
          ></b-form-datepicker>
        </div>

        <div>
          <b-form-timepicker v-model="value" locale="en"></b-form-timepicker>
        </div>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button></b-col
      >
    </b-row>
  </b-container>
</template>

<script>
import _ from "lodash";
import { mapState, mapMutations } from "vuex";

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
        email: "",
        name: "",
        food: null,
        checked: [],
      },
      show: true,
    };
  },
  methods: {
    ...mapMutations("games", ["updateGame", "updateNavTitle"]),

    onSearch(search, loading) {
      loading(true);
      this.search(loading, search, this);
    },
    search: _.debounce((loading, search, vm) => {
      fetch(
        `https://localhost:5000/users/data?userName=${escape(search)}`
      ).then((res) => {
        res.json().then((json) => {
          vm.options = json;
        });
        loading(false);
      });
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
    },
  },
};
</script>

<style scoped>
.col {
  padding: 1rem 2rem;
}
</style>
