<template>
  <div>
    <div class="wrap">
      <div class="theme-container"
           :class="pageClasses"
           @touchstart="onTouchStart"
           @touchend="onTouchEnd">
        <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar"/>
        <div class="container">
          <div class="sidebar-mask" @click="toggleSidebar(false)"></div>
          <Sidebar v-if="shouldShowSidebar" :items="sidebarItems" @click-sidebar="clickSidebar">
            <slot name="sidebar-top" slot="top"/>
            <slot name="sidebar-bottom" slot="bottom"/>
          </Sidebar>
          <div class="page-container">
            <!-- custom layout -->
            <div class="custom-layout" v-if="$page.frontmatter.layout">
              <component :is="$page.frontmatter.layout"/>
            </div>
            <!-- article list 显示所有文章 -->
            <ArticleGroup v-else-if="isRoot" :page-items="pageItems" />
            <!-- nav with layout list 显示各nav下的文章-->
            <ArticleGroup v-else-if="isClickNav" :page-items="pageNavItems" />
            <!-- sideBar with layout list -->
            <ArticleGroup v-else-if="isClickSideBar" :page-items="pageSideBarItems" />
            <!-- article page -->
            <Page v-else :sidebar-items="sidebarItems"/>
            <!-- pagation selector -->
            <Pagation v-if="isRoot || isClickNav || isClickSideBar"
                      :page-items="allPages"
                      @change="page => currentPage = page" />
          </div>
          <div style="clear: both"></div>
        </div>
        <BlogFooter class="footer"></BlogFooter>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import nprogress from 'nprogress'
import Home from './Home.vue'
import Navbar from './Navbar.vue'
import Page from './Page.vue'
import Sidebar from './Sidebar.vue'
import ArticleGroup from './ArticleGroup.vue'
import Pagation from './Pagation.vue'
import BlogFooter from './BlogFooter.vue'
import navLayoutMixin from './navLayout.mixin'
import { pathToComponentName } from '@app/util'
// import store from '@app/store'
import { resolveSidebarItems, navsLinksMatch, pageMatch, pageRootMatch, sideBarLinksMatch} from './util'
import throttle from 'lodash.throttle'

export default {
  mixins: [navLayoutMixin],
  components: { Home, Page, Sidebar, Navbar, BlogFooter, ArticleGroup, Pagation },
  data () {
    return {
      isSidebarOpen: false,
      currentPage: 1
    }
  },

  computed: {
    isRoot() {
      return this.$route.path === '/'
    },
    currentNavLink() {
      const currentLink = this.$route.path
      return navsLinksMatch(currentLink)
    },
    currentSideBarLink() {
      const currentLink = this.$route.path
      return sideBarLinksMatch(currentLink)
    },
    pagesRoot() {
      return pageRootMatch(this.$site.pages)
    },
    pagesInNav() {
      return pageMatch(this.$site.pages, this.currentNavLink)
    },
    pagesInSideBar() {
      return pageMatch(this.$site.pages, this.currentSideBarLink)
    },
    isClickNav() {
      const navsWithLayout = this.$site.themeConfig.nav
      return navsWithLayout.some(nav => nav.link === this.$route.path)
    },
    isClickSideBar() {
      const sideWithLayout = this.$site.themeConfig.sidebar
      return sideWithLayout.some(sidebar => this.sidebarChild(sidebar))
    },
    pageItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = this.currentPage * this.perPage
      return this.pagesRoot.filter((page, i) => (i >= start && i < end))
    },
    pageNavItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = this.currentPage * this.perPage
      return this.pagesInNav.filter((page, i) => (i >= start && i < end))
    },
    pageSideBarItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = this.currentPage * this.perPage
      return this.pagesInSideBar.filter((page, i) => (i >= start && i < end))
    },
    shouldShowNavbar () {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (
        frontmatter.navbar === false ||
        themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      )
    },
    shouldShowSidebar () {
      const { frontmatter } = this.$page
      return (
        !frontmatter.layout &&
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      )
    },
    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$route,
        this.$site,
        this.$localePath
      )
    },
    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    },
    allPages () {
      let pagesNum = 0
      if (this.currentSideBarLink) {
        pagesNum = pageMatch(this.$site.pages, this.currentSideBarLink)
      } else {
        pagesNum = pageMatch(this.$site.pages, this.currentNavLink)
      }
      return pagesNum
    }
  },

  mounted () {
    window.addEventListener('scroll', this.onScroll)
    // configure progress bar
    nprogress.configure({ showSpinner: false })

    this.$router.beforeEach((to, from, next) => {
      // if (to.path !== from.path && !Vue.component(pathToComponentName(to.path))) {
      if (to.path !== from.path) {
        nprogress.start()
      }
      next()
    })

    this.$router.afterEach(() => {
      nprogress.done()
      this.isSidebarOpen = false
    })
  },

  beforeDestroy () {
    window.removeEventListener('scroll', this.onScroll)
  },

  methods: {
    touch(event) {
      event.preventDefault();
    },
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      if (this.isSidebarOpen) {
        document.body.style.overflow = 'hidden';
        document.addEventListener("touchmove" , this.touch, false);
      } else {
        document.body.style.overflow = '';
        document.removeEventListener("touchmove" , this.touch, false);
      }
    },
    clickSidebar () {
      document.body.style.overflow = '';
      document.removeEventListener("touchmove" , this.touch, false);
    },
    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },
    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    },
    onScroll: throttle(function () {
      this.setActiveHash()
    }, 300),
    setActiveHash () {
      const sidebarLinks = [].slice.call(document.querySelectorAll('.sidebar-link'))
      const anchors = [].slice.call(document.querySelectorAll('.header-anchor'))
        .filter(anchor => sidebarLinks.some(sidebarLink => sidebarLink.hash === anchor.hash))

      const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)

      for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i]
        const nextAnchor = anchors[i + 1]

        const isActive = i === 0 && scrollTop === 0 ||
          (scrollTop >= anchor.parentElement.offsetTop + 10 &&
            (!nextAnchor || scrollTop < nextAnchor.parentElement.offsetTop - 10))

        if (isActive && this.$route.hash !== anchor.hash) {
          // store.disableScrollBehavior = true
          this.$router.replace(anchor.hash, () => {
            // execute after scrollBehavior handler.
            this.$nextTick(() => {
              // store.disableScrollBehavior = false
            })
          })
          return
        }
      }
    },
    sidebarChild (sidebar) {
      if (sidebar.children && sidebar.children.length > 0) {
        const childItems = sidebar.children
        return childItems.some(child => child === this.$page.path)
      }
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="./styles/theme.styl" lang="stylus"></style>
