export const hashRE = /#.*$/
export const extRE = /\.(md|html)$/
//匹配.html结尾的表达式
export const htmlRE = /\.html$/
export const indexRE = /(.+\/)index$/
export const navRE = /^\/(web|project|weekly|github)\//
export const sidebarRE = /^\/(web|project|weekly|github)\/.+\//
export const endingSlashRE = /\/$/
export const outboundRE = /^(https?:|mailto:|tel:)/

export function normalize (path) {
  return path
    .replace(hashRE, '')
    .replace(extRE, '')
}

export function getHash (path) {
  const match = path.match(hashRE)
  if (match) {
    return match[0]
  }
}

export function isExternal (path) {
  return outboundRE.test(path)
}

export function isMailto (path) {
  return /^mailto:/.test(path)
}

export function isTel (path) {
  return /^tel:/.test(path)
}

export function ensureExt (path) {
  if (isExternal(path)) {
    return path
  }
  const hashMatch = path.match(hashRE)
  const hash = hashMatch ? hashMatch[0] : ''
  const normalized = normalize(path)

  if (endingSlashRE.test(normalized)) {
    return path
  }
  return normalized + '.html' + hash
}

export function isActive (route, path) {
  const routeHash = route.hash
  const linkHash = getHash(path)
  if (linkHash && routeHash !== linkHash) {
    return false
  }
  const routePath = normalize(route.path)
  const pagePath = normalize(path)
  return routePath === pagePath
}

export function resolvePage (pages, rawPath, base) {
  if (base) {
    rawPath = resolvePath(rawPath, base)
  }
  const path = normalize(rawPath)
  for (let i = 0; i < pages.length; i++) {
    if (normalize(pages[i].path) === path) {
      return Object.assign({}, pages[i], {
        type: 'page',
        path: ensureExt(rawPath)
      })
    }
  }
  console.error(`[vuepress] No matching page found for sidebar item "${rawPath}"`)
  return {}
}

function resolvePath (relative, base, append) {
  const firstChar = relative.charAt(0)
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  const stack = base.split('/')

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop()
  }

  // resolve relative path
  const segments = relative.replace(/^\//, '').split('/')
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === '..') {
      stack.pop()
    } else if (segment !== '.') {
      stack.push(segment)
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('')
  }

  return stack.join('/')
}

export function resolveSidebarItems (page, route, site, localePath) {
  const pageSidebarConfig = page.frontmatter.sidebar
  if (pageSidebarConfig === 'auto') {
    return resolveHeaders(page)
  }
  const { pages, themeConfig } = site

  const localeConfig = localePath && themeConfig.locales
    ? themeConfig.locales[localePath] || themeConfig
    : themeConfig

  const sidebarConfig = localeConfig.sidebar || themeConfig.sidebar
  if (!sidebarConfig) {
    return []
  } else {
    const { base, config } = resolveMatchingConfig(route, sidebarConfig)
    return config
      ? config.map(item => resolveItem(item, pages, base))
      : []
  }
}

function resolveHeaders (page) {
  const headers = groupHeaders(page.headers || [])
  return [{
    type: 'group',
    collapsable: false,
    title: page.title,
    children: headers.map(h => ({
      type: 'auto',
      title: h.title,
      basePath: page.path,
      path: page.path + '#' + h.slug,
      children: h.children || []
    }))
  }]
}

export function groupHeaders (headers) {
  // group h3s under h2
  headers = headers.map(h => Object.assign({}, h))
  let lastH2
  headers.forEach(h => {
    if (h.level === 2) {
      lastH2 = h
    } else if (lastH2) {
      (lastH2.children || (lastH2.children = [])).push(h)
    }
  })
  return headers.filter(h => h.level === 2)
}

export function resolveNavLinkItem (linkItem) {
  return Object.assign(linkItem, {
    type: linkItem.items && linkItem.items.length ? 'links' : 'link'
  })
}

export function resolveMatchingConfig (route, config) {
  if (Array.isArray(config)) {
    return {
      base: '/',
      config: config
    }
  }
  for (const base in config) {
    if (ensureEndingSlash(route.path).indexOf(base) === 0) {
      return {
        base,
        config: config[base]
      }
    }
  }
  return {}
}

