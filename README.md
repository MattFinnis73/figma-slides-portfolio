# Figma Slides Portfolio

A beautiful, responsive portfolio website to showcase your Figma slide presentations. Upload PDFs, edit titles, and share your work with a public link.

## ✨ Features

- **📤 PDF Upload**: Convert PDF presentations into individual slide images
- **🖼️ Gallery View**: Clean, modern card-based layout with hover effects
- **👁️ Slide Viewer**: Full-screen viewer with navigation controls
- **✏️ Inline Editing**: Edit project titles and descriptions with a click
- **🔗 Shareable Links**: Publish and share your portfolio with anyone
- **💾 Auto-Save**: Local storage keeps your changes safe
- **☁️ Cloud Publishing**: Save to Supabase for permanent hosting

## 🚀 Quick Start (Development)

This project runs in Figma Make, so no local setup is required!

1. Open in Figma Make
2. Click on any project card to upload a PDF
3. Edit titles by clicking the pencil icon
4. Click "Publish & Share" to create a shareable link

## 🌐 Deploy to Production

To share your portfolio publicly, you'll need to deploy it. Follow the detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md).

**Quick Deploy to Vercel:**

1. Push this code to GitHub
2. Import to Vercel
3. Add environment variables (Supabase credentials)
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🛠️ Built With

- **React** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **react-pdf** - PDF processing
- **Supabase** - Backend & storage
- **Lucide React** - Icons

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main app component
│   │   └── components/
│   │       ├── PDFUploader.tsx  # PDF upload & conversion
│   │       ├── SlideCard.tsx    # Project card component
│   │       └── SlideViewer.tsx  # Full-screen slide viewer
│   ├── styles/
│   │   └── index.css            # Global styles
│   └── main.tsx                 # App entry point
├── supabase/
│   └── functions/
│       └── server/
│           └── index.tsx         # API routes
├── index.html                    # HTML template
├── vercel.json                   # Vercel config
└── package.json                  # Dependencies
```

## 🎨 Customization

### Change Default Projects

Edit the initial `projects` state in `src/app/App.tsx`:

```typescript
const [projects, setProjects] = useState<Project[]>([
  {
    id: 1,
    title: 'Your Project Name',
    description: 'Your description',
    slides: []
  },
  // Add more projects...
]);
```

### Modify Styles

Edit Tailwind classes in components or update `src/styles/index.css` for global styles.

### Change Site Title

Click the pencil icon next to the title in the app, or edit the default in `App.tsx`:

```typescript
const [siteTitle, setSiteTitle] = useState('Your Portfolio Name');
```

## 🔒 Environment Variables

For deployment, you'll need these Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Tips

- **Large PDFs**: PDFs with many pages may take a moment to process
- **Storage**: Published portfolios are stored in Supabase indefinitely
- **Sharing**: Each "Publish & Share" creates a unique, shareable URL
- **Editing**: Changes are saved locally until you publish again

## 📸 Screenshots

![Portfolio Gallery View](https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1080)
*Gallery view with project cards*

![Slide Viewer](https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1080)
*Full-screen slide viewer*

---

Made with ❤️ in Figma Make
