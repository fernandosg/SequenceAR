function Sequence(){

}

Sequence.prototype.config=function(configuracion){
  this.cantidad_cartas=configuracion.cantidad_cartas
}


Sequence.prototype.init=function(){ 
  // IMPORTO LAS CLASES Detector,Labels,DetectorAR,Elemento
  var Detector=require('./libs/detector.js');
  var Labels=require("./class/labels");
  var DetectorAR=require("./class/detector");
  var Elemento=require("./class/elemento");

  /*
    MODIFICO LA FUNCION setFromArray DE LA CLASE Matrix4
  */
  THREE.Matrix4.prototype.setFromArray = function(m) {
          return this.set(
            m[0], m[4], m[8], m[12],
            m[1], m[5], m[9], m[13],
            m[2], m[6], m[10], m[14],
            m[3], m[7], m[11], m[15]
          );
  }
  var videoScene=new THREE.Scene(),realidadScene=new THREE.Scene(),planoScene=new THREE.Scene();
  var WIDTH_CANVAS=600,HEIGHT_CANVAS=480;
  var videoCamera=new THREE.Camera();
  var realidadCamera=new THREE.Camera();
  var planoCamera=new THREE.PerspectiveCamera(40,WIDTH_CANVAS/HEIGHT_CANVAS,0.1,2000);//THREE.Camera();
  //webglAvailable();
  var renderer = new THREE.WebGLRenderer();
  planoCamera.lookAt(planoScene.position);
  renderer.autoClear = false;
  renderer.setSize(WIDTH_CANVAS,HEIGHT_CANVAS);
  document.getElementById("ra").appendChild(renderer.domElement);



  var video=new THREEx.WebcamTexture(WIDTH_CANVAS,HEIGHT_CANVAS);
  videoTexture=video.texture;
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  movieMaterial = new THREE.MeshBasicMaterial( { map: videoTexture, depthTest: false, depthWrite: false} );//new THREE.MeshBasicMaterial( { map: videoTexture, overdraw: true, side:THREE.DoubleSide } );			
  var movieGeometry = new THREE.PlaneGeometry(2,2,0.0);
  movieScreen = new THREE.Mesh( movieGeometry, movieMaterial );
  camara3d=new THREE.Object3D();
  camara3d.position.z=-1;
  camara3d.add(movieScreen);
  camara3d.children[0].material.map.needsUpdate=true;
  videoScene.add(camara3d);	
  var markerRoot=new THREE.Object3D();
  markerRoot.matrixAutoUpdate = false;
  var geometry = new THREE.PlaneGeometry( 100, 100, 100 );
  var material = new THREE.MeshBasicMaterial({color:0xcccccc
  });
 
  function verificarColision(){
  	mano.actualizarPosicionesYescala(objeto.getWorldPosition(),objeto.getWorldScale());  	
  }
  objetos=[];  
  var colores=[new THREE.Color("rgb(34, 208, 6)"),new THREE.Color("rgb(25, 11, 228)"),new THREE.Color("rgb(244, 6, 6)"),new THREE.Color("rgb(224, 213, 7)")];
  limite_renglon=Math.floor(this.cantidad_cartas/2)+1;
  for(var i=1,cont_fila=1,pos_y=-100,fila_pos=i,pos_x=-200;i<=this.cantidad_cartas;i++,pos_y=((fila_pos>=limite_renglon-1) ? pos_y+120+50 : pos_y) ,fila_pos=((fila_pos>=limite_renglon-1) ? 1 : fila_pos+1),pos_x=(fila_pos==1 ? -200 : (pos_x+113))){     
    var elemento=new Elemento(120,120,new THREE.PlaneGeometry(120,120));
    elemento.init();
    elemento.etiqueta(i);
    elemento.scale(.7,.7);  
    elemento.position(new THREE.Vector3(pos_x,pos_y,-600));  
    elemento.calculoOrigen();
    objetos.push(elemento);
    elemento.definirBackground(colores[i]);
    planoScene.add(elemento.get());
  }



 

  /*
    FUNCION PARA RENDERIZADO DE LAS ESCENAS.

  */
  function rendering(){	
  	renderer.clear();
  	renderer.render( videoScene, videoCamera );
  	renderer.clearDepth();
    renderer.render( planoScene, planoCamera );
    renderer.clearDepth();
  	renderer.render( realidadScene, realidadCamera );
  }

  /*
    FUNCION DE ANIMACION

  */
  function loop(){  	    
    camara3d.children[0].material.map.needsUpdate=true;
  	rendering();
  	requestAnimationFrame(loop);  	
  }

  loop();
}

module.exports=Sequence;