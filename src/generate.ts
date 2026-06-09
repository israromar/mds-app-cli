import { render } from 'ejs';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { buildTemplateContext, shouldIncludePath } from './modules.js';
import type { GeneratorAnswers } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_ROOT = path.resolve(__dirname, '../templates/base');

function walkTemplate(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      files.push(...walkTemplate(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function renderEjs(
  templatePath: string,
  context: ReturnType<typeof buildTemplateContext>,
): string {
  const template = readFileSync(templatePath, 'utf8');
  return render(template, context, { async: false });
}

export async function generateProject(
  answers: GeneratorAnswers,
): Promise<void> {
  const context = buildTemplateContext(answers);

  if (existsSync(answers.targetDir)) {
    const remaining = readdirSync(answers.targetDir);
    if (remaining.length > 0) {
      throw new Error(`Target directory is not empty: ${answers.targetDir}`);
    }
  } else {
    mkdirSync(answers.targetDir, { recursive: true });
  }

  const templateFiles = walkTemplate(TEMPLATE_ROOT);

  for (const templateFile of templateFiles) {
    const relativePath = path
      .relative(TEMPLATE_ROOT, templateFile)
      .replace(/\\/g, '/');

    if (!shouldIncludePath(relativePath, answers.modules)) {
      continue;
    }

    const isEjs = relativePath.endsWith('.ejs');
    const outputRelative = isEjs
      ? relativePath.slice(0, -'.ejs'.length)
      : relativePath;
    const outputPath = path.join(answers.targetDir, outputRelative);
    const outputDir = path.dirname(outputPath);

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    if (isEjs) {
      const content = renderEjs(templateFile, context);
      writeFileSync(outputPath, content, 'utf8');
    } else {
      cpSync(templateFile, outputPath);
    }
  }
}

export function getTemplateRoot(): string {
  return TEMPLATE_ROOT;
}
