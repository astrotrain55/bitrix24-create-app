<template>
  <v-app v-if="show" style="width: 100%;">
    <v-container fluid>
      <h1>
        <a :href="portal" target="_blank">{{ domain }}</a>
      </h1>
      <v-row align="center" justify="space-between">
        <v-col v-for="(user, id) in users" :key="id">
          <a
             class="user"
             :class="classList(id)"
             :href="`${portal}/company/personal/user/${id}/`"
             :title="getTitle(user)"
             :data-birthday="user.birthday"
             target="_blank"
          >
            <img v-if="user.photo" :src="user.photo" :alt="user.fullName">
          </a>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  mounted() {
    this.$emit('update');
  },

  updated() {
    this.$emit('update');
  },

  computed: {
    ...mapState(['users', 'department', 'currentId']),
    ...mapGetters(['portal', 'domain']),

    show() {
      return Object.keys(this.users).length;
    },
  },

  methods: {
    classList(id) {
      return {
        department: this.department.includes(id),
        current: this.currentId === id,
      };
    },

    getTitle(user) {
      return [user.fullName, user.position].filter((s) => s).join('\n');
    },
  },
};
</script>

<style lang="stylus">
size = 170px

h1
  text-align center
  margin-bottom 20px
a.user
  display block
  margin 0 auto
  width size
  height size
  border 5px solid black
  border-radius 50%
  background-image url("~@/assets/nouserpic.svg")
  background-color rgba(82,92,105,.23)
  background-size 111px 124px
  background-repeat no-repeat
  background-position center
  &.department
    border-color coral
  &.current
    border-color currentColor
  img
    display block
    object-fit cover
    width 100%
    height 100%
    border-radius 50%
    font-size 0
</style>
