import { pageWithCustomLayout, pageNormalize, navLayoutRE } from './util'

export default {
  computed: {
    isNavLayout() {
      const navsWithLayout = this.$site.themeConfig.nav.filter
      return navsWithLayout.some(nav => nav.link === this.$route.path)
    },
    isSideBar() {
      const sideWithLayout = this.$site.themeConfig.sidebar
      return sideWithLayout.some(sidebar => sidebar.children === this.$route.path)
    },
    pages() {
      const { nav } = this.$site.themeConfig
      if (this.isNavLayout) {
        // get layout from current $route.path
        const layout = currentLayout(nav, this.$route.path)
        return pageWithCustomLayout(this.$site.pages, nav, layout)
      }
      return pageNormalize(this.$site.pages, nav)
    },
    perPage() {
      return (this.$site.themeConfig['per_page'] || 5)
    }
  }
}

function currentLayout(navs, routePath) {
  const routes = navs.filter(nav => nav.link === routePath)
  return routes.length > 0 ? routes[0].layout : null
}

// function sideBarLayout(sidebar, routePath) {
//   const routes = sidebar.filter(nav => nav.link === routePath)
//   return routes.length > 0 ? routes[0].layout : null
// }
