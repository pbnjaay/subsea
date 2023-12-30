# Utilisez une version spécifique de l'image Alpine avec Node.js
FROM node:18-alpine

# Créez un répertoire de travail dans l'image
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build


# Définissez les variables d'environnement
ENV NODE_ENV=production
ENV SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveHhraG1pbHprYW53a2Zqdm13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTczNTU2MzYsImV4cCI6MjAxMjkzMTYzNn0.u5mUJEdGFnriC_n3g6dv8vR4Tx0-UZuLqZlMWz2VAAM
ENV SUPABASE_URL=https://qoxxkhmilzkanwkfjvmw.supabase.co

# Commande pour lancer l'application en production
CMD ["npm", "run", "start"]
