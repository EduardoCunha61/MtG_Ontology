var express = require('express');
var router = express.Router();

const SparqlClient = require('sparql-client-2')
const SPARQL = SparqlClient.SPARQL
const endpoint = 'http://localhost:7200/repositories/PRC_2018'
const myupdateEndpoint = 'http://localhost:7200/repositories/PRC_2018/statements'

var client = new SparqlClient( endpoint, {updateEndpoint: myupdateEndpoint, 
                               defaultParameters: {format: 'json'}})

client.register({rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
                 mtg: 'http://www.semanticweb.org/eduardo/ontologies/2018/5/untitled-ontology-14#'})

/* GET home page. */
router.get('/1', function(req, res, next) {
    var query = "select ?cor (count(distinct ?card) as ?contagens)\n" +
                "WHERE {\n" +
                "?card mtg:cor ?cor.\n}" +
                "GROUP BY ?cor "
    client.query(query)
            .execute()
            .then(function(qres){
                console.log(JSON.stringify(qres))
                var resList = qres.results.bindings
                var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Cor </th>\n" + "\t\t<th> Contagem </th>\n" + "\t</tr>"  

                for(var i in resList){
                    var cor = resList[i].cor.value
                    var contagens = resList[i].contagens.value
                    var color = cor.slice(cor.indexOf('#')+1)
                    var contagem = contagens.slice(contagens.indexOf('#')+1)
                    
                    dot += '\t<tr>\n' + '\t\t<th>' + cor + '</th>\n' + '\t\t<th>' + contagem + '</th>\n' + '\t</tr>'
                }
                    dot += "</table>"      
                res.render("result", {renderingCode: dot})
            })
            .catch((error)=>{
                res.render("error", {error:error})
            })
})

