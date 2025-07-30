# Adventist Fonts Setup

This project uses the official Adventist fonts for consistent branding across the website.

## 🎨 Font Configuration

### **Primary Fonts:**
- **Body Text**: Noto Sans (Global)
- **Website Headers**: Advent Sans
- **Serif Text**: Noto Serif (for special content)

## 📝 How to Use

### **1. Automatic Application:**
- **All headings** (h1, h2, h3, h4, h5, h6) automatically use **Advent Sans**
- **All body text** automatically uses **Noto Sans**

### **2. Manual Classes:**

#### **For Headers:**
```tsx
<h1 className="heading-primary">Main Title</h1>
<h2 className="heading-secondary">Subtitle</h2>
```

#### **For Body Text:**
```tsx
<p className="text-body">Regular paragraph text</p>
```

#### **For Serif Text:**
```tsx
<p className="font-serif">Special serif text</p>
```

### **3. Tailwind Classes:**
```tsx
<div className="font-advent">Advent Sans text</div>
<div className="font-body">Noto Sans text</div>
<div className="font-serif">Noto Serif text</div>
```

## 🔧 Global Configuration

### **CSS Setup (`src/index.css`):**
- Font imports from Google Fonts
- Global font family assignments
- Custom utility classes

### **Tailwind Config (`tailwind.config.js`):**
- Font family definitions
- Available as `font-advent`, `font-body`, `font-serif`

## 📏 Font Weights

### **Advent Sans:**
- Available: 100-900
- Recommended: 400 (regular), 600 (semibold), 700 (bold)

### **Noto Sans:**
- Available: 100-900 (with italics)
- Recommended: 400 (regular), 500 (medium), 600 (semibold)

### **Noto Serif:**
- Available: 100-900 (with italics)
- Recommended: 400 (regular), 600 (semibold)

## 🎯 Usage Guidelines

### **Headers:**
- Use **Advent Sans** for all page titles, section headers, and navigation
- Weights: 600 (semibold) for subsections, 700 (bold) for main titles

### **Body Text:**
- Use **Noto Sans** for all paragraphs, descriptions, and general content
- Weight: 400 (regular) for most text, 500 (medium) for emphasis

### **Special Content:**
- Use **Noto Serif** for quotes, testimonials, or special announcements
- Weight: 400 (regular) or 600 (semibold)

## 🌐 Font Loading

Fonts are loaded from Google Fonts with:
- **Preload**: Fast loading
- **Display swap**: Prevents layout shift
- **Fallbacks**: System fonts as backup

## 📱 Responsive Considerations

- Fonts scale appropriately on all devices
- Maintain readability on mobile devices
- Consistent rendering across browsers 