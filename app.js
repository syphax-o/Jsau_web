
const express = require('express');
const app = express();
const port = 8081;
const morgan = require('morgan');
const fs = require('fs').promises;
const path = require('path')

const nunjucks = require('nunjucks')
nunjucks.configure(path.join(__dirname, 'view'), {
    autoescape: true,
    express: app,
    watch: false,
})

app.use(express.static( 'public'));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    const m = await loadMessages();
    res.setHeader('Cache-Control', 'no-cache');
    res.render('index.njk',{m})
    res.status(200)
});
app.post('/messages', async (req, res) => {
    try {
        // Récupère les données du corps de la requête
        const text = req.body['user_message'];
        const user_ID = req.body['user_name'];

        // Transforme le texte en emojis
        const emojiText = transformTextToEmoji(text);

        // Charge le contenu actuel du fichier messages.json
        let messages = await loadMessages();

        // Trouve le plus grand ID existant
        const maxId = messages.length > 0 ? Math.max(...messages.map(message => message.id)) : 0;

        // Incrémente l'ID pour le nouveau message
        const newId = maxId + 1;

        // Ajoute le nouveau message avec le nouvel ID et le texte transformé en emojis
        await addMessage({ id: newId, text: emojiText, user_ID });
        res.setHeader('Cache-Control', 'no-cache');
        res.status(307).redirect('/');
    } catch (error) {
        console.error('Erreur lors de l\'ajout du message:', error);
        res.status(500).send('Erreur lors de l\'ajout du message');
    }
});

// async-promise-async-await

app.delete('/delete/:id', async (req, res) => {
    try {
        const messageId = parseInt(req.params.id);

        // Charge le contenu actuel du fichier messages.json
        let messages = await loadMessages();

        // Recherche l'index du message avec l'ID spécifié
        const messageIndex = messages.findIndex(message => message.id === messageId);

        if (messageIndex === -1) {
            // Si l'ID n'est pas trouvé, retournez une réponse appropriée
            res.status(404).send('Message non trouvé');
            return;
        }

        // Supprime le message de la liste
        messages.splice(messageIndex, 1);

        // Écrit la nouvelle liste de messages dans le fichier messages.json
        await fs.writeFile('messages.json', JSON.stringify(messages, null, 2), 'utf8');
        res.setHeader('Cache-Control', 'no-cache');
        res.send('Message supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression du message:', error);
        res.status(500).send('Erreur lors de la suppression du message');
    }
});

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

const loadMessages = async () => {
    const data = await fs.readFile('messages.json', 'utf8');
    const messages = JSON.parse(data);
    // console.log('Données de messages chargées avec succès:', messages);
    return messages;
};

const addMessage = async (message) => {
    let messages = await loadMessages();
    messages.push(message);
    await fs.writeFile('messages.json', JSON.stringify(messages, null, 2));
    console.log('Nouveau message ajouté avec succès !');
};

if (require.main === module) {
    // Démarrer le serveur uniquement si le fichier est exécuté directement
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });

}

function transformTextToEmoji(text) {
    const emojiMap = {
        happy: '😊',
        sad: '😢',
        love: '❤️',
        angry: '😡',

    };

    // Recherche les emojis entre ::
    const transformedText = text.replace(/::(\w+)::/g, (match, p1) => {
        const emoji = emojiMap[p1.toLowerCase()];
        return emoji ? emoji : match;
    });

    return transformedText;
}

module.exports = app
