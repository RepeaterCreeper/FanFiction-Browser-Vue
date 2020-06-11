<template>
  <v-row>
    <v-col cols="12">
      <FanFictionItem v-bind:fanfic="fanfic" v-for="fanfic of libraryList" :key="fanfic.path" />
    </v-col>
  </v-row>
</template>

<script>
import electron from 'electron';
import router from '../router';
import store from '../store';
import path from 'path';
import { ipcRenderer } from 'electron';
import fs from 'fs';

import { mapActions } from 'vuex';

import FanFictionItem from '../components/FanFictionItem';

export default {
  name: "Dashboard",
  data() {
    return {
      libraryList: this.$store.state.libraryList
    }
  },
  components: {
    FanFictionItem
  },
  methods: {
    "getFicDir": function() {
      ipcRenderer.send("openFanFiction", {
        action: "getFicDir"
      });
    },
    "getFicUrl": function() {
      ipcRenderer.send("openFanFiction", {action: "getFicUrl", url: "https://www.fanfiction.net/s/4762140/"});
    }
  },
  mounted: function() {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const fullPath = path.join(userDataPath, "app.json");

    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify({libraryList: []}));
    }
  },
}
</script>