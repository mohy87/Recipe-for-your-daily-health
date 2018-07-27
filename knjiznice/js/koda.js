
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}



function dodajMeritveTezeVisine() {
	sessionId = getSessionId();

	var ehrId = $("#dodajVitalnoEHR").val();
	var datum = $("#dodajVitalnoDatum").val();
	var telesnaVisina = $("#dodajVitalnoTelesnaVisina").val();
	var telesnaTeza = $("#dodajVitalnoTelesnaTeza").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#dodajMeritveTezeVisineSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		var podatki = {
			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
      // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
		    "ctx/language": "en",
		    "ctx/territory": "SI",
		    "ctx/time": datum,
		    "vital_signs/height_length/any_event/body_height_length": telesnaVisina,
		    "vital_signs/body_weight/any_event/body_weight": telesnaTeza,
		};
		var parametriZahteve = {
		    ehrId: ehrId,
		    templateId: 'Vital Signs',
		    format: 'FLAT',
		};
		$.ajax({
		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
		    type: 'POST',
		    contentType: 'application/json',
		    data: JSON.stringify(podatki),
		    success: function (res) {
		        $("#dodajMeritveTezeVisineSporocilo").html(
              "<span class='obvestilo label label-success fade-in'>" +
              res.meta.href + ".</span>");
		    },
		    error: function(err) {
		    	$("#dodajMeritveTezeVisineSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}




function klicGenerirajPodatke(){

	
	generirajPodatke(1);
	generirajPodatke(2);
	generirajPodatke(3);
}



/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(x) {
 var ehrId ="";
  var sessionId = getSessionId();
  $("#preberiEhrIdZaBMI").html("");
  $("#preberiObstojeciEHR").html("");
  $("#preberiObstojeciVitalniZnak").html("");

var tabela = [];
//tabela.push(0);
//tabela[1] = 1;
//tabela[2] = 2;
 
  if(x == 1) {
  var ime1 = "Anja";
  var priimek1 = "Kranjec";
  var rojstvo1 = '1996-10-30';
  var spol1 = "FEMALE";
  var id1 = 1;
  var meritve1 = [['2016-01-30', 160, 50], ['2016-02-14', 160, 45], ['2016-03-30', 160, 44], ['2016-04-30', 160, 42], ['2016-05-30', 160, 40], ['2016-06-30', 160, 39], ['2016-07-30', 160, 38], ['2016-08-30', 160, 38], ['2016-09-30', 160, 35]];
 // dodajPodatkeEHR(id1,ime1, priimek1,rojstvo1, spol1,meritve1);
 // $('#generiraniPodatki').append("</br>Anja Kranjec   "+ id1);
 
 $.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	
	
	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        id1=ehrId;
	        tabela[0] = id1;
	        //console.log(tabela[0]);
	        var partyData = {
	            firstNames: ime1,
	            lastNames: priimek1,
	            dateOfBirth: rojstvo1,
	            gender: spol1,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
                        $("#preberiEhrIdZaBMI").append("<option value=''></option><option value='" + id1 + "'>Anja Kranjec</option>");
                        
                        $("#preberiObstojeciEHR").append("<option value=''></option><option value='" + id1 + "'>Anja Kranjec</option>");
                        $("#preberiObstojeciVitalniZnak").append("<option value=''></option><option value='" + id1 + "|2018-05-08T11:40|160|35.0'>Anja Kranjec</option>");
                        $("#generiraniPodatki").append("<span> Anja Kranjec  " + id1 + "</span><br>");

                    	for (var i=0; i<9; i++) {
                    	    $.ajaxSetup({
                    		    headers: {"Ehr-Session": sessionId}
                    		});
                    		var podatki = {
                    			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
                          // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
                    		    "ctx/language": "en",
                    		    "ctx/territory": "SI",
                    		    "ctx/time": meritve1[i][0],
                    		    "vital_signs/height_length/any_event/body_height_length": meritve1[i][1],
                    		    "vital_signs/body_weight/any_event/body_weight": meritve1[i][2],
                    		};
                    		var parametriZahteve = {
                    		    ehrId: id1,
                    		    templateId: 'Vital Signs',
                    		    format: 'FLAT',
                    		    commiter: "user"
                    		};
                    		$.ajax({
                    		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
                    		    type: 'POST',
                    		    async: false,
                    		    contentType: 'application/json',
                    		    data: JSON.stringify(podatki),
                    		    success: function (res) {
                                    console.log("USPEŠNO"+ i);
                    		    },
                    		    error: function(err) {
                    		    	console.log("Napaka");
                    		    }
                    		});

                        }
	                }
	            },
	            error: function(err) {
	            	console.log("Napaka.");
	            }
	        });
	    }
	});
      
  }
  
  else if(x==2) {
  var ime2 = "Tomaž";
  var priimek2 = "Novak";
  var rojstvo2 = "1967-09-30";
  var spol2 = "MALE";
  var id2 = 2;
  var meritve2 = [['2016-01-30', 180, 85], ['2016-02-26', 180, 87], ['2016-03-30', 180, 89], ['2016-04-30', 180, 90], ['2016-05-30', 180, 93], ['2016-06-30', 180, 96], ['2016-07-30', 180, 100], ['2016-08-30', 180, 105], ['2016-09-30', 180, 110]];
  //dodajPodatkeEHR(id2,ime2, priimek2,rojstvo2, spol2,meritve2);
      
      
      $.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
      
    	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        id2=ehrId;
	        tabela[1] = id2;
	        var partyData = {
	            firstNames: ime2,
	            lastNames: priimek2,
	            dateOfBirth: rojstvo2,
	            gender: spol2,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
	                   $("#preberiEhrIdZaBMI").append("<option value='" + id2 + "'>Tomaž Novak</option>");
	                   $("#preberiObstojeciEHR").append("<option value='" + id2 + "'>Tomaž Novak</option>");
                       $("#preberiObstojeciVitalniZnak").append("<option value='" + id2 + "|2018-05-08T11:40|180|110.0'>Tomaž Novak</option>");
                       $("#generiraniPodatki").append("<span> Tomaž Novak  " + id2 + "</span><br>");
	                   for (var i=0; i<9; i++) {
                    	    $.ajaxSetup({
                    		    headers: {"Ehr-Session": sessionId}
                    		});
                    		var podatki = {
                    			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
                          // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
                    		    "ctx/language": "en",
                    		    "ctx/territory": "SI",
                    		    "ctx/time": meritve2[i][0],
                    		    "vital_signs/height_length/any_event/body_height_length": meritve2[i][1],
                    		    "vital_signs/body_weight/any_event/body_weight": meritve2[i][2],
                    		};
                    		var parametriZahteve = {
                    		    ehrId: id2,
                    		    templateId: 'Vital Signs',
                    		    format: 'FLAT',
                    		};
                    		$.ajax({
                    		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
                    		    type: 'POST',
                    		    async: false,
                    		    contentType: 'application/json',
                    		    data: JSON.stringify(podatki),
                    		    success: function (res) {
                    		        console.log("USPEŠNO"+ i);
                    		    },
                    		    error: function(err) {
                    		    	console.log("Napaka");
                    		    }
                    		});

                        }

	                }
	            },
	            error: function(err) {
	            	console.log("Napaka.");
	            }
	        });
	    }
	});  
  }
  
  else if(x == 3) {
  var ime3 = "Eva";
  var priimek3 = "Jamšek";
  var rojstvo3 = "1981-09-30";
  var spol3 ="FEMALE";
  var id3 = 3;
  
  var meritve3 = [['2016-01-30', 170, 55], ['2016-02-24', 170, 56], ['2016-03-30', 170, 57], ['2016-04-30', 170, 54], ['2016-05-30', 170, 55], ['2016-06-30', 170, 56], ['2016-07-30', 170, 55], ['2016-08-30', 170, 54], ['2016-09-30', 170, 55]];
  
      //dodajPodatkeEHR(id3,ime3, priimek3,rojstvo3, spol3,meritve3);
  
    
    
    
    
    $.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});

    


	$.ajax({
	    url: baseUrl + "/ehr",
	    type: 'POST',
	    success: function (data) {
	        var ehrId = data.ehrId;
	        id3=ehrId;
	        tabela[2] = id3;
	        var partyData = {
	            firstNames: ime3,
	            lastNames: priimek3,
	            dateOfBirth: rojstvo3,
	            gender: spol3,
	            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
	        };
	        $.ajax({
	            url: baseUrl + "/demographics/party",
	            type: 'POST',
	            contentType: 'application/json',
	            data: JSON.stringify(partyData),
	            success: function (party) {
	                if (party.action == 'CREATE') {
                	   $("#preberiEhrIdZaBMI").append("<option value='" + id3 + "'>Sosedova Micka</option>");
                	   $("#preberiObstojeciEHR").append("<option value='" + id3 + "'>Sosedova Micka</option>");
                       $("#preberiObstojeciVitalniZnak").append("<option value='" + id3 + "|2018-05-08T11:40|170|55.0'>Sosedova Micka</option>");
                       $("#generiraniPodatki").append("<span>Sosedova Micka  " + id3 + "</span><br>");
                	   for (var i=0; i<9; i++) {
                    	    $.ajaxSetup({
                    		    headers: {"Ehr-Session": sessionId}
                    		});
                    		var podatki = {
                    			// Struktura predloge je na voljo na naslednjem spletnem naslovu:
                          // https://rest.ehrscape.com/rest/v1/template/Vital%20Signs/example
                    		    "ctx/language": "en",
                    		    "ctx/territory": "SI",
                    		    "ctx/time": meritve3[i][0],
                    		    "vital_signs/height_length/any_event/body_height_length": meritve3[i][1],
                    		    "vital_signs/body_weight/any_event/body_weight": meritve3[i][2],
                    		};
                    		var parametriZahteve = {
                    		    ehrId: id3,
                    		    templateId: 'Vital Signs',
                    		    format: 'FLAT',
                    		};
                    		$.ajax({
                    		    url: baseUrl + "/composition?" + $.param(parametriZahteve),
                    		    type: 'POST',
                    		    async: false,
                    		    contentType: 'application/json',
                    		    data: JSON.stringify(podatki),
                    		    success: function (res) {
                    		        console.log("USPEŠNO"+ i);
                    		    },
                    		    error: function(err) {
                    		    	console.log("Napaka");
                    		    }
                    		});

                        }
	                }
	            },
	            error: function(err) {
	            	console.log("Napaka.");
	            }
	        });
	    }
	});
}

