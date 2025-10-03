# DawnMark 
## Markdown previewer that lets you live-embed media

Welcome to **DawnMark** - the most powerful **online markdown editor** with live preview and media embedding! **Edit markdown online** for free with our advanced **markdown editor** featuring real-time preview, LaTeX support, and live media embedding. Perfect for developers, writers, and technical documentation. No signup required - start using our **free online markdown editor** instantly!

[![Made by 7sg56](https://img.shields.io/badge/Made%20by-7sg56-blue)](https://github.com/7sg56)
![Version](https://img.shields.io/badge/Version-1.0-green)

---

## Why Choose DawnMark?

Our **markdown editor online** delivers the most powerful free editing experience available. DawnMark has the unique capacity to embed images and media live to test out as per your own will:

- **🚀 Live Preview**: Real-time **markdown live preview** as you type
- **📁 File Upload**: Drag & drop to upload images, GIFs, videos, and documents
- **🔗 Live Media Embedding**: See your uploaded files render instantly with blob URLs
- **🔢 LaTeX Math**: Full LaTeX equation support with live KaTeX rendering
- **⚡ Instant Start**: No registration - start editing immediately
- **🎨 Clean Interface**: Distraction-free writing environment

> **Pro Tip**: Perfect for creating documentation with embedded media, academic writing with math equations, and technical content that needs live preview!

---

## 📁 File Upload & Media Embedding

### How to Embed Files:
1. **Drag & Drop**: Simply drag files into the upload area on the left
2. **Click to Browse**: Use the upload button to select files
3. **Copy Snippets**: Click any uploaded file to copy its Markdown snippet
4. **Paste & Preview**: Paste the snippet into your markdown and see it render live!

**Supported File Types**:
- **Images**: PNG, JPG, GIF, SVG, WebP
- **Documents**: PDF, TXT, MD, and more
- **Media**: Videos and other file formats

**Example Usage**:
```markdown
![My awesome image](blob:http://localhost:3001/abc123)
[Important document.pdf](blob:http://localhost:3001/def456)
```

> **Note**: Files are converted to blob URLs for instant preview without server uploads!

---

## 🧮 LaTeX Math Support

Create professional **math equations in markdown** with our **LaTeX** support. Perfect for academic papers, technical documentation, and scientific content.

### Basic Math Elements
- **Greek letters**: $\alpha$, $\beta$, $\gamma$, $\pi$, $\sigma$, $\theta$
- **Square roots**: $\sqrt{x}$, $\sqrt[n]{x}$, $\sqrt{x^2 + y^2}$  
- **Fractions**: $\frac{a}{b}$, $\frac{numerator}{denominator}$
- **Operators**: $\sum$, $\prod$, $\int$, $\lim$
- **Relations**: $\subset$, $\approx$, $\equiv$, $\leq$, $\geq$

### Inline Math Examples
Write **math in markdown**: $E = mc^2$, $\pi \approx 3.14159$, and the quadratic formula $x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$

### Display Math Equations
**Calculus limit**:
$$
\lim_{h \to 0} \frac{f(x + h) - f(x)}{h} = f'(x)
$$

**Gaussian integral**:
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

**Matrix operations**:
$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix} = 
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$

---

## 📊 Table Generation Example

Create professional tables with proper alignment:

### Feature Comparison
| Feature | DawnMark | Other Editors | Notes |
|---------|:--------:|:-------------:|-------|
| Live Preview | ✅ | ❌ | Instant updates |
| File Upload | ✅ | ❌ | Drag & drop |
| LaTeX Math | ✅ | ⚠️ | Full KaTeX support |
| Media Embedding | ✅ | ❌ | Live blob URLs |
| Export Options | ✅ | ✅ | MD & HTML |
| Free to Use | ✅ | ❌ | No signup required |

### Syntax Examples
```markdown
| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Left text    | Center text    | Right text    |
```

---

## 📝 Advanced Markdown Features

### Text Formatting
**Bold text**, *italic text*, ***bold and italic***, ~~strikethrough~~, and `inline code`.

### Code Blocks with Syntax Highlighting
```javascript
// JavaScript example
function createMarkdownEditor() {
  const editor = new MarkdownEditor({
    livePreview: true,
    mathSupport: true,
    fileUpload: true
  });
  return editor;
}
```

```python
# Python example
def process_markdown(content):
    """Process markdown content with LaTeX support"""
    return markdown_to_html(content, math=True)
```

### Lists and Tasks
**Numbered Lists**:
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item

**Bullet Lists**:
- Main point
  - Sub point
  - Another sub point
- Another main point

**Task Lists**:
- [x] Completed task
- [x] Another completed task
- [ ] Pending task
- [ ] Another pending task

### Quotes and Callouts
> **Important**: This is a blockquote that can contain **formatting** and `code`.
>
> Multiple paragraphs are supported in blockquotes.

### Links and References
- [External link](https://github.com/7sg56)
- [Internal reference](#latex-math-support)
- [Link with title](https://digitalpro.dev "Sourish Ghosh")

---

## 🚀 Getting Started

1. **Start Typing**: Replace this content with your own markdown
2. **Upload Files**: Drag images or documents to the upload area
3. **Use Math**: Write LaTeX equations with `$` for inline or `$$` for display
4. **Export Work**: Download your content as Markdown or HTML
5. **Share**: Copy the rendered HTML for publishing anywhere

### Quick Tips
- Use the **fullscreen** button to focus on writing
- **Copy** buttons let you grab Markdown or HTML instantly
- **Reset** button brings back this welcome content
- All file uploads create **blob URLs** for instant preview

---

**Ready to start writing?** Clear this content and begin creating amazing documentation with live media embedding! 🎉

---
