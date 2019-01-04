<template>
  <div class="page card">
    <h1 v-if="title"
      class="page-title"
      :style="overrideStyle">
      {{ title }}
    </h1>
    <span class="page-author" v-if="author">作者：{{ author }}</span>
    <span class="page-timestamp" v-if="createTime">发表时间：{{ createTime }}</span>
    <img :src="$withBase(isBanner)"  v-if="isBanner" class="page-banner" />
    <Content :custom="false"/>
    <div class="content edit-link" v-if="editLink">
      <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
      <OutboundLink/>
      <div v-if="lastUpdated" class="last-updated">
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </div>
    <div class="content page-nav" v-if="prev || next">
      <p class="inner">
        <span v-if="prev" class="prev">
          ← <router-link v-if="prev" class="prev" :to="prev.path">
            {{ prev.title || prev.path }}
          </router-link>
        </span>
        <span v-if="next" class="next">
          <router-link v-if="next" :to="next.path">
            {{ next.title || next.path }}
          </router-link> →
        </span>
      </p>
    </div>
    <slot name="bottom"/>

    <div class="comments-wrap">
      <div class="comments-count">{{commentsList.length}}条评论</div>
      <div class="comments-list">
        <div class="comments-item" v-for="(item, index) in commentsList" :index="index">
          <img class="comments-pic" :src="item.fromMisImg" >
          <div class="comments-right">
            <div class="comments-info">
              <span class="name">{{item.fromMis}}</span>
              <span class="replay" v-if="item.toMis">
                <span style="color: #8590a6; padding-right: .8rem; font-weight: 500">回复</span>
                {{item.toMis}}</span>
              <span class="time">{{item.addTime}}</span>
            </div>
            <div class="comments-content">{{item.content}}</div>
            <div class="comments-delete" >删除
              <span class="icon-delete"></span>
            </div>
            <div class="comments-replay" >回复
              <span class="icon-replay"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="comments-input">
        <div class="comments-input-container">
          <input id="input" v-model="addContent" placeholder="写下你的评论" class="input"/>
          <div class="comments-btn" >提交</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import  navLayoutMixin from './navLayout.mixin'
import {pageNormalize, resolvePage, normalize, outboundRE, endingSlashRE, getUrlName } from './util'

export const API_URL = '';

export default {
  mixins: [navLayoutMixin],
  props: ['sidebarItems'],
  data() {
    return {
      $: null,
      articleName: '',
      addContent: '',
      toMis: '',
      commentsList: []
    }
  },
  computed: {
    lastUpdated () {
      if (this.$page.lastUpdated) {
        return new Date(this.$page.lastUpdated).toLocaleString(this.$lang)
      }
    },
    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
    prev () {
      const prev = this.$page.frontmatter.prev;
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.pagesWithoutRoot, prev, this.$route.path)
      } else {
        return resolvePrev(this.$route.path, this.pagesWithoutRoot)
      }
    },
    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.pagesWithoutRoot, next, this.$route.path)
      } else {
        return resolveNext(this.$route.path, this.pagesWithoutRoot)
      }
    },
    pagesWithoutRoot() {
      return pageNormalize(this.$site.pages, this.$site.themeConfig.nav)
    },
    title() {
      return this.$page.frontmatter.title
    },
    author() {
      return this.$page.frontmatter.author
    },
    isBanner() {
      return this.$page.frontmatter.banner || '/img/10.jpg'
    },
    createTime() {
      const stamp = this.$page.frontmatter.date
      const format = this.$site.themeConfig['date_format']
      if(!stamp || !format) return ''
      const date = new Date(stamp)
      return date.Format(format)
    },
    overrideStyle() {
      const { accentColor } = this.$site.themeConfig
      return accentColor ? { color: accentColor } : {}
    },
    editLink () {
      if (this.$page.frontmatter.editLink === false) {
        return
      }
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }

      if (docsRepo && editLinks) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : `https://github.com/${docsRepo}`
        return (
          base.replace(endingSlashRE, '') +
          `/edit/${docsBranch}` +
          (docsDir ? '/' + docsDir.replace(endingSlashRE, '') : '') +
          path
        )
      }
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    }
  },
  mounted() {
    this.$ = require('@dp/zepto');
    this.articleName = getUrlName(location.href)
  },
  methods: {
  }
}

