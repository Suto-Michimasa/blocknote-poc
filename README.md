# BlockNote POC - Notion-like Editor

A proof-of-concept implementation of a modern, block-based rich text editor using BlockNote with a Notion-inspired design.

## ✨ Features

- **Block-based editing** - Create and organize content in moveable blocks
- **Notion-like UI** - Clean, modern interface inspired by Notion
- **Rich text formatting** - Bold, italic, underline, and more
- **Multiple content types** - Headings, paragraphs, lists, images, and more
- **Drag & drop** - Easily reorder blocks
- **Slash commands** - Type `/` to insert different block types
- **Responsive design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Vite** - Fast development and build tool
- **BlockNote** - Block-based rich text editor
- **Mantine** - UI components for BlockNote
- **pnpm** - Package manager

## 🚀 Getting Started

### Prerequisites

- Node.js (18+ recommended)
- pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Suto-Michimasa/blocknote-poc.git
cd blocknote-poc
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 📝 Usage

- **Create new blocks**: Click the `+` button that appears when hovering over the left side of any block
- **Insert blocks with slash commands**: Type `/` followed by the block type (e.g., `/h1` for heading)
- **Format text**: Select text to see formatting options
- **Drag and drop**: Use the `::` handle to drag blocks up or down
- **Delete blocks**: Use backspace on empty blocks

## 🎨 Customization

The editor can be easily customized by modifying:

- `src/App.css` - Visual styling and layout
- `src/App.tsx` - Editor configuration and initial content
- `src/index.css` - Global styles

## 📦 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## 📖 Learn More

- [BlockNote Documentation](https://www.blocknotejs.org/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
