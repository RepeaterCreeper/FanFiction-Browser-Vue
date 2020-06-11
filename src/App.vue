<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawerRight"
      app
      clipped
      right
      temporary
    >
      <v-list>
        <v-subheader>Browse Chapters</v-subheader>
        <v-list-item-group v-model="this.$store.state.curChapter" color="primary">
          <v-list-item v-for="link of this.$store.state.fanfiction.story" :key="link.chapter" link @click="goToChapter(link.page - 1)">
            <v-list-item-content>
              <v-list-item-title><b>{{ link.page }}.</b> <small>{{ link.title }}</small></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-right
      color="purple darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>FanFiction Browser</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="dialog = !dialog" v-if="this.$route.path === '/'">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight" v-if="this.$route.path === '/read'"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      dense
    >
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              FanFiction Browser
            </v-list-item-title>
            <v-list-item-subtitle>
              v0.0.1 <div style="padding: 4px 16px; margin-left: 8px; border-radius: 4px; background-color: red; color: white; display: inline-block;">BETA</div>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item-group>
          <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-item-action>
              <v-icon>mdi-{{ link.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ link.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="left"
      fixed
    ></v-navigation-drawer>

    <v-content>
      <router-view />
    </v-content>

    <v-btn @click="openFanFiction()"><v-icon>mdi-archive</v-icon></v-btn>
    <v-btn @click="retrieveFanFiction()"><v-icon>mdi-download</v-icon></v-btn>
    <v-navigation-drawer
      v-model="right"
      fixed
      right
    ></v-navigation-drawer>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Add FanFiction to Library
        </v-card-title>
        <v-card-subtitle>Select the type</v-card-subtitle>
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <input v-model="path" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="readFic(path)"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import electron from 'electron';
import path from 'path';
import store from './store';
import { ipcRenderer } from 'electron';
import fs from 'fs';

import { mapActions } from 'vuex';

ipcRenderer.on("openFanFiction-reply", function(event, data) {
  store.state.curChapter = 0;
  store.state.fanfiction = data;
});

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const fullPath = path.join(userDataPath, "app.json");

export default {
  props: {
    source: String,
  },
  data() {
    return {
      path: "",
      dialog: false,
      drawer: false,
      drawerRight: false,
      right: false,
      left: false,
      links: [
        {icon: "view-dashboard", text: "Dashboard", route: "/"},
        {icon: "information-outline", text: "About", route: "/about"}
      ]
    }
  },
  methods: {
    ...mapActions([
      "goToChapter"
    ]),
    "readFic": function() {
      ipcRenderer.send("openFanFiction", {
        action: "readFicDir",
        path: this.path
      });
      this.$store.state.libraryList.push({
        title: "Untitled FanFiction",
        description: "Lorem Ipsum",
        path: this.path
      });

      this.path = "";
      this.dialog = false;
      
      

      fs.writeFileSync(fullPath, JSON.stringify(this.$store.state.libraryList));
    },
    "getFicDir": function() {
      ipcRenderer.send("openFanFiction", {
        action: "getFicDir"
      });
    },
    "getFicUrl": function() {
      ipcRenderer.send("openFanFiction", {action: "getFicUrl", url: "https://www.fanfiction.net/s/4762140/"});
    }
  },
  created: function() {
    document.title = "FanFiction Browser";

    if (fs.existsSync(fullPath)) {
      const data = JSON.parse(fs.readFileSync(fullPath));
      this.$store.state.libraryList = data;
    }
  },
}
</script>

<style>
  html {
    overflow-y: auto !important;
  }
  ::-webkit-scrollbar {
    width: 2px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(131, 131, 131);
    border-radius: 8px;
  }

  ::-webkit-scrollbar:hover {
    width: 8px;
  }
</style>