/**
sc frontend/cliente
sw worker 
**/

const zmq = require('zeromq')
let workers=[]
let sc = zmq.socket('router') // frotend
let sw = zmq.socket('router') // backend

sc.bindSync('tcp://*:8000');
sw.bindSync('tcp://*:8000');

sc.on('message', function() {
	var args = Array.apply(null, arguments);
	sw.send(args);
});



if (/*pasa algo malo*/){
	sc.close();
	sw.exit(0);
}

numWorkers = 0 
aux = 0
       

//relacion broker-frontend
sc.on('message', function(){ 
    //CASO: no hay workers dados de alta
    var args = Array.apply(null, arguments); 
    if(workers.length == 0){ 
            sc.send([args[0],"",'ERROR']); 
    } 
	//CASO: si hay workers dados de alta, hay worker available, 
    else{ 
        var availableW = false; 
        while(!availableW){ 
            if(aux == -1){ 
                aux = 0; 
                workers[aux+1] = 'ocupado'; 
                availableW = true; 
            } 
            else{ 
                if(aux+2 < workers.length){ 
                    aux = aux+2; 
                    if(workers[aux+1] != 'ocupado'){ 
                        workers[aux+1] = 'ocupado'; 
                    } 
                    availableW = true; 
                } 
                else{ 
                    aux = -1; 
                } 
            } 
        } 
        args.unshift(workers[aux],""); 
        sw.send([workers[aux],"",args]); 
    } 
}); 
      
//relación broker-worker
sw.on('message', function() { 
    var args = Array.apply(null, arguments); 
    //respuesta: eliminar cabecera y enviar el mensaje
    if(args[2]=='ready'){ 
        workers.push(args[0]); 
        workers.push(args[2]); 
    } 
    else{ 
        for(var i=0;i<workers.length-1;i=i+2){ 
            if(workers[i]==args[0]){ 
                workers[i+1]="Preparado"; 
                break; 
            } 
        } 
        
            
        } 
    } 
	//sw.send(args);
  
}); 
