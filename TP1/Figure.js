const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / (window.innerHeight-250), 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight-250);
document.body.appendChild( renderer.domElement ); //création de la scène 

const material = new THREE.PointsMaterial({ //définition taille et couleurs des points
    size: 0.05,
    color: 0x7CFC00
});

const points = []; // tableau de points

let button_reset=document.getElementById("reset");
button_reset.addEventListener("click",reset);


let button_valider = document.getElementById("valider");
button_valider.addEventListener("click", calculate);

let cercle=document.getElementById("cercle");
let coeur=document.getElementById("coeur");

cercle.addEventListener("click",drawCircle);
coeur.addEventListener("click",drawHeart);

/**
 * Réinitialise le canvas
 */
function reset(){
    document.location.reload(true);
}

/**
 * Dessine un cercle avec l'équation paramétrique de l'exercice
 */
function drawCircle(){
    let coordX=document.getElementById("X");
    coordX.setAttribute('value',"2*cos(t)");
    let coordY=document.getElementById("Y");
    coordY.setAttribute('value',"2*sin(t)");
    calculate();
}

/**
 * Dessine un coeur avec l'équation paramétrique de l'exercice
 */
function drawHeart(){
    let coord2X=document.getElementById("X");
    coord2X.setAttribute('value',"pow(sin(t), 3)");
    let coord2Y=document.getElementById("Y");
    coord2Y.setAttribute('value',"cos(t)-pow(cos(t),4)"); 
    calculate();
}

/**
 * Récupère les équations, calcule la courbe et affiche le rendu
 */
function calculate(){

    let x,y,X = document.getElementById("X"),Y = document.getElementById("Y");
    x = transformString(X.value);
    y = transformString(Y.value);

    for(let t = 0; t < 2*Math.PI; t+=0.001){    // Calcul de tous les points de la courbe
        points.push( new THREE.Vector3( evaluate(t,x), evaluate(t,y), 0 ) );
    }
    
    afficher();
}

/**
 * Affiche les points de la courbe paramétrique
 */
function afficher(){
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const figure = new THREE.Points( geometry, material );
    scene.add( figure ); // on ajoute à la scène tous les points
    
    camera.position.z = 5;
    renderer.render( scene, camera );
}

/**
 * Modifie une équation pour qu'elle soit lisible lors de l'évaluation. Elle ajoute la syntaxe de Math.js
 * @param {string} str 
 * @returns {string}
 */
function transformString(str){
    let tab = str.split("tan");
    str = tab.join("Math.tan");
    tab = str.split("cos");
    str = tab.join("Math.cos");
    tab = str.split("sin");
    str = tab.join("Math.sin");
    tab = str.split("pi");
    str = tab.join("Math.PI");
    tab = str.split("sqrt");
    str = tab.join("Math.sqrt");
    tab = str.split("pow");
    str = tab.join("Math.pow");
    tab = str.split("exp");
    str = tab.join("Math.exp");
    tab = str.split("ln");
    str = tab.join("Math.log");
    return str;
}

/**
 * Evalue une équation pour un t donné
 * @param {float} t 
 * @param {string} str 
 * @returns {float}
 */
function evaluate(t, str){
    let tab = str.split("*t");
    str = tab.join("*"+t);
    tab = str.split("+t");
    str = tab.join("+"+t);
    tab = str.split("-t");
    str = tab.join("-"+t);
    tab = str.split("/t");
    str = tab.join("/"+t);
    tab = str.split("(t");
    str = tab.join("("+t);
    tab = str.split(",t");
    str = tab.join(","+t);
    if(str[0] == 't'){
        tab = str.split("t");
        tab.shift();
        str = t + tab.join('t');
    }
    return eval(str);
}