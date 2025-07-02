# 🏃‍♂️ Oura Health Dashboard

A beautiful, responsive web application that displays your personal Oura Ring health data with interactive charts and insights.

## ✨ Features

- 🔐 **Password Protected** - Secure access to your personal health data
- 📊 **Interactive Dashboard** - Overview of sleep, readiness, and activity metrics
- 😴 **Sleep Analysis** - Detailed sleep patterns, stages, and quality metrics
- 🎯 **Readiness Insights** - Recovery and stress indicators
- 📅 **Date Range Selection** - View data for last week, month, custom periods, etc.
- 📱 **Mobile Responsive** - Works perfectly on phones, tablets, and desktop
- ⚡ **Real Data** - Built with your actual 2024 Oura Ring data (246 sleep records, 243 readiness records, 267 activity records)

## 🚀 Live Demo

**Password:** `jt+cursor+agent129369`

## 📊 Your Data Summary

- **Sleep Records:** 246 nights
- **Readiness Records:** 243 days  
- **Activity Records:** 267 days
- **Date Range:** January 1, 2024 - December 31, 2024

## 🛠️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS + Framer Motion
- **Charts:** Recharts
- **Build Tool:** Vite
- **Deployment:** GitHub Pages
- **Authentication:** Client-side password protection

## 🚀 Deployment to GitHub Pages

### 1. Push to GitHub

```bash
cd /workspace/OuraWebbApp
git init
git add .
git commit -m "Initial commit: Oura Health Dashboard"
git branch -M main
git remote add origin https://github.com/jtubbs29/bsb.git
git push -u origin main
```

### 2. Enable GitHub Pages

1. Go to your repository: https://github.com/jtubbs29/bsb
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under "Source", select **GitHub Actions**
5. The workflow will automatically deploy on every push to main

### 3. Access Your App

After deployment completes (2-3 minutes), your app will be available at:
**https://jtubbs29.github.io/bsb/**

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- npm

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Security Features

- **Password Protection:** Client-side authentication with session management
- **Local Data:** All Oura data is embedded in the app (no external API calls)
- **HTTPS:** Enforced on GitHub Pages
- **Session Timeout:** 24-hour automatic logout

## 📱 Mobile Experience

- **Responsive Design:** Optimized for all screen sizes
- **Touch Interactions:** Smooth chart interactions on mobile
- **Progressive Enhancement:** Works offline after first load

## 🎨 Design Features

- **Modern UI:** Clean, minimalist design inspired by health apps
- **Smooth Animations:** Framer Motion powered transitions
- **Color-Coded Metrics:** Intuitive scoring with green/yellow/red indicators
- **Interactive Charts:** Hover/touch for detailed data points

## 📈 Health Insights

### Sleep Analysis
- Sleep score trends over time
- Sleep stage distribution (Deep, REM, Light)
- Sleep efficiency and latency metrics
- Personalized recommendations

### Readiness Tracking
- Recovery score with contributing factors
- HRV (Heart Rate Variability) trends
- Activity balance indicators
- Temperature deviation monitoring

### Activity Overview
- Daily step counts and active calories
- Activity score patterns
- Integration with sleep and readiness data

## 🔧 Customization

To update with new Oura data:

1. Replace files in `src/data/` with new exports from Oura API
2. Update `fetchOuraData.cjs` with new date ranges if needed
3. Rebuild and redeploy

## 🐛 Troubleshooting

### Common Issues

**App won't load:**
- Check GitHub Pages deployment status
- Ensure all files are committed and pushed
- Verify GitHub Actions workflow completed successfully

**Password not working:**
- Password is case-sensitive: `jt+cursor+agent129369`
- Clear browser cache and try again
- Check browser console for errors

**Charts not displaying:**
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser compatibility (modern browsers required)

## 📄 License

Private project for personal use.

## 🙏 Acknowledgments

- Built with React + Vite
- Charts powered by Recharts
- Icons from Lucide React
- Design inspired by modern health applications
- Data courtesy of Oura Ring API

---

**Happy health tracking! 🏃‍♂️💤🎯**
