# vue-vuex-registration-login-example

Vue + Vuex - User Registration and Login Tutorial & Example

To see a demo and further details go to http://jasonwatmore.com/post/2018/07/14/vue-vuex-user-registration-and-login-tutorial-example

### TODO i18n vue

### Sass
- npm install -D sass-loader sass

```
<style lang="scss">
$color: red;
</style>
```
### pass params
```
{ path: "/play/:game_id", component: PlayPage , props: true },
```
```
<router-link :to="{path:'/play/'+data.id}">
                <b-button variant="primary">进入房间</b-button>
              </router-link>
```