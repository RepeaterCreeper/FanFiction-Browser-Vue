<template>
  <v-card class="ma-2">
    <div class="fanfiction-item">
      <div>
        <img src="../assets/fanfiction-avatar.png" />
      </div>
      <div>
        <h5>{{ fanfic.title }}</h5>
        <p>{{ fanfic.description }}</p>
      </div>
      <div>
        <v-btn @click="readFic(fanfic.path)">View</v-btn>  
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-actions>
      <v-chip
        class="ma-2"
        label
        color="primary"
      >
        <v-avatar left>
          <v-icon>mdi-checkbox-marked-circle</v-icon>
        </v-avatar>
        Completed
      </v-chip>
    </v-card-actions>
  </v-card>
</template>

<script>
import router from '../router';
import store from '../store';
import { ipcRenderer } from 'electron';
import fs from 'fs';

import { mapActions } from 'vuex';

ipcRenderer.on("openFanFiction-reply", function(event, data) {
  store.state.curChapter = 0;
  store.state.fanfiction = data;
  router.push('read');
});

export default {
  name: "FanFictionItem",
  props: ["fanfic"],
  methods: {
    "readFic": function(path) {
      ipcRenderer.send("openFanFiction", {
        action: "readFicDir",
        path: path
      })
    },
  }
}
</script>

<style scoped>
  .fanfiction-item {
    display: grid;
    grid-template-columns: 0.5fr 3fr 1fr;
  }
</style>