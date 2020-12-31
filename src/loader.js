export async function importHTML(entry) {
  // 解析html，生成css和js
  // 1.加载子应用入口
  const content = await loadSource(entry)
  // 2.解析script
  const scripts = await parseScript(content, entry)
  // 3.解析css
  const { css, styles } = parseCss(content, entry)
  // 4.解析body
  const body = parseBody(content)

  console.log({
    scripts, css, styles, body
  })
}
function loadSource(url) {
  return window.fetch(url).then(res => res.text())
}
const ATTR_RE = /["'=\w\s]*/.source
async function parseScript(content, entry) {
  const SCRIPT_CONTENT_RE = new RegExp('<script' + ATTR_RE + '>([\\w\\W]*)<\/script>', 'g')
  const SCRIPT_SRC_RE = new RegExp('<script' + ATTR_RE + 'src="(.+)">', 'g')
  let scripts = []
  let scriptUrls = []
  let match
  // inner js
  while(match = SCRIPT_CONTENT_RE.exec(content)) {
    const script = match[1].trim()
    script && scripts.push(script)
  }
  // outter js
  while(match = SCRIPT_SRC_RE.exec(content)) {
    const url = match[1].trim()
    url && scriptUrls.push(url)
  }
  let remoteScripts = await Promise.all(scriptUrls.map(url => {
    let u = (url.startsWith('http:') || url.startsWith('https:')) ? url : entry + url
    return loadSource(u)
  }))
  // merge
  scripts = remoteScripts.concat(scripts)
  return scripts
}
function parseCss(content, entry) {
  // 1.<link src="xxx.css"></link> 2.<style></style>
  const CSS_LINK_RE = new RegExp('<link' + ATTR_RE + 'href="([^"]+\.css[^"]*)"' + ATTR_RE + '>', 'g')
  const STYLE_CONTENT_RE = /<style>([^<]*)<\/style>/g
  const CSS_RE = new RegExp('(?:' + CSS_LINK_RE.source + ')|(?:' + STYLE_CONTENT_RE.source + ")", 'g')
  let css = []
  let styles = []
  let match
  while(match = CSS_RE.exec(content)) {
    let style
    if (match[1]) {
      style = match[1].trim()
      style && css.push(style)
    } else if (match[2]) {
      style = match[2].trim()
      style && styles.push(style)
    }
  }
  return { css, styles }
}
function parseBody(content){
  const BODY_RE = /<body>([\w\W]*)<\/body>/g
  const SCRIPT_RE = /<script["'=\w\s]*>[\s\S]*<\/script>/g
  let bodyContent = content.match(BODY_RE)
  console.log(bodyContent)
}