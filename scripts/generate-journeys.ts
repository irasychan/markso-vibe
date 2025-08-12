#!/usr/bin/env ts-node
/**
 * Journey Visualization Generator
 * Modes:
 *  --mode=scenario (default): one linear diagram per scenario
 *  --mode=feature: aggregated branched diagram per feature (shared step trie)
 * Includes structural validation (duplicates / directive presence).
 */
import fs from 'node:fs/promises';
import path from 'node:path';

interface ScenarioDoc { feature: string; scenario: string; steps: string[]; tags: string[]; }

const FEATURES_GLOB_DIR = path.join(process.cwd(), 'features');
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'journeys');
const TRACES_DIR = path.join(process.cwd(), 'test-results', 'traces');

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  const featureFiles = (await walk(FEATURES_GLOB_DIR)).filter(f => f.endsWith('.feature'));
  const docs: ScenarioDoc[] = [];
  for (const file of featureFiles) {
    const text = await fs.readFile(file, 'utf8');
    docs.push(...parseFeature(path.basename(file), text));
  }
  const modeArg = process.argv.find(a => a.startsWith('--mode='));
  const mode = modeArg ? modeArg.split('=')[1] : 'scenario';
  // Map scenario slug -> latest trace zip (if any)
  const traceIndex = await buildTraceIndex();

  if (mode === 'scenario') {
    for (const doc of docs) {
      const mermaid = toScenarioMermaid(doc);
      validateMermaid(mermaid, doc.scenario);
      const slug = slugify(`${doc.feature}-${doc.scenario}`);
      const outPath = path.join(OUTPUT_DIR, `${slug}.md`);
      const scenarioSlug = slugify(doc.scenario);
      const tracePath = traceIndex.get(scenarioSlug);
      const traceSection = tracePath ? `\n**Trace:** ${path.relative(process.cwd(), tracePath)}` : '';
      const content = `# ${doc.scenario}\n\nFeature: ${doc.feature}\n\nTags: ${doc.tags.join(', ') || '(none)'}${traceSection}\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n`;
      await fs.writeFile(outPath, content, 'utf8');
    }
    console.log(`Generated ${docs.length} scenario journey diagram files in ${path.relative(process.cwd(), OUTPUT_DIR)}`);
  } else if (mode === 'feature') {
    const byFeature = groupBy(docs, d => d.feature);
    for (const [feature, scenarios] of byFeature.entries()) {
      const graph = buildFeatureGraph(scenarios);
      const mermaid = featureGraphToMermaid(graph);
      validateMermaid(mermaid, feature);
      const slug = slugify(`feature-${feature}`);
      const outPath = path.join(OUTPUT_DIR, `${slug}.md`);
      // Collate trace links per scenario (if present)
      const traceLines = scenarios
        .map(s => ({ s, p: traceIndex.get(slugify(s.scenario)) }))
        .filter(o => !!o.p)
        .map(o => `- ${o.s.scenario}: ${path.relative(process.cwd(), o.p!)}`);
      const traceSection = traceLines.length ? `\n**Traces:**\n\n${traceLines.join('\n')}\n` : '';
      const content = `# Feature Journey: ${feature}\n\nScenarios: ${scenarios.length}${traceSection}\n\n\`\`\`mermaid\n${mermaid}\n\`\`\`\n`;
      await fs.writeFile(outPath, content, 'utf8');
    }
    console.log(`Generated ${byFeature.size} feature journey diagram files in ${path.relative(process.cwd(), OUTPUT_DIR)}`);
  } else {
    console.error(`Unknown mode '${mode}'. Use --mode=scenario or --mode=feature.`);
    process.exit(1);
  }
}

function parseFeature(featureFile: string, text: string): ScenarioDoc[] {
  const lines = text.split(/\r?\n/);
  let currentFeature = featureFile.replace(/\.feature$/, '');
  const background: string[] = [];
  const scenarios: ScenarioDoc[] = [];
  let tags: string[] = [];
  let currentScenario: ScenarioDoc | null = null;
  let inBackground = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('@')) { tags = line.split(/\s+/); continue; }
    if (/^Feature:/i.test(line)) { currentFeature = line.replace(/^Feature:/i, '').trim() || currentFeature; continue; }
    if (/^Background:/i.test(line)) { inBackground = true; continue; }
    if (/^(Scenario|Scenario Outline):/i.test(line)) {
      inBackground = false;
      if (currentScenario) scenarios.push(currentScenario);
      currentScenario = { feature: currentFeature, scenario: line.replace(/^(Scenario|Scenario Outline):/i, '').trim(), steps: [...background], tags: tags.slice() };
      tags = []; // reset tags after consumption
      continue;
    }
    if (/^(Given|When|Then|And|But)\b/i.test(line)) {
      const step = line.replace(/^(Given|When|Then|And|But)\b\s*/i, '').trim();
      if (inBackground) background.push(step); else currentScenario?.steps.push(step);
      continue;
    }
    // ignore Examples tables Phase A
  }
  if (currentScenario) scenarios.push(currentScenario);
  return scenarios;
}

function toScenarioMermaid(doc: ScenarioDoc): string {
  // Linear chain expression to avoid cross-line concatenation issues in Mermaid parsing.
  if (doc.steps.length === 0) return 'flowchart TD\n  start_node([Start]) --> end_node([End])';
  const parts: string[] = [];
  parts.push('flowchart TD');
  let chain = '  start_node([Start])';
  doc.steps.forEach((raw, idx) => {
    const id = `s${idx}`;
    const node = `${id}([${sanitizeLabel(raw)}])`;
    chain += ` --> ${node}`;
  });
  chain += ' --> end_node([End])';
  // Optional soft wrapping every ~120 chars for readability
  const wrapped = chain.match(/.{1,120}(?:\s|$)/g)?.join('\n') ?? chain;
  parts.push(wrapped.trim());
  return parts.join('\n');
}

