var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display opintojakso page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opintojakso ORDER BY idOpintojakso desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opintojakso/index.ejs
            res.render('opintojakso',{data:''});   
        } else {
            // render to views/opintojakso/index.ejs
            res.render('opintojakso',{data:rows});
        }
    });
});

// display add opintojakso page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opintojakso/add', {
        Koodi: '',
        Laajuus: '',
		Nimi: ''
    })
})

// add a new opintojakso
router.post('/add', function(req, res, next) {    

    let koodi = req.body.koodi;
    let laajuus = req.body.laajuus;
    let nimi = req.body.nimi;
    let errors = false;

    if(koodi.length === 0 || laajuus.length === 0 || nimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Anna tarvittavat tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            koodi: koodi,
            laajuus: laajuus,
			nimi: nimi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            koodi: koodi,
            laajuus: laajuus,
			nimi: nimi
        }
        
        // insert query
        dbConn.query('INSERT INTO opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opintojakso/add', {
                    koodi: form_data.koodi,
                    laajuus: form_data.laajuus,
                    nimi: form_data.nimi			
                })
            } else {                
                req.flash('success', 'Opintojakso successfully added');
                res.redirect('/opintojakso');
            }
        })
    }
})

// display edit opintojakso page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM opintojakso WHERE idOpintojakso = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Opintojakso not found with id = ' + id)
            res.redirect('/opintojakso')
        }
        // if opintojakso found
        else {
            // render to edit.ejs
            res.render('opintojakso/edit', {
                title: 'Edit opintojakso', 
                idOpintojakso: rows[0].id,
                koodi: rows[0].koodi,
                laajuus: rows[0].laajuus,
				nimi: rows[0].nimi
            })
        }
    })
})

// update opintojakso data
router.post('/update/:id', function(req, res, next) {

    let idOpintojakso = req.params.id;
    let koodi = req.body.koodi;
    let laajuus = req.body.laajuus;
	let nimi = req.body.nimi;
    let errors = false;

    if(koodi.length === 0 || laajuus.length === 0 || nimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Anna kaikki tiedot");
        // render to add.ejs with flash message
        res.render('opintojakso/edit', {
            idOpintojakso: req.params.id,
            koodi: koodi,
            laajuus: laajuus,
			nimi: nimi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            koodi: koodi,
            laajuus: laajuus,
			nimi: nimi
        }
        // update query
        dbConn.query('UPDATE opintojakso SET ? WHERE idOpintojakso = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opintojakso/edit', {
                    idOpintojakso: req.params.id,
                    koodi: form_data.koodi,
                    laajuus: form_data.laajuus,
					nimi: form_data.nimi
                })
            } else {
                req.flash('success', 'opintojakso successfully updated');
                res.redirect('/opintojakso');
            }
        })
    }
})
   

router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM opintojakso WHERE idOpintojakso = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to opintojakso page
            res.redirect('/opintojakso')
        } else {
            // set flash message
            req.flash('success', 'opintojakso successfully deleted! ID = ' + id)
            // redirect to opintojakso page
            res.redirect('/opintojakso')
        }
    })
})

module.exports = router;