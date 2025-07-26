# ReadLess AI PDF Summarizer

**ReadLess** is a modern, production-ready web application that instantly summarizes any PDF document into a concise, easy-to-read format. Powered by advanced AI models, it helps you save time and grasp key insights from lengthy documents—whether academic, business, technical, or creative.

---

## 🚀 Features

- **Universal PDF Summarization:** Works with any PDF—academic, business, legal, technical, and more.
- **AI-Powered Summaries:** Uses multiple state-of-the-art AI models for robust, fallback-driven summarization (OpenAI, Gemini, Groq, DeepSeek, Together, OpenRouter).
- **Structured Output:** Summaries include a headline, key highlights (with markdown formatting and optional emojis), and a clear conclusion.
- **Responsive UI:** Mobile-first, modern interface built with Next.js 15, Tailwind CSS, and Framer Motion.
- **SEO Optimized:** Uses `next-seo` for best-in-class SEO and social sharing.
- **Performance Optimized:** Dynamic imports, lazy loading, bundle analysis, and image optimization with Next.js `<Image>`.
- **Download & Copy:** Easily copy or download your summary as a PDF.
- **Authentication:** Secure login and user management with Clerk.
- **Upload Limits:** Daily upload limits based on user plan (starter, pro, enterprise).
- **Notifications:** User-friendly feedback with Sonner.
- **No Permanent File Storage:** Uploaded files are not stored permanently for privacy.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Framer Motion, next-seo, next/image
- **Backend/AI:** Node.js, multiple LLM APIs (OpenAI, Gemini, Groq, DeepSeek, Together, OpenRouter)
- **PDF Processing:** LangChain, pdfmake
- **Authentication:** Clerk
- **Notifications:** Sonner
- **Database:** Neon (Postgres serverless)
- **Performance:** Dynamic imports, bundle analyzer, CSS purging

---

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/read-less.git
   cd read-less
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your API keys for OpenAI, Gemini, Groq, etc.
4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🧑‍💻 Project Structure

- `/app` — Next.js app directory (routing, layouts, pages)
- `/components` — UI components (cards, upload, summaries, etc.)
- `/lib` — Database and API integrations
- `/actions` — Server actions (upload, user, etc.)
- `/utils` — Utility functions (PDF, prompts, etc.)
- `/public` — Static assets (images, icons)
- `/styles` — Global and Tailwind CSS

---

## 🌐 SEO & Performance

- **SEO:** Managed with `next-seo` and custom config in `next-seo.config.js`
- **Meta Tags:** All pages include descriptive `<Head>` metadata
- **Image Optimization:** All images use Next.js `<Image>` for responsive, lazy-loaded images
- **Bundle Analysis:** Use `@next/bundle-analyzer` for performance insights
- **CSS Purging:** Tailwind purges unused CSS in production

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repo and create your branch.
2. Make your changes with clear commit messages.
3. Open a pull request describing your changes.

Please follow the code style and best practices used in the project.

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Credits

Created and maintained by **Muhammad Ismaeel**.

Special thanks to all contributors and the open-source community.
