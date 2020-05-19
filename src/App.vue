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
        <v-list-item-group v-model="curChapter" color="primary">
          <v-list-item v-for="link of this.$store.state.fanfiction.story" :key="link.chapter" link @click="goToChapter(link.chapter - 1)">
            <v-list-item-content>
              <v-list-item-title><b>{{ link.chapter }}.</b> <small>{{ link.title }}</small></v-list-item-title>
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
      <v-app-bar-nav-icon @click.stop="drawerRight = !drawerRight"></v-app-bar-nav-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon>mdi-{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
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
    <v-navigation-drawer
      v-model="right"
      fixed
      right
    ></v-navigation-drawer>
  </v-app>
</template>

<script>
import store from './store';
import { ipcRenderer } from 'electron';
import fs from 'fs';

import { mapActions } from 'vuex';

ipcRenderer.on("openFanFiction-reply", function(event, data) {
  store.state.fanfiction = data;
});

export default {
  props: {
    source: String,
  },
  data() {
    return {
      drawer: false,
      drawerRight: false,
      right: false,
      left: false,
      links: [
        {icon: "view-dashboard", text: "Dashboard", route: "/"},
        {icon: "information-outline", text: "About", route: "/about"}
      ],
      curChapter: this.$store.state.curChapter
    }
  },
  methods: {
    ...mapActions([
      "goToChapter"
    ]),
    "openFanFiction": function() {
      ipcRenderer.send("openFanFiction", "get");
    }
  },
  created: function() {
    document.title = "FanFiction Browser";
  }
}
</script>