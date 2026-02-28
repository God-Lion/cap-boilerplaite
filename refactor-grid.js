import fs from 'fs';
import path from 'path';

const searchPath = 'c:/Node.Js/proj/boilerplate/packages';

function walk(dir) {
  let results = [];
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      file = path.resolve(dir, file);
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(file));
      } else if (file.endsWith('.tsx')) {
        results.push(file);
      }
    });
  } catch (e) {
    // console.error(e);
  }
  return results;
}

const files = walk(searchPath);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const gridRegex = /<Grid\b([^>]*?)>/g;

  content = content.replace(gridRegex, (fullTag, propsContent) => {
    // Skip if it already has 'size' prop (likely already refactored or Grid2)
    if (/\ssize=/.test(propsContent)) {
      return fullTag;
    }

    // Identify if it's the pattern we want to refactor: 'item' or breakpoint props
    if (!/\sitem\b/.test(propsContent) && !/\s(xs|sm|md|lg|xl)=/.test(propsContent)) {
      return fullTag;
    }

    let props = propsContent;
    let isSelfClosing = fullTag.endsWith('/>');
    
    // Remove 'item' prop
    if (/\sitem\b/.test(props)) {
      props = props.replace(/\sitem\b/g, '');
    }

    // Collect breakpoints
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
    let collectedBreakpoints = {};
    
    breakpoints.forEach(bp => {
      // Match bp={...}
      const bpRegex = new RegExp(`\\s${bp}=\\{([^}]+)\\}`, 'g');
      props = props.replace(bpRegex, (match, val) => {
        collectedBreakpoints[bp] = val.trim();
        return '';
      });
      
      // Match bp="..."
      const bpLiteralRegex = new RegExp(`\\s${bp}=['"]([^'"]+)['"]`, 'g');
      props = props.replace(bpLiteralRegex, (match, val) => {
        collectedBreakpoints[bp] = val.trim();
        return '';
      });

      // Match bp={12} or bp={6} (already covered by first regex, but just in case)
    });

    if (Object.keys(collectedBreakpoints).length > 0) {
      const sizeStr = Object.entries(collectedBreakpoints)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ');
      
      props += ` size={{ ${sizeStr} }}`;
    }

    changed = true;
    // Clean up extra spaces and ensure correct closing
    props = props.replace(/\s+/g, ' ').trim();
    if (isSelfClosing && props.endsWith('/')) {
        props = props.slice(0, -1).trim();
    }
    return `<Grid ${props}${isSelfClosing ? ' /' : ''}>`;
  });

  if (changed) {
    console.log(`Updated ${file}`);
    fs.writeFileSync(file, content, 'utf8');
  }
});
