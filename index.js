const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

const USER_ID = 'VaibhavBhardwaj_28102005'        
const EMAIL_ID = 'vb5066@srmist.edu.in'      
const ROLL_NO  = 'RA2311028030045'         

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/bfhl', (req, res) => {
  const { data } = req.body

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'data is not in array' })
  }

  const invalid_entries = []
  const duplicate_edges = []
  const seen = new Set()
  const validEdges = []

  for (let raw of data) {
    const entry = String(raw).trim()

    if (!/^[A-Z]->[A-Z]$/.test(entry)) {
      invalid_entries.push(entry)
      continue
    }
    if (entry[0] === entry[3]) {       
      invalid_entries.push(entry)
      continue
    }
    if (seen.has(entry)) {
      if (!duplicate_edges.includes(entry)) duplicate_edges.push(entry)
      continue
    }
    seen.add(entry)
    validEdges.push(entry)
  }

  const childMap  = {}   
  const parentMap = {}   
  const allNodes  = new Set()
  const nodeOrder = []

  for (let edge of validEdges) {
    const p = edge[0], c = edge[3]
    if (!allNodes.has(p)) { allNodes.add(p); nodeOrder.push(p) }
    if (!allNodes.has(c)) { allNodes.add(c); nodeOrder.push(c) }
    if (parentMap[c] === undefined) {
      parentMap[c] = p
      if (!childMap[p]) childMap[p] = []
      childMap[p].push(c)
    }
   
  }
  const adjBi = {}
  for (let n of allNodes) adjBi[n] = new Set()
  for (let edge of validEdges) {
    const p = edge[0], c = edge[3]
    adjBi[p].add(c)
    adjBi[c].add(p)
  }

  const visited = new Set()
  const components = []

  for (let start of nodeOrder) {
    if (visited.has(start)) continue
    const comp = []
    const queue = [start]
    visited.add(start)
    while (queue.length) {
      const cur = queue.shift()
      comp.push(cur)
      for (let nb of adjBi[cur]) {
        if (!visited.has(nb)) {
          visited.add(nb)
          queue.push(nb)
        }
      }
    }
    components.push(comp)
  }

  function hasCycle(comp) {
    const compSet = new Set(comp)
    const color = {}
    for (let n of comp) color[n] = 0

    function dfs(n) {
      color[n] = 1
      for (let child of (childMap[n] || [])) {
        if (!compSet.has(child)) continue
        if (color[child] === 1) return true
        if (color[child] === 0 && dfs(child)) return true
      }
      color[n] = 2
      return false
    }

    for (let n of comp) {
      if (color[n] === 0 && dfs(n)) return true
    }
    return false
  }

  function buildTree(node) {
    const obj = {}
    for (let child of (childMap[node] || [])) {
      obj[child] = buildTree(child)
    }
    return obj
  }

  function getDepth(node) {
    const kids = childMap[node] || []
    if (!kids.length) return 1
    return 1 + Math.max(...kids.map(getDepth))
  }

  const hierarchies = []

  for (let comp of components) {
    const cycle = hasCycle(comp)
    const roots = comp.filter(n => parentMap[n] === undefined)
    const root  = roots.length ? roots.sort()[0] : comp.slice().sort()[0]

    if (cycle) {
      hierarchies.push({ root, tree: {}, has_cycle: true })
    } else {
      hierarchies.push({ root, tree: { [root]: buildTree(root) }, depth: getDepth(root) })
    }
  }

  const trees  = hierarchies.filter(h => !h.has_cycle)
  const cycles = hierarchies.filter(h =>  h.has_cycle)

  let largest_tree_root = ''
  let maxD = 0
  for (let h of trees) {
    if (h.depth > maxD || (h.depth === maxD && h.root < largest_tree_root)) {
      maxD = h.depth
      largest_tree_root = h.root
    }
  }

  res.json({
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: ROLL_NO,
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees: trees.length,
      total_cycles: cycles.length,
      largest_tree_root
    }
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('running on port', PORT))