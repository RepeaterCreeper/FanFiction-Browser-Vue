<template>
  <div class="card">
    <div class="card-content">
      <p @click="helloWorld">Hello World</p>
    </div>
  </div>
</template>

<script>
  import { ipcRenderer } from 'electron';

  ipcRenderer.on("action-reply", (event, arg) => {
    console.log(`IPC RENDERER RECEIVED: ${event}, ${arg}`);
  });

  export default {
    name: "StoryCard",
    methods: {
      helloWorld: () => {
        ipcRenderer.send("action", "getTales");
      }
    }
  }
</script>

<style scoped>
  .card-content p {
    margin: 16px 0;
  }
</style>