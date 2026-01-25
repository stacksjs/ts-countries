import * as fs from 'node:fs'
import * as path from 'node:path'
import { dts } from 'bun-plugin-dtsx'

await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: './dist',
  target: 'node',
  plugins: [dts()],
})

// Copy resources to dist
function copyDir(src: string, dest: string): void {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const entries = fs.readdirSync(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    }
    else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// Copy resources folder
const resourcesSrc = path.join(import.meta.dir, 'src', 'resources')
const resourcesDest = path.join(import.meta.dir, 'dist', 'resources')

if (fs.existsSync(resourcesSrc)) {
  copyDir(resourcesSrc, resourcesDest)
  console.log('Copied resources to dist/')
}