router.get('/2', (req, res, next)=>{
    var did = req.params.did
    var query = "select ?name ?color\n " +
                "where{\n " +
                "?c mtg:tem_carta ?card.\n" +
                "?card mtg:nome ?name.\n" +
                "?card mtg:ataque ?at.\n" +
                "?card mtg:cor ?color.\n" +
                "FILTER(regex(str(?color), \"Verde\")).\n" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dname = resList[0].name.value
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Nome </th>\n" + "\t\t<th> Cor </th>\n" + "\t</tr>"

            for(var i in resList){
                var name = resList[i].name.value
                var color = resList[i].color.value
                var cor = color.slice(color.indexOf('#')+1)
                var nome = name.slice(name.indexOf('#')+1)
                
                dot += '\t<tr>\n' + '\t\t<th>' + name + '</th>\n' + '\t\t<th>' + color + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/3', (req, res, next)=>{
    var did = req.params.did
    var query = "select ?name ?color ?collection\n " +
                "where{\n " +
                "?c mtg:tem_carta ?card.\n" +
                "?card mtg:nome ?name.\n" +
                "?card mtg:cor ?color.\n" +
                "?c mtg:nome_coleção ?collection.\n" +
                "}"              

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Nome </th>\n" + "\t\t<th> Cor </th>\n" + "\t\t<th> Coleção </th>\n" + "\t</tr>"
    
            for(var i in resList){
                var color = resList[i].color.value
                var cor = color.slice(color.indexOf('#')+1)
                var name = resList[i].name.value
                var nome = name.slice(name.indexOf('#')+1)
                var collection = resList[i].collection.value
                var colecao = collection.slice(collection.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + name + '</th>\n' + '\t\t<th>' + color + '</th>\n' + '\t\t<th>' + colecao + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/4', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?card ?rarity\n" +
                "where{\n" +
                "?card rdf:type mtg:Feitiço.\n" +
                "?card mtg:raridade ?rarity.\n" + 
                "FILTER(regex(str(?rarity), \"Mitica\")).\n" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Raridade </th>\n" + "\t</tr>"

            for(var i in resList){
                var card = resList[i].card.value
                var carta = card.slice(card.indexOf('#')+1)
                var rarity = resList[i].rarity.value
                var raridade = rarity.slice(rarity.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + carta + '</th>\n' + '\t\t<th>' + rarity + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/5', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?card ?designer\n" +
                "where{\n" +
                "?designer mtg:desenhou ?card.\n" +
                "FILTER(regex(str(?designer), \"Jason_Chan\")).\n" + 
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Designer </th>\n" + "\t</tr>"

            for(var i in resList){
                var card = resList[i].card.value
                var carta = card.slice(card.indexOf('#')+1)
                var designer = resList[i].designer.value
                var des = designer.slice(designer.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + carta + '</th>\n' + '\t\t<th>' + des + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/6', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?card ?subtipo ?cor ?colecao\n" +
                "where{\n" +
                "?c mtg:tem_carta ?card.\n" +
                "?card mtg:nome ?name.\n" + 
                "?card mtg:subtipo ?subtipo.\n" +
                "FILTER(regex(str(?subtipo), \"Angel\")).\n" +
                "?card mtg:cor ?cor.\n" +
                "?colecao mtg:tem_carta ?card" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Subtipo </th>\n" + "\t\t<th> Cor </th>\n" + "\t\t<th> Coleção </th>\n" + "\t</tr>"

            for(var i in resList){
                var card = resList[i].card.value
                var carta = card.slice(card.indexOf('#')+1)
                var subtipo = resList[i].subtipo.value
                var subtype = subtipo.slice(subtipo.indexOf('#')+1)
                var cor = resList[i].cor.value
                var color = cor.slice(cor.indexOf('#')+1)
                var colecao = resList[i].colecao.value
                var collection = colecao.slice(colecao.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' +  carta + '</th>\n' + '\t\t<th>' + subtype + '</th>\n' + '\t\t<th>' + color + '</th>\n' + '\t\t<th>' + collection + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/7', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?card ?rarity\n" +
                "where{\n" +
                "?col mtg:pertence_à_expansão ?exp.\n" +
                "FILTER(regex(str(?exp), \"Alara\")).\n" + 
                "?card mtg:está_no_baralho ?deck.\n" +
                "FILTER(regex(str(?deck), \"Baralho_Eduardo\")).\n" +
                "?card mtg:pertence_à_coleção ?col.\n" +
                "?card mtg:raridade ?rarity.\n" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Raridade </th>\n" + "\t</tr>"

            for(var i in resList){
                var card = resList[i].card.value
                var carta = card.slice(card.indexOf('#')+1)
                var rarity = resList[i].rarity.value
                var raridade = rarity.slice(rarity.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + carta + '</th>\n' + '\t\t<th>' + raridade + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/8', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?carta ?custo_de_Mana ?baralho\n" +
                "where{\n" +
                "?carta mtg:cor ?cor.\n" +
                "FILTER(regex(str(?cor), \"Preto\")).\n" + 
                "?carta mtg:custo_de_mana ?custo_de_Mana.\n" +
                "?carta mtg:está_no_baralho ?baralho.\n" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Custo de Mana </th>\n" + "\t\t<th> Baralho </th>\n" + "\t</tr>"

            for(var i in resList){
                var carta = resList[i].carta.value
                var card = carta.slice(carta.indexOf('#')+1)
                var custo_de_Mana = resList[i].custo_de_Mana.value
                var mana_cost = custo_de_Mana.slice(custo_de_Mana.indexOf('#')+1)
                var baralho = resList[i].baralho.value
                var deck = baralho.slice(baralho.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + card + '</th>\n' + '\t\t<th>' + mana_cost + '</th>\n' +  '\t\t<th>' + deck + '</th>\n' +'\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/9', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?carta ?raridade ?cor ?expansão\n" +
                "where{\n" +
                "?expansão mtg:tem_coleção ?col.\n" +
                "FILTER(regex(str(?expansão), \"Exp_Zendikar\")).\n" + 
                "?carta mtg:raridade ?raridade.\n" +
                "FILTER(regex(str(?raridade), \"Mitica\")).\n" +
                "?col mtg:tem_carta ?carta.\n" +
                "?carta mtg:cor ?cor.\n" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Raridade </th>\n" + "\t\t<th> Cor </th>\n" + "\t\t<th> Expansão </th>\n" + "\t</tr>"

            for(var i in resList){
                var carta = resList[i].carta.value
                var card = carta.slice(carta.indexOf('#')+1)
                var raridade = resList[i].raridade.value
                var rarity = raridade.slice(raridade.indexOf('#')+1)
                var cor = resList[i].cor.value
                var color = cor.slice(cor.indexOf('#')+1)
                var expansão = resList[i].expansão.value
                var expansion = expansão.slice(expansão.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + card + '</th>\n' + '\t\t<th>' + rarity + '</th>\n' +  '\t\t<th>' + color + '\t\t<th>' + expansion + '</th>\n' +'\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/10', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?carta ?baralho ?coleção ?cor\n" +
                "where{\n" +
                "?tourney mtg:torneio_permite_coleção ?coleção\n" +
                "FILTER(regex(str(?tourney), \"Torneio_Block\")).\n" + 
                "?baralho mtg:possui_carta ?carta.\n" +
                "FILTER(regex(str(?baralho), \"Baralho_Eduardo\")).\n" +
                "?carta mtg:cor ?cor.\n" +
                "}"

    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Baralho </th>\n" + "\t\t<th> Coleção </th>\n" + "\t\t<th> Cor </th>\n" + "\t</tr>"

            for(var i in resList){
                var carta = resList[i].carta.value
                var card = carta.slice(carta.indexOf('#')+1)
                var cor = resList[i].cor.value
                var color = cor.slice(cor.indexOf('#')+1)
                var baralho = resList[i].baralho.value
                var deck = baralho.slice(baralho.indexOf('#')+1)
                var coleção = resList[i].coleção.value
                var collection = coleção.slice(coleção.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + card + '</th>\n' + '\t\t<th>' +  deck + '</th>\n' + '\t\t<th>' + collection  +'</th>\n' + '\t\t<th>' + color + '</th>\n' +'\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

router.get('/11', (req, res, next)=>{
    var cid = req.params.id 
    var query = "select ?carta ?ataque ?defesa ?custo_de_Mana ?raridade\n" +
                "where{\n" +
                "?carta mtg:ataque ?ataque.\n" +
                "?carta mtg:defesa ?defesa.\n" + 
                "?carta mtg:custo_de_mana ?custo_de_Mana.\n" +
                "?carta mtg:raridade ?raridade.\n" +
                "?carta mtg:cor ?cor.\n" +
                "}\n" + 
                "order by DESC(?ataque)"
                
    client.query(query)
        .execute()
        .then(function(qres){
            var resList = qres.results.bindings
            var dot = "<table style=\"width:50%\">\n" + "\t<tr>\n" + "\t\t<th> Carta </th>\n" + "\t\t<th> Ataque </th>\n" + "\t\t<th> Defesa </th>\n" + "\t\t<th> Custo de Mana </th>\n" + "\t\t<th> Raridade </th>\n" + "\t</tr>"

            for(var i in resList){
                var carta = resList[i].carta.value
                var card = carta.slice(carta.indexOf('#')+1)
                var raridade = resList[i].raridade.value
                var rarity = raridade.slice(raridade.indexOf('#')+1)
                var ataque = resList[i].ataque.value
                var attack = ataque.slice(ataque.indexOf('#')+1)
                var defesa = resList[i].defesa.value
                var defense = defesa.slice(defesa.indexOf('#')+1)
                var custo_de_Mana = resList[i].custo_de_Mana.value
                var mana_cost = custo_de_Mana.slice(custo_de_Mana.indexOf('#')+1)
    
                dot += '\t<tr>\n' + '\t\t<th>' + card + '</th>\n' + '\t\t<th>' + attack + '</th>\n' + '\t\t<th>' + defense + '</th>\n' + '\t\t<th>' + mana_cost + '</th>\n' + '\t\t<th>' + rarity + '</th>\n' + '\t</tr>'
            }
                dot += "</table>"      
            res.render("result", {renderingCode: dot})
        })
        .catch((error)=>{
            res.render("error", {error:error})
        })
})

module.exports = router;