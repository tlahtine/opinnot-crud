var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display arviointi page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM arviointi ORDER BY idarviointi desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/arviointi/index.ejs
            res.render('arviointi',{data:''});   
        } else {
            // render to views/arviointi/index.ejs
            res.render('arviointi',{data:rows});
        }
    });
});

// display add arviointi page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('arviointi/add', {
        paivamaara: '',
        arvosana: '',
		idOpiskelija: '',
		idOpintojakso: ''
    })
})

// add a new arviointi
router.post('/add', function(req, res, next) {    

    let paivamaara = req.body.paivamaara;
    let arvosana = req.body.arvosana;
    let idOpiskelija = req.body.idOpiskelija;
    let idOpintojakso = req.body.idOpintojakso;	
    let errors = false;

    if(paivamaara.length === 0 || arvosana.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Anna ainakin etu- ja arvosana");
        // render to add.ejs with flash message
        res.render('arviointi/add', {
            paivamaara: paivamaara,
            arvosana: arvosana,
			idOpiskelija: idOpiskelija,
			idOpintojakso: idOpintojakso
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            paivamaara: paivamaara,
            arvosana: arvosana,
			idOpiskelija: idOpiskelija,
			idOpintojakso: idOpintojakso
        }
        
        // insert query
        dbConn.query('INSERT INTO arviointi SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('arviointi/add', {
                    paivamaara: form_data.paivamaara,
                    arvosana: form_data.arvosana,
                    idOpiskelija: form_data.idOpiskelija,
                    idOpintojakso: form_data.idOpintojakso  					
                })
            } else {                
                req.flash('success', 'arviointi successfully added');
                res.redirect('/arviointi');
            }
        })
    }
})

// display edit arviointi page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM arviointi WHERE idarviointi = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'arviointi not found with id = ' + id)
            res.redirect('/arviointi')
        }
        // if arviointi found
        else {
            // render to edit.ejs
            res.render('arviointi/edit', {
                title: 'Edit arviointi', 
                idarviointi: rows[0].id,
                paivamaara: rows[0].paivamaara,
                arvosana: rows[0].arvosana,
				idOpiskelija: rows[0].idOpiskelija,
                idOpintojakso: rows[0].idOpintojakso,
            })
        }
    })
})

// update arviointi data
router.post('/update/:id', function(req, res, next) {

    let idarviointi = req.params.id;
    let paivamaara = req.body.paivamaara;
    let arvosana = req.body.arvosana;
	let idOpiskelija = req.body.idOpiskelija;
    let idOpintojakso = req.body.idOpintojakso;
    let errors = false;

    if(paivamaara.length === 0 || arvosana.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter paivamaara ja arvosana");
        // render to add.ejs with flash message
        res.render('arviointi/edit', {
            idarviointi: req.params.id,
            paivamaara: paivamaara,
            arvosana: arvosana,
			idOpiskelija: idOpiskelija,
			idOpintojakso: idOpintojakso
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            paivamaara: paivamaara,
            arvosana: arvosana,
			idOpiskelija: idOpiskelija,
			idOpintojakso: idOpintojakso
        }
        // update query
        dbConn.query('UPDATE arviointi SET ? WHERE idarviointi = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('arviointi/edit', {
                    idarviointi: req.params.id,
                    paivamaara: form_data.paivamaara,
                    arvosana: form_data.arvosana,
					idOpiskelija: form_data.idOpiskelija,
					idOpintojakso: form_data.idOpintojakso
                })
            } else {
                req.flash('success', 'arviointi successfully updated');
                res.redirect('/arviointi');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM arviointi WHERE idarviointi = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to arviointi page
            res.redirect('/arviointi')
        } else {
            // set flash message
            req.flash('success', 'arviointi successfully deleted! id = ' + idarviointi)
            // redirect to arviointi page
            res.redirect('/arviointi')
        }
    })
})

module.exports = router;