function resolvePrev (page, items) {
  return find(page, items, -1)
}

function resolveNext (page, items) {
  return find(page, items, 1)
}

function find (page, items, offset) {
  const res = []
  items.forEach(item => {
    if (item.type === 'group') {
      res.push(...item.children || [])
    } else {
      res.push(item)
    }
  })
  for (let i = 0; i < res.length; i++) {
    const cur = res[i]
    if (cur.type === 'page' && cur.path === page.path) {
      return res[i + offset]
    }
  }
}
</script>

<style lang="stylus" src="./styles/card.styl"></style>
<style lang="stylus">
@import './styles/config.styl'

.page
    padding-bottom 2rem

.page-title
    margin-bottom -2rem
    padding 0 2.5rem
    overflow hidden
    text-overflow: ellipsis;
    white-space: nowrap;
.page-author
    display inline-block
    font-size 18px
    padding 1rem 3.5rem 0
    margin-top 2.5rem
.page-timestamp
    display inline-block
    font-size 18px
    margin-top 2.5rem
.page-banner
    margin: 2rem 2.5rem;
    width 80%
    height 20rem
    img
      width 100%
      height 100%
.edit-link.content
  padding-top 0 !important
  a
    color lighten($textColor, 25%)
    margin-right 0.25rem
  .last-updated
    margin-bottom .5rem
    float right
    font-weight 500
    font-size .9em
    .prefix
      color lighten($textColor, 25%)
    .time
      color #aaa

.page-nav.content
  padding-top 1rem !important
  padding-bottom 0 !important
  .inner
    min-height 2rem
    margin-top 0 !important
    border-top 1px solid $borderColor
    padding-top 1rem
    overflow auto // clear float
  .next
    float right

.comments-wrap
  margin 2.5rem
  box-shadow: 0 1px 3px 0 rgba(0,33,77,.05);
  background: #fff;
  overflow: visible;
  border-radius: .5rem;
  border 1px solid #eaecef
  .comments-count
    height 3.5rem
    line-height 3.5rem
    margin auto 2rem
    font-size 18px
    color #000000
    font-weight 700
    border-bottom 1px solid #eaecef
  .comments-list
    .comments-item
      position relative
      margin 1rem 2rem 0 2rem
      font-size 15px
      border-bottom 1px solid #eaecef
      overflow hidden
      color #333
      .comments-pic
        float left
        display inline-block
        height 4rem
        width 4rem
      .comments-right
        width 92%
        float left
        margin-left .8rem
        .comments-info
          position relative
          padding-bottom .5rem
          .replay
            padding-left .8rem
          .time
            float right
            font-size 14px
            color #8590a6
        .comments-content
          padding-bottom 1rem
        .comments-delete
          display inline-block
          margin-top .5rem
          color #8a90a6
          font-weight 500
          .icon-delete
            padding 2.3rem 3.4rem 0 0
            -webkit-background-size cover
            background-size cover
            background url('../public/img/delete.png') right center no-repeat
        .comments-replay
          float right
          margin-top .5rem
          color #8590a6
          font-weight 500
          .icon-replay
            padding 2rem 4rem 0 0
            margin-left -1.6rem
            -webkit-background-size cover
            background-size cover
            background url('../public/img/replay.png') left center no-repeat


  .comments-input
    overflow hidden
    padding .5rem 2rem 1.5rem
    margin 1rem 0 0 0
    .comments-input-container
      background #fff
      display flex
      .input
        border none
        outline none
        width 100%
        height 100%
        padding .7rem 1rem
        border-radius 4px
        font-size 14px
        font-weight: 500;
        background-color #f7f8fa
      .comments-btn
        height 2rem
        line-height 2rem !important
        padding 0 1rem
        margin auto 0
        margin-left 1rem
        background #f63
        color #fff
        border-radius 4px
        width 2.5rem
        text-align center
        cursor pointer

@media (max-width: $MQMobile)
  .edit-link.content .last-updated
    float none
    text-align left
    margin-top 1rem
    font-size .8em

@media (max-width ($MQNarrow + 1px))
  .page-author
    padding .5rem 1.5rem 0
</style>