function sanitizeLabel(s: string) {
  // Remove quotes/backticks entirely; escape angle brackets; collapse double spaces.
  const cleaned = s
    .replace(/["'`]/g, '')
    .replace(/[<>]/g, c => ({ '<': '&lt;', '>': '&gt;' }[c]!))
    .replace(/\s{2,}/g, ' ') // collapse redundant whitespace
    .trim();
  return cleaned;
}

// ---- Feature-level graph (simple trie) ----
interface FeatureNode {
  id: string;
  norm: string; // normalized step text
  originals: Set<string>;
  children: Map<string, FeatureNode>;
  depth: number;
}

function buildFeatureGraph(scenarios: ScenarioDoc[]) {
  const root: FeatureNode = { id: 'start_node', norm: 'Start', originals: new Set(), children: new Map(), depth: 0 };
  let counter = 0;
  for (const sc of scenarios) {
    let current = root;
    for (const rawStep of sc.steps) {
      const norm = normalizeStep(rawStep);
      let child = current.children.get(norm);
      if (!child) {
        child = { id: `n_${counter++}`, norm, originals: new Set(), children: new Map(), depth: current.depth + 1 };
        current.children.set(norm, child);
      }
      child.originals.add(rawStep);
      current = child;
    }
    // mark leaf via empty child set; end edges will connect any leaf to end_node
  }
  return root;
}

function featureGraphToMermaid(root: FeatureNode): string {
  const lines: string[] = ['flowchart TD'];
  lines.push('  start_node([Start])');
  const endId = 'end_node';
  const nodes: FeatureNode[] = [];
  traverse(root, n => { if (n !== root) nodes.push(n); });
  for (const n of nodes) {
    const label = sanitizeLabel(n.norm);
    lines.push(`  ${n.id}([${label || '<step>'}])`);
  }
  lines.push(`  ${endId}([End])`);
  // Edges
  for (const child of root.children.values()) {
    lines.push(`  start_node --> ${child.id}`);
  }
  const leaves: FeatureNode[] = [];
  const stack = [...root.children.values()];
  while (stack.length) {
    const node = stack.pop()!;
    for (const child of node.children.values()) {
      lines.push(`  ${node.id} --> ${child.id}`);
      stack.push(child);
    }
    if (node.children.size === 0) leaves.push(node);
  }
  for (const leaf of leaves) {
    lines.push(`  ${leaf.id} --> ${endId}`);
  }
  return lines.join('\n');
}

function traverse(node: FeatureNode, visit: (n: FeatureNode) => void) {
  for (const child of node.children.values()) {
    visit(child);
    traverse(child, visit);
  }
}

function normalizeStep(step: string): string {
  let s = step.toLowerCase();
  // replace quoted strings
  s = s.replace(/"[^"]*"/g, '<str>');
  // numbers
  s = s.replace(/[-+]?[0-9]*\.?[0-9]+/g, '<num>');
  s = s.replace(/\s{2,}/g, ' ').trim();
  return s;
}

function groupBy<T, K>(arr: T[], key: (t: T) => K): Map<K, T[]> {
  const m = new Map<K, T[]>();
  for (const item of arr) {
    const k = key(item);
    const list = m.get(k);
    if (list) list.push(item); else m.set(k, [item]);
  }
  return m;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
}

async function walk(dir: string, acc: string[] = []): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc); else acc.push(p);
  }
  return acc;
}

await main();

// Basic structural validation to catch duplicate node IDs or missing directive early.
function validateMermaid(diagram: string, context: string) {
  if (!diagram.startsWith('flowchart')) throw new Error(`Invalid diagram (no flowchart) for ${context}`);
  const lines = diagram.split(/\n/);
  const ids = new Set<string>();
  for (const line of lines) {
    const nodeMatch = line.match(/^\s*([a-zA-Z0-9_]+)\(\[/);
    if (nodeMatch) {
      const id = nodeMatch[1];
      if (ids.has(id)) throw new Error(`Duplicate node id '${id}' in ${context}`);
      ids.add(id);
    }
  }
}

async function buildTraceIndex(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  try {
    const entries = await fs.readdir(TRACES_DIR, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile() || !e.name.endsWith('.zip')) continue;
      // filename: ISOtimestamp-scenario-slug.zip -> capture slug portion after first '-' groups (timestamp contains '-')
      // Strategy: remove extension then split, drop first 1 segment (timestamp) and rejoin remainder for slug
      const base = e.name.replace(/\.zip$/, '');
      const parts = base.split('-');
      if (parts.length < 2) continue;
      // Timestamp is ISO date with several '-' so find first part starting with 202 (rough heuristic) then slice after timestamp length
      // Simpler: scenario slug is everything after the first 5 segments of ISO (year month day time ms) but we replaced colons with '-'. We'll fallback: remove first 1 segment only.
      const scenarioSlug = parts.slice(1).join('-');
      const fullPath = path.join(TRACES_DIR, e.name);
      const prev = map.get(scenarioSlug);
      if (!prev) map.set(scenarioSlug, fullPath);
      else {
        // Keep latest by mtime
        const [stPrev, stNew] = await Promise.all([fs.stat(prev), fs.stat(fullPath)]);
        if (stNew.mtimeMs >= stPrev.mtimeMs) map.set(scenarioSlug, fullPath);
      }
    }
  } catch {
    // Traces dir missing is fine
  }
  return map;
}
