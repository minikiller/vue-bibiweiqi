<template>
  <div class="video-list">
    <div v-for="item in videoList" v-bind:video="item" v-bind:key="item.id" class="video-item">
      <h2
        style="position: absolute;color:white;font-size:17px;text-shadow: 1px 1px black;padding:0;margin:0;text-align: left; margin-top: 10px; margin-left: 10px; display: block; border: 0;line-height:1.5;z-index:1;"
      >{{item.title}}</h2>
      <video
        controls
        autoplay
        playsinline
        ref="videos"
        :height="cameraHeight"
        :muted="item.muted"
        :id="item.id"
      ></video>
    </div>
  </div>
</template>

<script>
// RTCMultiConnection=require ("rtcmulticonnection");
import RTCMultiConnection from 'rtcmulticonnection';
require("adapterjs");
export default {
  name: "vue-webrtc",
  components: {
    RTCMultiConnection
  },
  data() {
    return {
      rtcmConnection: null,
      localVideo: null,
      videoList: [],
      canvas: null,
      title: "sdsdsd"
    };
  },
  props: {
    isOpponent: {
      //是否是对局者
      type: Boolean,
      default: false
    },
    roomId: {
      type: String,
      default: "public-room"
    },
    userId: {
      type: String
    },
    socketURL: {
      type: String,
      default: "https://bibiweiqi.com:9001/"
      // default: 'https://rtcmulticonnection.herokuapp.com:443/'
    },
    cameraHeight: {
      type: [Number, String],
      default: 200
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    screenshotFormat: {
      type: String,
      default: "image/jpeg"
    },
    enableAudio: {
      type: Boolean,
      default: true
    },
    enableVideo: {
      type: Boolean,
      default: true
    },
    enableLogs: {
      type: Boolean,
      default: true
    }
  },
  watch: {},
  mounted() {
    var that = this;

    this.rtcmConnection = new RTCMultiConnection();
    this.rtcmConnection.socketURL = this.socketURL;
    this.rtcmConnection.autoCreateMediaElement = false;
    this.rtcmConnection.enableLogs = this.enableLogs;
    /* this.rtcmConnection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: this.enableAudio,
      OfferToReceiveVideo: this.enableVideo
    }; */
    this.rtcmConnection.onstream = function(stream) {
      let found = that.videoList.find(video => {
        return video.id === stream.streamid;
      });
      if (found === undefined) {
        let video = {
          id: stream.streamid,
          muted: stream.type === "local",
          title: stream.userid
        };

        that.videoList.push(video);

        if (stream.type === "local") {
          that.localVideo = video;
        }
      }

      setTimeout(function() {
        for (var i = 0, len = that.$refs.videos.length; i < len; i++) {
          if (that.$refs.videos[i].id === stream.streamid) {
            that.$refs.videos[i].srcObject = stream.stream;
            break;
          }
        }
      }, 1000);
      /* if (!that.isOpponent) {
        let st= that.rtcmConnection.attachStreams[0];
        st.stop();
      } */

      that.$emit("joined-room", stream.streamid);
    };
    this.rtcmConnection.onstreamended = function(stream) {
      var newList = [];
      that.videoList.forEach(function(item) {
        if (item.id !== stream.streamid) {
          newList.push(item);
        }
      });
      that.videoList = newList;
      that.$emit("left-room", stream.streamid);
    };
  },
  methods: {
    join() {
      if (this.isOpponent) {
        this.rtcmConnection.session = {
          audio: this.enableAudio,
          video: this.enableVideo
        };
        this.rtcmConnection.mediaConstraints = {
          audio: this.enableAudio,
          video: this.enableVideo
        };
      } else {
        this.rtcmConnection.session = {
          audio: true,
          video: true,
          oneway: true
        };
        this.rtcmConnection.mediaConstraints = {
          audio: false,
          video: false
        };
      }
      var that = this;
      this.rtcmConnection.userid = this.userId;

      this.rtcmConnection.openOrJoin(this.roomId, function(
        isRoomExist,
        roomid
      ) {
        if (isRoomExist === false && that.rtcmConnection.isInitiator === true) {
          that.$emit("opened-room", roomid);
        }
      });
    },
    leave() {
      this.rtcmConnection.attachStreams.forEach(function(localStream) {
        localStream.stop();
      });
      this.videoList = [];
    },
    capture() {
      return this.getCanvas().toDataURL(this.screenshotFormat);
    },
    getCanvas() {
      let video = this.getCurrentVideo();
      if (video !== null && !this.ctx) {
        let canvas = document.createElement("canvas");
        canvas.height = video.clientHeight;
        canvas.width = video.clientWidth;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
      }
      const { ctx, canvas } = this;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas;
    },
    getCurrentVideo() {
      if (this.localVideo === null) {
        return null;
      }
      for (var i = 0, len = this.$refs.videos.length; i < len; i++) {
        if (this.$refs.videos[i].id === this.localVideo.id)
          return this.$refs.videos[i];
      }
      return null;
    },
    shareScreen() {
      var that = this;
      if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
        function addStreamStopListener(stream, callback) {
          var streamEndedEvent = "ended";
          if ("oninactive" in stream) {
            streamEndedEvent = "inactive";
          }
          stream.addEventListener(
            streamEndedEvent,
            function() {
              callback();
              callback = function() {};
            },
            false
          );
        }

        function onGettingSteam(stream) {
          that.rtcmConnection.addStream(stream);
          that.$emit("share-started", stream.streamid);

          addStreamStopListener(stream, function() {
            that.rtcmConnection.removeStream(stream.streamid);
            that.$emit("share-stopped", stream.streamid);
          });
        }

        function getDisplayMediaError(error) {
          console.log("Media error: " + JSON.stringify(error));
        }

        if (navigator.mediaDevices.getDisplayMedia) {
          navigator.mediaDevices
            .getDisplayMedia({ video: true, audio: false })
            .then(stream => {
              onGettingSteam(stream);
            }, getDisplayMediaError)
            .catch(getDisplayMediaError);
        } else if (navigator.getDisplayMedia) {
          navigator
            .getDisplayMedia({ video: true })
            .then(stream => {
              onGettingSteam(stream);
            }, getDisplayMediaError)
            .catch(getDisplayMediaError);
        }
      }
    }
  }
};
</script>
<style scoped>
.video-list {
  background: whitesmoke;
  height: auto;
}

.video-list div {
  padding: 0px;
}

/* .video-item {
  background: #c5c4c4;
  display: inline-block;
} */
</style>
