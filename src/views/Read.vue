<template>
  <v-row>
    <v-col cols="12">
      <v-btn class="ma-2" outlined @click="goBack" :disabled="curChapter == 0">Go Back</v-btn>
      <v-btn class="ma-2" outlined @click="goNext" :disabled="curChapter == fanfiction['story'].length - 1">Go Next</v-btn>
    </v-col>
    <v-col cols="12">
      <v-card class="ma-2">
        <v-card-title>{{ fanfiction["story"][curChapter].title }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p v-html="fanfiction['story'][curChapter].contents"></p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-btn class="ma-2" outlined @click="goBack" :disabled="curChapter == 0">Go Back</v-btn>
      <v-btn class="ma-2" outlined @click="goNext" :disabled="curChapter == fanfiction['story'].length - 1">Go Next</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: "Read",
  data() {
    return this.$store.state
  },
  methods: {
    ...mapActions([
      "goBack",
      "goNext",
      "goToChapter"
    ])
  }
}
</script>