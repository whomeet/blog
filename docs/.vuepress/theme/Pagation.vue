<template>
  <nav class="pagation-nav">
    <span class="pagation-action pagation-prev" 
      @click="prevPage"
      v-if="currentPage > 1">← </span>
    <template>
      <span v-for="num in pageSum" 
        class="pagation-num"
        @click="changeCurrentPage(num)"
        :class="hightlightCurrentPage(num)">
        {{ num }}
      </span>  
    </template> 
    <span class="pagation-action pagation-next" 
      @click="nextPage"
      v-if="currentPage < pageSum"> →</span>
  </nav>
</template>

<script>
    import navLayoutMixin from './navLayout.mixin'

export default {
    mixins: [navLayoutMixin],
    props: {
    pageItems: {
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1
    }
  },
  methods: {
    changeCurrentPage(pageNum) {
      this.currentPage = pageNum
    },
    prevPage() {
      this.currentPage = this.currentPage - 1
    },
    nextPage() {
      this.currentPage = this.currentPage + 1
    },
    hightlightCurrentPage(pageNum) {
      return [{
        'pagation-current': pageNum === this.currentPage
      }]
    },
  },
  computed: {
    pageSum() {
      return Math.ceil(this.pageItems.length / this.perPage)
    },
  },
  watch: {
    currentPage(pageNum) {
      this.$emit('change', pageNum)
    }
  }
}
</script>

<style lang="stylus">
.pagation-nav
  padding 1rem
  text-align center
  clear both
  line-height 2rem
  overflow hidden
  span:hover
    color #ac3e40

.pagation-action
  display block
  text-align center
  cursor pointer
  width 2rem
  height 2rem
  margin-right 2rem
  border-radius 50%
  background-color #fff

.pagation-num
  cursor pointer
  padding 10px 20px
  line-height 1
  height 2ex
  font-size 20px

.pagation-prev
  float left

.pagation-next
  float right

.pagation-current
  font-weight 700
  color #ac3e40
  font-size 20px
</style>