
export class DrawDiagram {

   textToTree(lines:any) {

    const rootNode:any = {
      label: "root",
      parent: '',
      children: []
    };

    const stackParents = [rootNode];
    const stackIndents = [-1];
    for (let idx = 0; idx !== lines.length; idx++) {
      const line = lines[idx];
      const content = line.trim();
      if (!content.length)
        continue;
      const indent = line.indexOf(content);
      while (stackIndents[stackIndents.length - 1] >= indent) {
        stackIndents.pop();
        stackParents.pop();
      }
      const parent = stackParents[stackParents.length - 1];
      const node:any = {
        label: content,
        parent: parent,
        children: []
      };
      parent.children.push(node);
      stackParents.push(node);
      stackIndents.push(indent);
    }

//console.log(rootNode)
    return rootNode;

  }

  splitBy(array: string | any[], char: any) {
    const out = [];
    for (let i = 0; i !== array.length; i++) {
      let j;
      const word = array[i];
      const split = word.split(char);
      for (j = 0; j !== split.length - 1; j++) {
        out.push(split[j] + char);
      }
      out.push(split[j]);
    }
    return out;
  }

// Creates text arranged in rows, with the maximum specified width and height,
// centered around the 'x' coordinate, and with the specified line spacing.
// Adds to the specified text node.
  layoutText(textNode: { appendChild: (arg0: SVGTSpanElement) => void }, text: string, width: number, x: number, height: number, dy: string | number) {
    const namespace = "http://www.w3.org/2000/svg";
    let previousFit = "";
    let tspan = document.createElementNS(namespace, "tspan");
    tspan.setAttributeNS(null, "x", String(x));
    textNode.appendChild(tspan);
    tspan.textContent = "!";
    // @ts-ignore
    height -= dy;
    tspan.textContent = "";

    const firstTspan = tspan;

    // Split by split characters.
    let words = this.splitBy(text.split(/\s/),'');
    const splitChars = ".-";
    for (let j = 0; j !== splitChars.length; j++)
      words = this.splitBy(words, splitChars[j]);

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (tspan.textContent &&
        splitChars.indexOf(tspan.textContent[tspan.textContent.length - 1]) === -1)
        tspan.textContent += " ";
      tspan.textContent += word;

      if (tspan.getComputedTextLength() > width) {
        if (previousFit) {
          tspan.textContent = previousFit;
          if (height < dy)
            break;
          // @ts-ignore
          height -= dy;
          tspan = document.createElementNS(namespace, "tspan");
          tspan.setAttributeNS(null, "x", String(x));
          if (typeof dy === "string") {
            tspan.setAttributeNS(null, "dy", dy);
          }
        }
        tspan.textContent = word;

        textNode.appendChild(tspan);
        while (tspan.getComputedTextLength() > width) {
          // @ts-ignore
          tspan.textContent = tspan.textContent.substring(0, tspan.textContent.length - 1);
        }
      }
      // @ts-ignore
      previousFit = tspan.textContent;
    }

    var baselineShift = -2;
    // @ts-ignore
    firstTspan.setAttributeNS(null, "dy", dy + baselineShift + height / 2);
  }


  buildNextLevel(groups: string | any[]) {
    var groupsOut = [];
    for (var groupIdx = 0; groupIdx !== groups.length; groupIdx++) {
      var group = groups[groupIdx];

      for (var memberIdx = 0; memberIdx !== group.length; memberIdx++) {
        var member = group[memberIdx];
        if (!member.children.length)
          continue;
        groupsOut.push(member.children);
      }
    }
    return groupsOut;
  }

// Converts the tree structure into an array of levels 0... n of cousin and
// sibling nodes.
  makeLevels(tree: { children: any; }) {

    let groups = [];
    const group = tree.children;
    for (let memberIdx = 0; memberIdx !== group.length; memberIdx++)
      groups.push([group[memberIdx]]);
    const levels = [];
    while (true) {
      levels.push(groups);
      groups = this.buildNextLevel(groups);
      if (groups.length === 0)
        break;
    }
    return levels;
  }