return ehrId;
}

//kreiraj EHR id
kreirajEHRzaBolnika = function() {
	sessionId = getSessionId();

	var ime = $("#kreirajIme").val();
	var priimek = $("#kreirajPriimek").val();
	var datumRojstva = $("#kreirajDatumRojstva").val();
	var spol = $("#kreirajSpol").val();

	if (!ime || !priimek || !datumRojstva || !spol || ime.trim().length == 0 ||
      priimek.trim().length == 0 || datumRojstva.trim().length == 0 || spol.trim().length ==0) {
		$("#kreirajSporocilo").html("<span class='obvestilo label " +
      "label-warning fade-in'>Prosim vnesite zahtevane podatke!</span>");
	} else {
		$.ajaxSetup({
		    headers: {"Ehr-Session": sessionId}
		});
		$.ajax({
		    url: baseUrl + "/ehr",
		    type: 'POST',
		    success: function (data) {
		        var ehrId = data.ehrId;
		        var partyData = {
		            firstNames: ime,
		            lastNames: priimek,
		            dateOfBirth: datumRojstva,
		            gender: spol,
		            partyAdditionalInfo: [{key: "ehrId", value: ehrId}]
		        };
		        $.ajax({
		            url: baseUrl + "/demographics/party",
		            type: 'POST',
		            contentType: 'application/json',
		            data: JSON.stringify(partyData),
		            success: function (party) {
		                if (party.action == 'CREATE') {
		                    $("#kreirajSporocilo").html("<span class='obvestilo " +
                          "label label-success fade-in'>Uspešno kreiran EHR '" +
                          ehrId + "'.</span>");
		                    $("#preberiEHRid").val(ehrId);
		                }
		            },
		            error: function(err) {
		            	$("#kreirajSporocilo").html("<span class='obvestilo label " +
                    "label-danger fade-in'>Napaka '" +
                    JSON.parse(err.responseText).userMessage + "'!");
		            }
		        });
		    }
		});
	}
}




