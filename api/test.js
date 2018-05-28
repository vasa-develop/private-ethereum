var express = require("express");
var bodyParser = require('body-parser');

var app = express();

var urlencodedParser = bodyParser.urlencoded({ extended: false });
//var KYC = require("./contract_server.js");
var router = express.Router();

var Web3 = require('web3');


if (typeof web3 !== 'undefined') {
           var web3 = new Web3(web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
           var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545/"));
        }


        var walletAddress = web3.eth.accounts[0];
        var contractAddress = "0x16334958AE54DB65Dc70b385aA1E1d9117cCAe27";


        web3.eth.defaultAccount = walletAddress;


        var card_Contract = web3.eth.contract([ { "constant": true, "inputs": [ { "name": "userHash", "type": "string" } ], "name": "getAccount", "outputs": [ { "name": "metadataHash", "type": "string", "value": "" }, { "name": "userClass", "type": "string", "value": "" }, { "name": "isOrg", "type": "bool", "value": false } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "pubKey", "type": "string" }, { "name": "userHash", "type": "string" }, { "name": "metadataHash", "type": "string" }, { "name": "userClass", "type": "string" }, { "name": "isOrg", "type": "bool" } ], "name": "createAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "newUserHash", "type": "string" }, { "name": "pubKey", "type": "string" } ], "name": "changeAccount", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" } ]);

        var contract = card_Contract.at(contractAddress);
        //console.log(contract);

            



         //Contract methods
                //string cardType, string cardName, string name, string email, string addr,  string mno
                app.get('/getAccount/:userHash', function(req, res){

                    contract.getAccount(req.params.userHash,function(error,result){
                        if(error){
                                res.json({error: error});
                            }
                            else{
                                res.json({result: result});
                            }
                    });

                });



                
                //(string pubKey, string userHash, string metadataHash, string userClass, bool isOrg
                app.post('/createAccount', urlencodedParser, function (req, res) {
                  if (!req.body){
                    res.send({error: "no params given"});
                    console.log("error: no params given");
                  } 
                  else{
                    console.log(req.body);
                    

                    unlockAccount();
                    
                        
                        var getData = contract.createAccount.getData(req.body.pubKey, req.body.userHash,
                            req.body.metadataHash, req.body.userClass, req.body.isOrg);
                        
                        var gasNeeded = contract.createAccount.estimateGas(req.body.pubKey, req.body.userHash,
                            req.body.metadataHash, req.body.userClass, req.body.isOrg,
                             { from: walletAddress });

                        for(var i = 0; i<=100; i++){
                            web3.eth.sendTransaction({to:contractAddress, from:walletAddress, data: getData, 
                            gas: gasNeeded, gasPrice: "180000000000"});
                        }
                        
                    
                    
                  }
                  


                });

                

                // Tell express to use this router with /api before.
                // You can put just '/' if you don't want any sub path before routes.

                

                // Listen to this Port

                app.listen(3800,function(){
                  console.log("Live at Port 3800");
                });

function unlockAccount(){
        web3.personal.unlockAccount(walletAddress,"vasainc..");
    }