// Converts the specified tree to a diagram under diagramGroup in the SVG
   treeToDiagram(tree: any, diagramSvg: { getElementById: (arg0: string) => { (): any; new(): any; setAttribute: { (arg0: string, arg1: number): void; new(): any; }; }; style: { width: string; height: string; }; }, diagramGroup: { appendChild: (arg0: SVGAElement) => void; }) {
    let node;
    let nodeIdx;
    let group;
    let memberIdx;
    let levelIdx;
    let level;
    const levels = this.makeLevels(tree);


    // Decide which level should be fixed.
    let fixedLevel = -1;
    const spacings = [];
    const widths = [];

    for (let levelIdx = 0; levelIdx !== levels.length; levelIdx++) {
      level = levels[levelIdx];
      let spacing = 0;
      let nodesWidth = 0;
      let groupSpacing = 0;
      for (let memberIdx = 0; memberIdx !== level.length; memberIdx++) {
        spacing += groupSpacing;
        let group = level[memberIdx];
        nodesWidth += group.length;
        spacing += (group.length - 1); //sibling gap
        groupSpacing = 1;
      }
      const width = spacing + nodesWidth;
      if (fixedLevel === -1 || width > widths[fixedLevel])
        fixedLevel = levelIdx;
      widths.push(width);
      spacings.push(spacing);
    }
    const maxWidth = Math.max(widths[fixedLevel],
      5 * 3)

    // Position and make elements
    level = levels[fixedLevel];

    // Use any extra space to increase group gap up to ideal gap...
    const useSiblingGap = 1;
    let spare = (maxWidth - widths[fixedLevel]);
    let useCousinGap = 1;
    if (level.length > 1) {
      var spareForGroupGaps = Math.min(spare / (level.length - 1),
        (5 - 2));
      spare -= spareForGroupGaps * (level.length - 1);
      useCousinGap += spareForGroupGaps;
    }
    // ... any left is used to center the fixed group.
    let x = spare / 2;

    for (let memberIdx = 0; memberIdx !== level.length; memberIdx++) {
      const group = level[memberIdx];
      let nodeSpacing = 0;
      for (let nodeIdx = 0; nodeIdx !== group.length; nodeIdx++) {
        x += nodeSpacing;
        node = group[nodeIdx];
        node.x = x;
        x += 1;
        nodeSpacing = useSiblingGap;
      }
      x += useCousinGap;
    }

    // Fixed to top; parent to average of children.
    for (let levelIdx = fixedLevel - 1; levelIdx >= 0; levelIdx--) {
      level = levels[levelIdx];
      // Find positions
      for (memberIdx = 0; memberIdx !== level.length; memberIdx++) {
        let group = level[memberIdx];
        for (let nodeIdx = 0; nodeIdx !== group.length; nodeIdx++) {
          let node = group[nodeIdx];
          if (node.children.length === 0)
            continue;
          let totalX = 0;
          for (let childIdx = 0; childIdx !== node.children.length; childIdx++) {
            const child = node.children[childIdx];
            totalX += child.x;
          }
          node.x = totalX / node.children.length;
        }
      }

    }

    // Second level to bottom; children distributed under parent.
    for (levelIdx = fixedLevel + 1; levelIdx < levels.length; levelIdx++) {
      level = levels[levelIdx];
      // Find positions
      for (memberIdx = 0; memberIdx !== level.length; memberIdx++) {
        group = level[memberIdx];
        const parent = group[0].parent;

        const groupWidth = (group.length - 1) * (1 + 2);
        let x = parent.x - groupWidth / 2;
        for (nodeIdx = 0; nodeIdx !== group.length; nodeIdx++) {
          node = group[nodeIdx];
          node.x = x;
          x += 1 + 2;
        }
      }

    }

    // Now render the tree.
    diagramSvg.getElementById("arrowHead").setAttribute(
      "markerHeight", 3);

    // Find height ratio
    const useLevels = Math.max(levels.length, 6);
    const height = useLevels + (useLevels - 1);

    let xAttribute;
    let yAttribute;
    let widthAttribute;
    let heightAttribute;

    xAttribute = "y";
    yAttribute = "x";
    widthAttribute = "height";
    heightAttribute = "width";

    /*  xAttribute = "x";
      yAttribute = "y";
      widthAttribute = "width";
      heightAttribute = "height";*/


    diagramSvg.style.width = "100%";
    diagramSvg.style.height = "900px";

    const diagramWidth = 1000;
    const diagramHeight = 1000;
    console.log(diagramWidth)

    const xMultiplier = diagramWidth / maxWidth;
    const yMultiplier = diagramHeight / height;

    // Add visual elements.
    const namespace = "http://www.w3.org/2000/svg";
    for (levelIdx = 0; levelIdx !== levels.length; levelIdx++) {
      level = levels[levelIdx];
      for (memberIdx = 0; memberIdx !== level.length; memberIdx++) {
        group = level[memberIdx];
        for (nodeIdx = 0; nodeIdx !== group.length; nodeIdx++) {
          node = group[nodeIdx];
          const link = document.createElementNS("http://www.w3.org/2000/svg", "a");
          link.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', "https://google.com");

          const rect = document.createElementNS(namespace, "rect");
          link.appendChild(rect);
          diagramGroup.appendChild(link);
          const yValue = levelIdx * (1 + 2);

          rect.setAttribute(xAttribute, Math.floor(node.x * xMultiplier)-100 + "px");
          rect.setAttribute(yAttribute, Math.floor(yValue * yMultiplier) + "px");
          rect.setAttribute(widthAttribute, '2.5rem ');
          rect.setAttribute(heightAttribute, '2.5rem ');
          // @ts-ignore
          rect.setAttribute('id', nodeIdx);

          const text = document.createElementNS(namespace, "text");
          //diagramGroup.appendChild(text);

          // Arrange text; method is different for horizontal diagrams.

          const xPos = Math.floor(node.x * xMultiplier);
          const yPos = Math.floor((yValue + 0.5) * yMultiplier);
          text.setAttribute(xAttribute, xPos + "px");
          text.setAttribute(yAttribute,
            Math.floor(yValue * yMultiplier) + "px");

          this.layoutText(text, node.label, yMultiplier - 2, yPos, xMultiplier, 15);


          if (levelIdx === 0)
            continue;  // Level 0 nodes don't have parents.

          // Draw lines to parents.
          node.line = document.createElementNS(namespace, "line");
          diagramGroup.appendChild(node.line);
          const parentOffset = (nodeIdx + 1) / (group.length + 1);
          const line = node.line;
          const parentY = (levelIdx - 1) * (1 + 2);
          let first;
          let second;

          first = "1";
          second = "2";

          line.setAttribute(xAttribute + first,
            Math.floor((node.parent.x + parentOffset) * xMultiplier) -110+
            "px");
          line.setAttribute(yAttribute + first,
            Math.floor((parentY + 1) * yMultiplier) -25 + "px");
          line.setAttribute(xAttribute + second,
            Math.floor((node.x + .5) * xMultiplier) -110+ "px");
          line.setAttribute(yAttribute + second,
            Math.floor(yValue * yMultiplier)-5+ "px");

          line.setAttribute("marker-end", "url(#arrowHead)");
        }
      }
    }
  }
  clear(node: { childNodes: string | any[]; removeChild: (arg0: any) => void; }) {
    while (node.childNodes.length > 0)
      node.removeChild(node.childNodes[0]);
  }
}
