# 🌤️ WeatherApp

Une application météo moderne et complète développée en React avec les APIs gratuites d'OpenWeatherMap.

![Weather App Screenshot](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-FE7D37?style=for-the-badge&logo=openweathermap&logoColor=white)

## ✨ Fonctionnalités

- 🌡️ **Météo actuelle** avec température, ressenti, humidité, pression
- ⏰ **Prévisions 8 heures** avec probabilité de pluie
- 📅 **Prévisions 7 jours** détaillées
- 🌬️ **Qualité de l'air** (AQI + polluants CO, NO₂, PM2.5)
- ☀️ **Index UV** avec niveaux de protection
- 🌅 **Lever/coucher du soleil**
- 💨 **Détails du vent** (vitesse, direction)
- 👁️ **Visibilité atmosphérique**
- 🔍 **Recherche intelligente** avec autocomplete
- 🎨 **Design glassmorphism** responsive
- 🌓 **Mode jour/nuit** automatique
- 📊 **Graphiques de température** interactifs

## 🚀 Installation Rapide

### Prérequis
- Node.js (version 14+)
- Une clé API [OpenWeatherMap](https://openweathermap.org/api) gratuite

### Étapes

1. **Cloner le projet**
```bash
git clone https://github.com/hatim3310/mon-weather-app.git
cd mon-weather-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'API**
Éditez `src/WeatherApp.js` et remplacez :
```javascript
const API_KEY = 'VOTRE_CLE_API_ICI';
```

4. **Lancer l'application**
```bash
npm start
```

5. **Ouvrir** → `http://localhost:3000`

## 🛠️ Technologies

- **React 18** - Framework JavaScript
- **Tailwind CSS** - Styling moderne
- **Lucide React** - Icônes
- **OpenWeatherMap API** - Données météo

## 📋 APIs Utilisées

| API | Fonction | Données |
|-----|----------|---------|
| Current Weather | Météo actuelle | Température, vent, humidité |
| 5 Day Forecast | Prévisions | 5 jours, toutes les 3h |
| Geocoding | Recherche | Villes par nom |
| Air Pollution | Qualité air | AQI, polluants |
| UV Index | UV | Index ultraviolet |

## 📱 Fonctionnalités Techniques

- ⚡ **Recherche avec debounce** (500ms)
- 🔄 **Cache des requêtes** pour optimiser
- 📱 **Design responsive** mobile-first
- 🎯 **Gestion d'erreurs** complète
- 🌍 **Support international** (unités métriques/impériales)

## 🎨 Interface

- Design glassmorphism avec effets de flou
- Animations fluides et transitions
- Mode sombre automatique selon l'heure
- Interface intuitive et moderne
- Optimisé pour tous les écrans

## 📸 Aperçu

L'application affiche :
- Température actuelle avec icône météo animée
- Prévisions horaires scrollables
- Graphique d'évolution de température
- Détails complets (vent, humidité, pression, UV, qualité air)
- Prévisions 7 jours
- Lever/coucher du soleil

## 🔧 Configuration

### Unités
- Métrique : °C, km/h
- Impérial : °F, mph

### Ville par défaut
Casablanca (modifiable dans le code)

### Limite API
1000 requêtes/jour (plan gratuit OpenWeatherMap)

## 🚀 Déploiement

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Glisser le dossier build/ sur netlify.com
```

## 🤝 Contribution

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Push (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

MIT License - voir le fichier [LICENSE](LICENSE)

## 👨‍💻 Auteur

**Lamarti Hatim** - [@hatim3310](https://github.com/hatim3310)

## 🙏 Remerciements

- [OpenWeatherMap](https://openweathermap.org/) pour les APIs gratuites
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS
- [Lucide](https://lucide.dev/) pour les icônes

## 📞 Support

- 🐛 [Issues](https://github.com/hatim3310/mon-weather-app/issues)
- 📧 Contact : hatimlamarti3@gmail.com

---

⭐ **N'hésitez pas à donner une étoile si ce projet vous plaît !**