function BMI(teza, visina) {
    return Math.round(teza / ((visina/100) * (visina/100)));
}



function preberiIndekseTelesneMase() {
	sessionId = getSessionId();

	var ehrId = $("#meritveVitalnihZnakovEHRid").val();
	$("#fillgauge1").html("");


	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiIndekseTelesneMaseSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#rezultatIndeksovTelesneMase").html("<br/><span>Pridobivanje " +
          "podatkov za <b>'" + party.firstNames +
          " " + party.lastNames + "'</b>.</span><br/><br/>");
				
					$.ajax({
					    url: baseUrl + "/view/" + ehrId + "/" + "weight",
					    type: 'GET',
					    headers: {"Ehr-Session": sessionId},
					    success: function (res) {
					    	if (res.length > 0) {
					    	    
						    	$.ajax({
						    	    url: baseUrl + "/view/" + ehrId + "/height",
						    	    type: 'GET',
						    	    headers: {"Ehr-Session": sessionId},
						    	    success: function(podatek) {
						    	        if (podatek.length > 0) {
						    	            var results = "<table class='table table-inverse" +
                                                "table-hover'><tr><th>Indeks</th><th>Datum</th>" +
                                                "<th class='text-center'>BMI</th><th class=text-right>Več</th></tr>";
                                			for (var i in res) {
                                			    var bmi = BMI(res[i].weight, podatek[i].height);
                                				results += "<tr><td>" + i + "</td><td>" + res[i].time +
                                                "</td><td class='text-center'>" + bmi + "</td>" +
                                                "<td><button type='button' id='b" + i + "' class='btn btn-default btn-xs pull-right' onclick=preberiDetajle(" + i + ") ><span class='glyphicon glyphicon-chevron-down'></span></button></td></tr>" +
                                                "<tr id=" + i + "></tr>";
                                                if (i==0) {
                                                    if (bmi < 19) {
                                                        $("#rezultatGraf").html("<div class='alert alert-danger' style='padding: 10px;'><p class='text-center'>Zadnji izmerjeni BMI je premajhen.</p></div>");
                                                    } else if (bmi > 25) {
                                                        $("#rezultatGraf").html("<div class='alert alert-danger' style='padding: 10px;'><p class='text-center'>Zadnji izmerjeni BMI je prevelik.</p></div>");
                                                    }
                                                    else {
                                                        $("#rezultatGraf").html("<div class='alert alert-success' style='padding: 10px;'><p class='text-center'>Zadnji izmerjeni BMI je v meji normale.</p></div>");
                                                    }
                                                    var gauge1 = loadLiquidFillGauge("fillgauge1", bmi);
                 
            
                                                    
                                                    
                                                }


                                			}
                                			results += "</table>";
                                			$("#rezultatIndeksovTelesneMase").append(results);

						    	        }
						    	        else {
                                			$("#preberiIndekseTelesneMaseSporocilo").html(
                                                "<span class='obvestilo label label-warning fade-in'>" +
                                                "Ni podatkov!</span>");
                                		}
						    	        
						    	    },
						    	    
						    	    error: function() {
                				    	$("#preberiIndekseTelesneMaseSporocilo").html(
                                        "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                                        JSON.parse(err.responseText).userMessage + "'!");
                				    }
						    	    
						    	    
						    	})
					    	}
					    },
					    error: function() {
					    	$("#preberiIndekseTelesneMaseSporocilo").html(
                  "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                  JSON.parse(err.responseText).userMessage + "'!");
					    }
					});
				
	    	},
	    	error: function(err) {
	    		$("#preberiIndekseTelesneMaseSporocilo").html(
            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
            JSON.parse(err.responseText).userMessage + "'!");
	    	}
		});
	}
}


