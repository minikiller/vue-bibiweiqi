<template>
    <b-container class="bv-example-row">
        <b-row>

            <b-col sm="6" offset="3">
                <b-card>
                <div>
                    <div class="logo">
                        <h2>哔哔围棋</h2>
                    </div>
                    <div>
                    <form @submit.prevent="handleSubmit">
                        <div class="form-group">
                            <input type="text" 
                                v-model="username" 
                                name="username" 
                                placeholder="用户名"
                                class="form-control" 
                                :class="{ 'is-invalid': submitted && !username }" 
                            />
                            <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
                        </div>
                        <div class="form-group">
                            <input type="password" 
                                v-model="password" 
                                name="password" 
                                placeholder="密码"
                                class="form-control" 
                                :class="{ 'is-invalid': submitted && !password }"
                            />
                            <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
                        </div>
                        <div class="form-group">
                            <button class="btn btn-primary" :disabled="status.loggingIn">登录</button>
                            <img v-show="status.loggingIn" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                            <router-link to="/register" class="btn btn-link">注册</router-link>
                        </div>
                    </form>
                    </div>
                </div>
                </b-card>
           </b-col>
        </b-row>
    </b-container>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
    data () {
        return {
            username: '',
            password: '',
            submitted: false
        }
    },
    computed: {
        ...mapState('account', ['status'])
    },
    created () {
        // reset login status
        this.logout();
    },
    methods: {
        ...mapActions('account', ['login', 'logout']),
        handleSubmit (e) {
            this.submitted = true;
            const { username, password } = this;
            if (username && password) {
                this.login({ username, password })
            }
        }
    }
};
</script>

<style scoped>
    .logo {
        margin-bottom: 1rem;
    }
</style>>