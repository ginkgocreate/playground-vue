<template>
  <div id="app">
    <template v-if="!isSinglePage">
      <h1>Test Menu</h1>
      <nav>
        <router-link to="/test1">Test 1</router-link> |
        <router-link to="/HelloWorld">Test 2</router-link> |
        <router-link to="/Login">Test 3</router-link>
      </nav>
    </template>
    <router-view />
  </div>
</template>

<script>
import { useRoute } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const singlePageRoutes = ["/Login", "/AnotherPage"];
    const isSinglePage = singlePageRoutes.includes(route.path);

    return { isSinglePage };
  },
};
</script>
