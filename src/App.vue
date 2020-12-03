<template>
  <div id="app">
    <button @click="handleClick" style="font-size:20px;">click me to import packages</button>
    <component
      ref="compRef"
      style="width:300px;height:200px;"
      :is="compName">
    </component>
  </div>
</template>

<script>
import compMixins from './comp-mixins.js';
import Vue from 'vue';

export default {
  name: 'App',

  data() {
    return {
      compName: null
    };
  },

  updated() {
    if (this.$refs.compRef) {
      this.$refs.compRef.init({});
      this.$refs.compRef.render([]);
    }
  },

  methods: {
    handleClick() {
      var moduleName = "my-custom-chart@1.0.0";
      // eslint-disable-next-line
      System.import(moduleName).then(res => {
        console.log('import success', res);
        // res.default.initChart('', {});
        const compDef = res.default;
        const compName = 'my-custom-chart-1.0.0';
        (compDef.mixins || (compDef.mixins = [])).push(compMixins);
        Vue.component(compName, compDef);
        this.compName = compName;
      });
    }
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