pocistiDetajle = function(i) {
    $("#" + i).html("");
    //$("#b" + i).onclick = preberiDetajle(i); 
    $("#b" + i).attr("onclick","preberiDetajle(" + i + ")");
}


preberiDetajle = function(i) {
    sessionId = getSessionId();

	var ehrId = $("#meritveVitalnihZnakovEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiIndekseTelesneMaseSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
	    $.ajax({
		    url: baseUrl + "/view/" + ehrId + "/" + "weight",
		    type: 'GET',
		    headers: {"Ehr-Session": sessionId},
		    success: function (res) {
		    	if (res.length > 0) {
		    	    
			    	$.ajax({
			    	    url: baseUrl + "/view/" + ehrId + "/height",
			    	    type: 'GET',
			    	    headers: {"Ehr-Session": sessionId},
			    	    success: function(podatek) {
			    	        if (podatek.length > 0) {
			    	            
			    	            $("#" + i).html("<td colspan='2'><small>Telesna višina: " + podatek[i].height + " cm</small></td><td colspan='2'><small>Telesna teža: " + res[i].weight + " kg</small></td>")
                    			//$("#b" + i).onclick = pocistiDetajle(i);
                    			$("#b" + i).attr("onclick","pocistiDetajle(" + i + ")");
			    	        }
			    	        else {
                    			$("#preberiIndekseTelesneMaseSporocilo").html(
                                    "<span class='obvestilo label label-warning fade-in'>" +
                                    "Ni podatkov!</span>");
                    		}
			    	        
			    	    },
			    	    
			    	    error: function() {
    				    	$("#preberiIndekseTelesneMaseSporocilo").html(
                            "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                            JSON.parse(err.responseText).userMessage + "'!");
    				    }
			    	    
			    	    
			    	})
		    	}
		    },
		    error: function() {
		    	$("#preberiIndekseTelesneMaseSporocilo").html(
                 "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                 JSON.parse(err.responseText).userMessage + "'!");
		    }
		});
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


priporociRecept = function() {
    sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiIndekseTelesneMaseSporocilo").html("<span class='obvestilo " +
      "label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
	    $.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
	    	type: 'GET',
	    	headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
        	    $.ajax({
        		    url: baseUrl + "/view/" + ehrId + "/" + "weight",
        		    type: 'GET',
        		    headers: {"Ehr-Session": sessionId},
        		    success: function (res) {
        		    	if (res.length > 0) {
        		    	    
        			    	$.ajax({
        			    	    url: baseUrl + "/view/" + ehrId + "/height",
        			    	    type: 'GET',
        			    	    headers: {"Ehr-Session": sessionId},
        			    	    success: function(podatek) {
        			    	        if (podatek.length > 0) {
        			    	            var bmi = BMI(res[0].weight, podatek[0].height);
        			    	            var url = "";
        			    	            $("#rezultatBMI").html("<br/><span>Zadnji izmerjeni BMI osebe <b>'" + data.party.firstNames + " " + data.party.lastNames + "</b>' je enak <b>" + bmi + "</b>.</span><br/><br/>")
        			    	            if (bmi<19) {
        			    	                url = 'https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?callback=jQuery223081241134015019_1495894576191&q=chocolate&key=8d76f6dba621aad878166eff654c9af2&_=1495894576192'
        			    	            } else if (bmi<25) {
        			    	                url = 'https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?callback=jQuery223081241134015019_1495894576191&q=chicken&key=8d76f6dba621aad878166eff654c9af2&_=1495894576192'
        			    	            } else {
        			    	                url = 'https://cors-anywhere.herokuapp.com/http://food2fork.com/api/search?callback=jQuery223081241134015019_1495894576191&q=salad&key=8d76f6dba621aad878166eff654c9af2&_=1495894576192'
        			    	            }
        			    	            var xhttp = new XMLHttpRequest();
                                        xhttp.onreadystatechange = function() {
                                            if (this.readyState == 4 && this.status == 200) {
                                                var data = JSON.parse(this.responseText);
                                                var ind = getRandomInt(0, data.count);
                                                $("#rezultatRecept").html("");
                                                var result = "<img class='img-rounded img-responsive' style='padding:25px;' src='" + data.recipes[ind].image_url + "'><br><h3>" + data.recipes[ind].title + "</h3><br><p>Recept je dostopen na sledeči povezavi: <a href='" + data.recipes[ind].f2f_url + "'>" + data.recipes[ind].f2f_url + "</a>";

                                    
                                              $("#rezultatRecept").append(result);
                                            }
                                          };
                                          xhttp.open("GET", url, true);
                                          xhttp.send();
        			    	            
        			    	        }
        			    	        else {
                            			$("#preberiIndekseTelesneMaseSporocilo").html(
                                            "<span class='obvestilo label label-warning fade-in'>" +
                                            "Ni podatkov!</span>");
                            		}
        			    	        
        			    	    },
        			    	    
        			    	    error: function() {
            				    	$("#preberiIndekseTelesneMaseSporocilo").html(
                                    "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                                    JSON.parse(err.responseText).userMessage + "'!");
            				    }
        			    	    
        			    	    
        			    	})
        		    	}
        		    },
        		    error: function() {
        		    	$("#preberiIndekseTelesneMaseSporocilo").html(
                         "<span class='obvestilo label label-danger fade-in'>Napaka '" +
                         JSON.parse(err.responseText).userMessage + "'!");
        		    }
        		});
	    	}
	    });
	}
    
}


$(document).ready(function() {

  $('#preberiPredlogoBolnika').change(function() {
    $("#kreirajSporocilo").html("");
    var podatki = $(this).val().split(",");
    $("#kreirajIme").val(podatki[0]);
    $("#kreirajPriimek").val(podatki[1]);
    $("#kreirajDatumRojstva").val(podatki[2]);
    $("#kreirajSpol").val(podatki[3]);
  });
  
  $('#preberiObstojeciVitalniZnak').change(function() {
	$("#dodajMeritveTezeVisineSporocilo").html("");
	var podatki = $(this).val().split("|");
	$("#dodajVitalnoEHR").val(podatki[0]);
	$("#dodajVitalnoDatum").val(podatki[1]);
	$("#dodajVitalnoTelesnaVisina").val(podatki[2]);
	$("#dodajVitalnoTelesnaTeza").val(podatki[3]);
    });
    
    $('#preberiEhrIdZaBMI').change(function() {
		$("#preberiIndekseTelesneMaseSporocilo").html("");
		$("#rezultatIndeksovTelesneMase").html("");
		$("#rezultatGraf").html("");
		$("#fillgauge1").html("");
		$("#meritveVitalnihZnakovEHRid").val($(this).val());
	});
	
	$('#preberiObstojeciEHR').change(function() {
		$("#priporociReceptSporocilo").html("");
		$("#preberiEHRid").val($(this).val());
	});
});


function liquidFillGaugeDefaultSettings(bmi){
    var color;
    if (bmi>25 || bmi<19) {
        color = '#ff3232';
    }
    else if (bmi<=25 && bmi>=19) {
        color = "#006600";
    }
    return {
        minValue: 0, // The gauge minimum value.
        maxValue: 50, // The gauge maximum value.
        circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
        circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
        circleColor: color, // The color of the outer circle.
        waveHeight: 0.05, // The wave height as a percentage of the radius of the wave circle.
        waveCount: 1, // The number of full waves per width of the wave circle.
        waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
        waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
        waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
        waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
        waveAnimate: true, // Controls if the wave scrolls or is static.
        waveColor: color, // The color of the fill wave.
        waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
        textVertPosition: .5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
        textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
        valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
        displayPercent: false, // If true, a % symbol is displayed after the value.
        textColor: color, // The color of the value text when the wave does not overlap it.
        waveTextColor: "#A4DBf8" // The color of the value text when the wave overlaps it.
    };
}


function loadLiquidFillGauge(elementId, value, config) {
    if(config == null) config = liquidFillGaugeDefaultSettings(value);

    var gauge = d3.select("#" + elementId);
    var radius = Math.min(parseInt(gauge.style("width")), parseInt(gauge.style("height")))/2;
    var locationX = parseInt(gauge.style("width"))/2 - radius;
    var locationY = parseInt(gauge.style("height"))/2 - radius;
    var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;

    var waveHeightScale;
    if(config.waveHeightScaling){
        waveHeightScale = d3.scale.linear()
            .range([0,config.waveHeight,0])
            .domain([0,50,100]);
    } else {
        waveHeightScale = d3.scale.linear()
            .range([config.waveHeight,config.waveHeight])
            .domain([0,100]);
    }

    var textPixels = (config.textSize*radius/2);
    var textFinalValue = parseFloat(value).toFixed(2);
    var textStartValue = config.valueCountUp?config.minValue:textFinalValue;
    var percentText = config.displayPercent?"%":"";
    var circleThickness = config.circleThickness * radius;
    var circleFillGap = config.circleFillGap * radius;
    var fillCircleMargin = circleThickness + circleFillGap;
    var fillCircleRadius = radius - fillCircleMargin;
    var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);

    var waveLength = fillCircleRadius*2/config.waveCount;
    var waveClipCount = 1+config.waveCount;
    var waveClipWidth = waveLength*waveClipCount;

    // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
    var textRounder = function(value){ return Math.round(value); };
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(1); };
    }
    if(parseFloat(textFinalValue) != parseFloat(textRounder(textFinalValue))){
        textRounder = function(value){ return parseFloat(value).toFixed(2); };
    }

    // Data for building the clip wave area.
    var data = [];
    for(var i = 0; i <= 40*waveClipCount; i++){
        data.push({x: i/(40*waveClipCount), y: (i/(40))});
    }

    // Scales for drawing the outer circle.
    var gaugeCircleX = d3.scale.linear().range([0,2*Math.PI]).domain([0,1]);
    var gaugeCircleY = d3.scale.linear().range([0,radius]).domain([0,radius]);

    // Scales for controlling the size of the clipping path.
    var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
    var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);

    // Scales for controlling the position of the clipping path.
    var waveRiseScale = d3.scale.linear()
        // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
        // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
        // circle at 100%.
        .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
        .domain([0,1]);
    var waveAnimateScale = d3.scale.linear()
        .range([0, waveClipWidth-fillCircleRadius*2]) // Push the clip area one full wave then snap back.
        .domain([0,1]);

    // Scale for controlling the position of the text within the gauge.
    var textRiseScaleY = d3.scale.linear()
        .range([fillCircleMargin+fillCircleRadius*2,(fillCircleMargin+textPixels*0.7)])
        .domain([0,1]);

    // Center the gauge within the parent SVG.
    var gaugeGroup = gauge.append("g")
        .attr('transform','translate('+locationX+','+locationY+')');

    // Draw the outer circle.
    var gaugeCircleArc = d3.svg.arc()
        .startAngle(gaugeCircleX(0))
        .endAngle(gaugeCircleX(1))
        .outerRadius(gaugeCircleY(radius))
        .innerRadius(gaugeCircleY(radius-circleThickness));
    gaugeGroup.append("path")
        .attr("d", gaugeCircleArc)
        .style("fill", config.circleColor)
        .attr('transform','translate('+radius+','+radius+')');

    // Text where the wave does not overlap.
    var text1 = gaugeGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.textColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // The clipping wave area.
    var clipArea = d3.svg.area()
        .x(function(d) { return waveScaleX(d.x); } )
        .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
        .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
    var waveGroup = gaugeGroup.append("defs")
        .append("clipPath")
        .attr("id", "clipWave" + elementId);
    var wave = waveGroup.append("path")
        .datum(data)
        .attr("d", clipArea)
        .attr("T", 0);

    // The inner circle with the clipping wave attached.
    var fillCircleGroup = gaugeGroup.append("g")
        .attr("clip-path", "url(#clipWave" + elementId + ")");
    fillCircleGroup.append("circle")
        .attr("cx", radius)
        .attr("cy", radius)
        .attr("r", fillCircleRadius)
        .style("fill", config.waveColor);

    // Text where the wave does overlap.
    var text2 = fillCircleGroup.append("text")
        .text(textRounder(textStartValue) + percentText)
        .attr("class", "liquidFillGaugeText")
        .attr("text-anchor", "middle")
        .attr("font-size", textPixels + "px")
        .style("fill", config.waveTextColor)
        .attr('transform','translate('+radius+','+textRiseScaleY(config.textVertPosition)+')');

    // Make the value count up.
    if(config.valueCountUp){
        var textTween = function(){
            var i = d3.interpolate(this.textContent, textFinalValue);
            return function(t) { this.textContent = textRounder(i(t)) + percentText; }
        };
        text1.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
        text2.transition()
            .duration(config.waveRiseTime)
            .tween("text", textTween);
    }

    // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
    var waveGroupXPosition = fillCircleMargin+fillCircleRadius*2-waveClipWidth;
    if(config.waveRise){
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(0)+')')
            .transition()
            .duration(config.waveRiseTime)
            .attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')')
            .each("start", function(){ wave.attr('transform','translate(1,0)'); }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
    } else {
        waveGroup.attr('transform','translate('+waveGroupXPosition+','+waveRiseScale(fillPercent)+')');
    }

    if(config.waveAnimate) animateWave();
    
    function animateWave() {
        wave.attr('transform','translate('+waveAnimateScale(wave.attr('T'))+',0)');
        wave.transition()
            .duration(config.waveAnimateTime * (1-wave.attr('T')))
            .ease('linear')
            .attr('transform','translate('+waveAnimateScale(1)+',0)')
            .attr('T', 1)
            .each('end', function(){
                wave.attr('T', 0);
                animateWave(config.waveAnimateTime);
            });
    }
    
    function GaugeUpdater(){
        this.update = function(value){
            var newFinalValue = parseFloat(value).toFixed(2);
            var textRounderUpdater = function(value){ return Math.round(value); };
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(1); };
            }
            if(parseFloat(newFinalValue) != parseFloat(textRounderUpdater(newFinalValue))){
                textRounderUpdater = function(value){ return parseFloat(value).toFixed(2); };
            }

            var textTween = function(){
                var i = d3.interpolate(this.textContent, parseFloat(value).toFixed(2));
                return function(t) { this.textContent = textRounderUpdater(i(t)) + percentText; }
            };

            text1.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);
            text2.transition()
                .duration(config.waveRiseTime)
                .tween("text", textTween);

            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value))/config.maxValue;
            var waveHeight = fillCircleRadius*waveHeightScale(fillPercent*100);
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin+fillCircleRadius*2+waveHeight),(fillCircleMargin-waveHeight)])
                .domain([0,1]);
            var newHeight = waveRiseScale(fillPercent);
            var waveScaleX = d3.scale.linear().range([0,waveClipWidth]).domain([0,1]);
            var waveScaleY = d3.scale.linear().range([0,waveHeight]).domain([0,1]);
            var newClipArea;
            if(config.waveHeightScaling){
                newClipArea = d3.svg.area()
                    .x(function(d) { return waveScaleX(d.x); } )
                    .y0(function(d) { return waveScaleY(Math.sin(Math.PI*2*config.waveOffset*-1 + Math.PI*2*(1-config.waveCount) + d.y*2*Math.PI));} )
                    .y1(function(d) { return (fillCircleRadius*2 + waveHeight); } );
            } else {
                newClipArea = clipArea;
            }

            var newWavePosition = config.waveAnimate?waveAnimateScale(1):0;
            wave.transition()
                .duration(0)
                .transition()
                .duration(config.waveAnimate?(config.waveAnimateTime * (1-wave.attr('T'))):(config.waveRiseTime))
                .ease('linear')
                .attr('d', newClipArea)
                .attr('transform','translate('+newWavePosition+',0)')
                .attr('T','1')
                .each("end", function(){
                    if(config.waveAnimate){
                        wave.attr('transform','translate('+waveAnimateScale(0)+',0)');
                        animateWave(config.waveAnimateTime);
                    }
                });
            waveGroup.transition()
                .duration(config.waveRiseTime)
                .attr('transform','translate('+waveGroupXPosition+','+newHeight+')')
        }
    }

    return new GaugeUpdater();
}