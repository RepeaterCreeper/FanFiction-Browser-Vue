<template>
  <v-row>
    <v-col class="ma-2" cols="12">
      <v-card>
        <v-card-title>
          <h3>{{ fanfiction["story"][curChapter].title }}</h3>
        </v-card-title>
        <v-card-text>
          <p v-html="fanfiction['story'][curChapter].contents"></p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" class="ma-2">
      <v-btn outlined @click="goBack" :disabled="curChapter == 0">Go Back</v-btn>
      <v-btn outlined @click="goNext" :disabled="curChapter == fanfiction['story'].length - 1">Go Next</v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

export default {
  name: "Home",
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