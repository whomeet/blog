<template>
  <div class="card article-card">
    <router-link :to="this.info.path">
        <img :src="$withBase(isBanner)"  v-if="isBanner" class="article-banner" />
    </router-link>
    <div class="article-card-info">
      <span class="card-tag">
          <router-link :to="this.info.path">{{ tag }}</router-link>
      </span>
      <span class="card-date">{{ createDate }}</span>
    </div>
    <h2 class="article-card-title" :class="headerOverviewClasses">
      <router-link :to="this.info.path">{{ title }}</router-link>
    </h2>
    <div class="article-card-des">
      <div v-if="description">{{ description }}</div>
      <div v-else v-html="this.info.excerpt" class="article-card-excerpt"></div>
    </div>
  </div>
</template>

<script>
  import {randomImg} from './util'

  export default {
    name: 'article-card',
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    computed: {
      title() {
        return this.info.frontmatter.title || this.info.title
      },
      tag() {
        return this.info.frontmatter.tag || this.info.tag
      },
      date() {
        return this.info.frontmatter.date || this.info.date
      },
      description() {
        const metaList = (this.info.frontmatter ? this.info.frontmatter.meta : []) || [];
        let description = metaList.filter(meta => meta.name === "description");
        return description[0].content
      },
      headerOverviewClasses() {
        return {
          'overview': this.info.excerpt
        }
      },
      overrideStyle() {
        const { accentColor } = this.$site.themeConfig
        return accentColor ? { color: accentColor } : {}
      },
      isBanner() {
        return this.info.frontmatter.banner || '/img/10.jpg'
      },
      createDate() {
        const stamp = this.info.frontmatter.date
        const format = this.$site.themeConfig['date_format']
        if(!stamp || !format) return ''
        const date = new Date(stamp)
        return date.Format(format)
      },
    }
  }
</script>

<style src="./styles/card.styl" lang="stylus"></style>
<style lang="stylus">
  @require './styles/config'

  .article-card
    display inline-block
    float left
    position relative
    width 29%
    height 22.5rem
    padding 1rem
    margin 2rem 1rem 0
    .article-card-info
      height 1.6em
      line-height 1.6em
      overflow hidden
      .card-tag
        font-size 18px
        a
          color #c66c67
        a:hover
          color $accentColor
      .card-date
        font-size 14px
        margin-left 1rem
        color #aaa
    h2:not(.overview)
      border: 0
    .article-card-title
      margin 0
      font-size: 22px
      font-weight 400
      line-height 1.5em
      word-wrap break-word
      overflow hidden
      height 2rem
      a
        color #c66c67
      a:hover
         color $accentColor
    .article-card-des
      font-size 16px
      height 6rem
      line-height 1.6rem
      padding-top .6rem
      color #aaa
      overflow hidden
      word-wrap break-word
    .article-card-excerpt
      h1, h2, h3, h4, h5, h6
        font-size 16px
        margin 0
      p
        margin 0

  .article-banner
    width 100%
    height 50%
    img
      width 100%
      height 100%



@media (max-width: ($MQMobileNarrow + 1px))
  .article-card
    display block
    float none
    width 90%
    clear both

</style>