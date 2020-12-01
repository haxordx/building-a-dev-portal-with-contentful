const SPACE = '50h346vribst';
const ACCESSTOKEN = 'LgowO6gdzH0FqRaKqH3JAsVHFOkKrSEgnDkA_-odxbg';

// main.js
const express = require('express')
const app = express();
const port = 3000;
var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const contentful = require('contentful');
const documentToHtmlString = require('@contentful/rich-text-html-renderer').documentToHtmlString;

const _ = require('lodash');

var client = contentful.createClient({
    space: SPACE,
    accessToken: ACCESSTOKEN
});

let getItems = async function () {

    let results = await client.getEntries({
        content_type: 'progress'
    })
        .then((response) => { return response.items })
        .catch(console.error)

    return results;

}

let getItem = async function (slug) {

    let results = await client.getEntries({
        content_type: 'progress',
        'fields.slug': slug
    })
        .then((response) => { return response.items })
        .catch(console.error)

    return results;

}

app.get('/tutorial/:slug', async (req, res) => {

    let slug = req.params.slug;

    let results = await getItem(slug);

    if (results[0]) {

        steps = _.map(results[0].fields.steps, (step) => {
            step.html = documentToHtmlString(step.fields.source);
            return step;
        });

        sidebar = _.map(results[0].fields.steps, (step) => {
            return step.fields;
        });

    }

    return res.render('tutorial', {
        title: results[0].fields.title,
        sidebar,
        steps
    });

});

app.get('/', async (req, res) => {

    let result = await getItems();

    console.log(result[0])

    return res.render('home', {
        tutorials: result
    });

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
