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

### websocket

```
// send to current request socket client
socket.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients, include sender
io.sockets.emit('message', "this is a test");

// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
io.sockets.connected(socketid).emit('message', 'for your eyes only');
```

### vuex

```
  computed: {
    ...mapState({
      account: state => state.account,
      games: state => state.games
    })
  },
  methods: {
    ...mapMutations("games", ["addUser", "deleteUser"])
  },
```

### route

```
<router-link :to="{path:'/play/'+data.id}">
  <b-button variant="primary">进入房间</b-button>
</router-link>
```

```
{ path: "/play/:game_id", component: PlayPage , props: true },
```

### fomat string

```
const format = require('string-format')
format.extend (String.prototype, {})
var a = "Hello {0} {1}!".format("world","hello");
console.log(a)
```

### confict with vee-validate and b-table

refer to: https://github.com/bootstrap-vue/bootstrap-vue/issues/1270

```
Vue.use(VeeValidate, {
  inject: true,
  fieldsBagName: 'veeFields'
});
```

### dialog

```
  this.$bvModal.msgBoxConfirm('Please confirm that you want to delete everything.', {
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
            this.boxTwo = value
          })
          .catch(err => {
            // An error occurred
          })
      }
```