function ensureEndingSlash (path) {
  return /(\.html|\/)$/.test(path)
    ? path
    : path + '/'
}

function resolveItem (item, pages, base, isNested) {
  if (typeof item === 'string') {
    return resolvePage(pages, item, base)
  } else if (Array.isArray(item)) {
    return Object.assign(resolvePage(pages, item[0], base), {
      title: item[1]
    })
  } else {
    if (isNested) {
      console.error(
        '[vuepress] Nested sidebar groups are not supported. ' +
        'Consider using navbar + categories instead.'
      )
    }
    const children = item.children || []
    return {
      type: 'group',
      title: item.title,
      children: children.map(child => resolveItem(child, pages, base, true)),
      collapsable: item.collapsable !== false
    }
  }
}
export function layoutsFromNav(navs) {
    return navs.reduce((layouts, nav) =>
        layouts.concat(nav.layout || []), [])
}
// /about/index ==> /about/
export function navsLinksNormalize(link) {
    const re = link.match(indexRE)
    return re ? re[1] : link
}
//过滤掉非html页面
export function pageLinksMatch(link) {
  const re = link.match(htmlRE)
  return re ? link : null
}
//判断当前的nav链接
export function navsLinksMatch(link) {
  const re = link.match(navRE)
  return re ? re[0] : link
}
//判断当前的sideBar链接
export function sideBarLinksMatch(link) {
  const re = link.match(sidebarRE)
  return re ? re[0] : link
}
export function isHidden(page) {
    if(!page.frontmatter) return false
    return page.frontmatter.hidden
}

// remove page in nav
export function pageNormalize(pages, navs) {
    const layouts = layoutsFromNav(navs)
    const navList = navs || []
    const navLinks = navList.map(n => navsLinksNormalize(n.link))
    const withoutRoot = pages
        .filter(page => page.path !== '/' &&
            !~layouts.indexOf(page.frontmatter.layoutTag) &&
            !~navLinks.indexOf(page.path) &&
            page.path.match(htmlRE) &&
            !isHidden(page))
    return pageSortByDate(withoutRoot)
}
// page in root
export function pageRootMatch(pages) {
  const inRoot = pages
    .filter(page => !isHidden(page) && pageLinksMatch(page.path))
  return pageSortByDate(inRoot)
}
// 匹配页面
export function pageMatch(pages, link) {
  const navPages = pages
    .filter(page => page.path !== '/' &&
      ~page.path.indexOf(link) &&
      pageLinksMatch(page.path) &&
      !isHidden(page))
  return pageSortByDate(navPages)
}
//page按时间排序
export function pageSortByDate (pages) {
    const pageWithDate = pages
        .filter(page => page.frontmatter.date )
    const pageWithOutDate = pages
        .filter(page => !page.frontmatter.date )

    let mapped = pageWithDate
        .map((p, i) => ({ index: i, date: +new Date(p.frontmatter.date) }))

    mapped.sort((a, b) => {
        if(a.date > b.date) {
            return -1
        }
        if(a.date < b.date) {
            return 1
        }
        return 0
    })
    return mapped.map(m => pageWithDate[m.index]).concat(pageWithOutDate)
}

export function pageWithCustomLayout(pages, navs, layout) {
  const navList = navs || []
  const navLinks = navList.map(n => navsLinksNormalize(n.link))
  const pagesWithoutRoot = pages
    .filter(page => page.path !== '/' &&
      !~navLinks.indexOf(page.path) &&
      !isHidden(page) &&
      page.frontmatter.layoutTag === layout)
  return pageSortByDate(pagesWithoutRoot)
}
//随机生成兜底img
// export function randomImg() {
//   return '/img/' + (Math.floor(Math.random() * 10)) + '.jpg'
// }

Date.prototype.Format = function (fmt) {
  var o = {
    "y+": this.getFullYear(),
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (!fmt) fmt = 'yyyy-MM-dd HH:mm:ss'
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
  return fmt;
}

export function getUrlName(url) {
  let name = '';
  let urlArray = url.split('/');
  if (urlArray && urlArray.length > 0) {
    let len = urlArray.length - 1;
    name = urlArray[len].substring(0, urlArray[len].length - 5)
  }
  return name
}