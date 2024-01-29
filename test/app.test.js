const request = require('supertest')

const app = require('../app')
const {expect} = require('chai')

describe('Test de get du server web Express',  () => {

    // Test de la route POST /messages
    it('Devrait afficher les messages avec succès',  async () => {
        const e =   await request(app)
            .get('/')

        expect(e.status).to.equal(200)
        expect(e.type).to.equal('text/html')
    });

});

describe('Test de post du server web Express', () => {
    // Test de la route POST /messages
    it('Devrait ajouter un message avec succès', (done) => {
        request(app)
            .post('/messages')
            .type('form')
            .set('Content-Type','application/x-www-form-urlencoded')
            .send({
                user_name: 'John',
                user_message: 'Hello, supertest!'
            })
            .expect(302) // Attendez un statut de redirection
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                // Assurez-vous que la redirection est effectuée vers '/'
                expect(res.headers.location).to.equal('/');
                done();
            });
    });
});