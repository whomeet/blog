<template>
  <header class="navbar">
    <div class="nav-header">
      <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>
      <div class="header-title">
        <div class="header-title-logo">
          <span class="title">FE</span>
        </div>
        <div class="header-tit">
          <div class="title">TEAM</div>
          <div class="subTitle can-hide">客户至上，体验至上</div>
        </div>
      </div>
      <div class="links">
        <NavLinks class="can-hide link-hide"/>
        <SearchBox v-if="$site.themeConfig.search !== false"/>
        <!--<AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia"/>-->
        <!--<SearchBox v-else-if="$site.themeConfig.search !== false"/>-->
      </div>
      <!--<div class="btn-write can-hide">写博客</div>-->
    </div>
  </header>
</template>

<script>
import SidebarButton from './SidebarButton.vue'
import AlgoliaSearchBox from '@AlgoliaSearchBox'
import SearchBox from './SearchBox.vue'
import NavLinks from './NavLinks.vue'

export default {
  components: { SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox },
  computed: {
    algolia () {
      return this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {}
    },
    isAlgoliaSearch () {
      return this.algolia && this.algolia.apiKey && this.algolia.indexName
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'

.navbar
  padding 0.7rem 1.5rem
  line-height $navbarHeight - 1.4rem
  position relative
  .header-title
    display inline-block
    .header-title-logo
      position relative
      display flex
      width 5rem
      height 5rem
      background #ff6653
      border-radius 1rem
      /*border .1rem solid #000*/
      align-items center
      justify-content center
      /*background-image url("../../.vuepress/public/img/sfe.png")*/
      /*background-repeat no-repeat*/
      /*-webkit-background-size 6rem 6rem*/
      /*-moz-background-size 6rem 6rem*/
      /*background-size 6rem 6rem*/
      .title
        font-size 2.4rem
        font-weight 900
        color #fff
    .header-tit
      display inline-block
      position absolute
      top 2.5rem
      margin-left 6rem
      .title
        font-size 1.2rem
        line-height 1.5rem
        color #ac3e40
        text-shadow 0 1px rgba(0,0,0,0.2)
      .subTitle
        font-size 1rem
        line-height 1.5rem
        color #000
        padding-top 1rem
        letter-spacing 2px
        text-shadow 0 1px rgba(0,0,0,1)

  .links
    font-size 1.2rem
    position absolute
    right 15rem
    top 0.7rem
  .btn-write
    display: block
    position: absolute
    top: 3.9rem
    right: 4.6%
    padding: 0 2rem
    height: 2.2rem
    line-height: 2.2rem
    color: #ac3e40
    font-size: 16px
    font-weight 700
    background-color: #fff
    border-radius: 20px
    -ms-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25)
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25)

@media (max-width ($MQNarrow + 1px))
  .navbar
    line-height 4rem
    .nav-header
      position static
      width 100%
    .can-hide
      display none
    .header-title
      .header-title-logo
        width 3.5rem
        height 3.5rem
        border-radius .5rem
        .title
          font-size 1.8rem
          font-weight 700
      .header-tit
        top 1rem
        margin-left 5rem

@media (max-width: $MQMobile)
  .navbar
    padding-left 4rem
    line-height 4rem
    .can-hide
      display none
    .header-title
      .header-title-logo
        width 3.5rem
        height 3.5rem
        border-radius .5rem
        .title
          font-size 1.8rem
          font-weight 700
      .header-tit
        top 1rem
        margin-left 5rem
@media (max-width ($MQWidth + 1px))
  .link-hide
    display none
</style>
