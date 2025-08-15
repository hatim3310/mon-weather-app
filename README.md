# 🌤️ WeatherApp - Application Météo Complète

Une application météo moderne et complète développée en React avec toutes les APIs gratuites d'OpenWeatherMap.



## ✨ Fonctionnalités

### 🌍 **Données Météo Complètes**
- **Météo actuelle** avec température, ressenti, humidité, pression
- **Prévisions 8 heures** avec probabilité de pluie
- **Prévisions 7 jours** détaillées
- **Qualité de l'air** (AQI + polluants CO, NO₂, PM2.5)
- **Index UV** avec niveaux de protection
- **Lever/coucher du soleil**
- **Détails du vent** (vitesse, direction)
- **Visibilité atmosphérique**

### 🔍 **Recherche Intelligente**
- **Autocomplete** avec suggestions en temps réel
- **Dropdown moderne** avec villes populaires
- **Géolocalisation automatique** des villes
- **Support mondial** (200,000+ villes)
- **Villes marocaines** en priorité

### 🎨 **Interface Moderne**
- **Design glassmorphism** avec effets de flou
- **Responsive** (mobile, tablet, desktop)
- **Animations fluides** et transitions
- **Mode jour/nuit** automatique
- **Graphiques de température** interactifs
- **Icônes météo** dynamiques

### ⚙️ **Personnalisation**
- **Unités métriques/impériales** (°C/°F, km/h/mph)
- **Langue française** par défaut
- **Casablanca** comme ville par défaut
- **Cache intelligent** pour optimiser les requêtes

## 🚀 Installation

### Prérequis
- [Node.js](https://nodejs.org/) (version 14 ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Clé API [OpenWeatherMap](https://openweathermap.org/api) (gratuite)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-username/weather-app.git
cd weather-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'API**
- Créez un compte sur [OpenWeatherMap](https://openweathermap.org/api)
- Récupérez votre clé API gratuite
- Remplacez `API_KEY` dans `src/WeatherApp.js` :
```javascript
const API_KEY = 'VOTRE_CLE_API_ICI';
```

4. **Lancer l'application**
```bash
npm start
```

5. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 📱 Utilisation

### Recherche de villes
1. **Tapez** dans la barre de recherche (minimum 2 caractères)
2. **Sélectionnez** une ville dans le dropdown
3. **Ou cliquez** dans la recherche pour voir les villes populaires

### Changement d'unités
- **Cliquez sur °C/°F** pour changer les unités de température
- **Le vent** et autres métriques s'adaptent automatiquement

### Navigation
- **Prévisions horaires** : Scroll horizontal sur mobile
- **Détails** : Toutes les métriques sur des cartes séparées
- **Graphique** : Évolution de la température en temps réel

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework JavaScript
- **Lucide React** - Icônes modernes
- **Tailwind CSS** - Framework CSS utilitaire
- **JavaScript ES6+** - Langage de programmation

### APIs Externes
- **OpenWeatherMap Current Weather** - Météo actuelle
- **OpenWeatherMap 5 Day Forecast** - Prévisions 5 jours
- **OpenWeatherMap Geocoding** - Recherche de villes
- **OpenWeatherMap Air Pollution** - Qualité de l'air
- **OpenWeatherMap UV Index** - Index UV

### Outils de Développement
- **Create React App** - Configuration React
- **VS Code** - Éditeur recommandé
- **Git** - Contrôle de version

## 📊 Structure du Projet

```
weather-app/
├── public/
│   ├── index.html          # HTML principal avec Tailwind CDN
│   └── favicon.ico
├── src/
│   ├── WeatherApp.js       # Composant principal de l'app
│   ├── App.js              # Point d'entrée React
│   ├── index.js            # Rendu React
│   └── App.css             # Styles supplémentaires
├── package.json            # Dépendances et scripts
└── README.md               # Documentation
```

## 🌐 APIs Utilisées

### OpenWeatherMap (Plan Gratuit - 1000 requêtes/jour)

| API | Endpoint | Données |
|-----|----------|---------|
| **Current Weather** | `/weather` | Température, vent, humidité, pression |
| **5 Day Forecast** | `/forecast` | Prévisions 5 jours toutes les 3h |
| **Geocoding** | `/geo/direct` | Recherche de villes par nom |
| **Air Pollution** | `/air_pollution` | AQI, CO, NO₂, PM2.5, PM10 |
| **UV Index** | `/uvi` | Index ultraviolet |

## 🎯 Fonctionnalités Techniques

### Gestion d'État
- **useState** pour les données météo, recherche, loading
- **useEffect** pour les appels API automatiques
- **useRef** pour la gestion du dropdown

### Performance
- **Debounce** sur la recherche (500ms)
- **Cache des requêtes** pour éviter les doublons
- **Lazy loading** des données secondaires (UV, air)

### Responsive Design
- **Mobile-first** approach
- **Breakpoints** : `sm:`, `md:`, `lg:`
- **Flexbox/Grid** pour les layouts
- **Scroll horizontal** sur mobile

### Gestion d'Erreurs
- **Try/catch** sur tous les appels API
- **Messages d'erreur** utilisateur-friendly
- **Fallbacks** si certaines données ne sont pas disponibles
- **Retry automatique** en cas d'échec

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Glisser le dossier build/ sur netlify.com
```

### GitHub Pages
```bash
npm install --save-dev gh-pages
npm run build
npm run deploy
```

## 📈 Améliorations Futures

### Fonctionnalités Prévues
- [ ] **PWA** (Progressive Web App)
- [ ] **Géolocalisation automatique** au chargement
- [ ] **Historique** des villes recherchées
- [ ] **Favoris** avec sauvegarde locale
- [ ] **Notifications** d'alertes météo
- [ ] **Mode sombre/clair** manuel
- [ ] **Partage** des conditions météo
- [ ] **Cartes météo** interactives

### Optimisations Techniques
- [ ] **Service Worker** pour le cache
- [ ] **Lazy loading** des composants
- [ ] **Code splitting** par route
- [ ] **Bundle analysis** et optimisation
- [ ] **Tests unitaires** avec Jest
- [ ] **CI/CD** avec GitHub Actions

## 🤝 Contribution

1. **Fork** le projet
2. **Créez** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrez** une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Lamarti Hatim** - [@hatim3310](https://github.com/hatim3310)

## 🙏 Remerciements

- **OpenWeatherMap** pour les APIs météo gratuites
- **Lucide** pour les icônes SVG
- **Tailwind CSS** pour le framework CSS
- **React Team** pour le framework JavaScript

## 📞 Support

Si vous avez des questions ou des problèmes :


- 🐛 **Issues** : [GitHub Issues](https://github.com/hatim3310/mon-weather-app/issues)
- 📖 **Documentation** : [Wiki](https://github.com/hatim3310/mon-weather-app/wiki)

---

⭐ **N'oubliez pas de donner une étoile si ce projet vous a aidé !**