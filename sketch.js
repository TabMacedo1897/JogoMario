var mario, marioCorrendo, marioColidindo
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var chao, chaoInvisivel, imagemChao
var grupoTijolos, imagemTijolo;
var grupoObstaculo, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var imagemObstaculo;
var estrela, imagemEstrela, grupoEstrelas;
var gameOverImg, restartImg;
var score = 0;
var gameOver, restart;
var jumpSound, dieSound, checkPointSound;
var musicafundo;

function preload(){
  marioCorrendo = loadAnimation("mario1.png", "mario2.png")
  marioColidindo = loadAnimation("collided.png")
  imagemChao = loadImage("ground2.png");
  
  imagemTijolo = loadImage("brick.png");
  
  imagemObstaculo = loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  imagemEstrela = loadImage("estrela.png")
  musicafundo = loadSound("somfundo.mp3")
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}
function setup(){
  createCanvas(600, 400)
 
  mario = createSprite(50, 200, 20, 20)
  mario.addAnimation("mario_correndo", marioCorrendo)
  mario.addAnimation("mario_colidindo", marioColidindo)
  mario.scale = 0.4
  
  chao = createSprite(200,360,400,20);
  chao.addImage("imagem chão",imagemChao)
  chao.velocityX = -(6+ 3* score/ 10)
  chao.x = width/2

  gameOver = createSprite(300, 200)
  gameOver.addImage("game_over", gameOverImg)
  gameOver.scale = 0.5

  restart = createSprite(300, 240)
  restart.addImage("game_over", restartImg)
  restart.scale = 0.5
  
  grupoObstaculo = new Group()
  grupoTijolos = new Group( )
  grupoEstrelas = new Group()
  
  
}
function draw(){
  background("#00BFFF ")
  drawSprites()
  
  fill('yellow')
  textSize(24)
  textFont('Georgia')
  text("Pontuação: "+ score, 400, 30)
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
  if(keyDown("space") && mario.y >= 100){
     mario.velocityY =  - 13
     }

  if(chao.x < 0){
     chao.x = width/2
  }
  mario.velocityY = mario.velocityY + 0.8 
  mario.collide(chao)
  spawnObstaculos()
  spawnTijolos()
  spawnEstrela()

  for (var i = 0; i < grupoTijolos.length; i++) {
    if (grupoTijolos.get(i).isTouching(mario)) {
      grupoTijolos.get(i).remove();
      score = score + 1;
    }
  }

  // Correção para a condição de tocar estrelas
  for (var i = 0; i < grupoEstrelas.length; i++) {
    if (grupoEstrelas.get(i).isTouching(mario)) {
      grupoEstrelas.get(i).remove();
      score = score + 1;
      mario.velocityY = mario.velocityY - 1;
    }
  }

  if(grupoObstaculo.isTouching(mario)){
      gameState = END
      dieSound.play()
   }
  }

  else if(gameState === END){
    gameOver.visible = true
    restart.visible = true
    mario.scale = 0.2
    mario.changeAnimation("mario_colidindo", marioColidindo)
    grupoObstaculo.setLifetimeEach(-1)
    grupoTijolos.setLifetimeEach(-1 )
    grupoEstrelas.setLifetimeEach(-1 )
    grupoObstaculo.setVelocityXEach(0)
    grupoEstrelas.setVelocityXEach(0)
    grupoTijolos.setVelocityXEach(0)
    chao.velocityX = 0
    mario.velocityY = 0

   if(mousePressedOver(restart)){
    reset()
   }
  }
}

function spawnTijolos() {
  //write code here to spawn the brick
  if (frameCount % 60 === 0) {
    var tijolo = createSprite(600,100,40,10);
    tijolo.debug = false
    tijolo.y = Math.round(random(50,150));
    tijolo.addImage(imagemTijolo);
    tijolo.scale = 1;
    tijolo.velocityX = -3;
    
     //assign lifetime to the variable
    tijolo.lifetime = 200;
    
    //adjust the depth
    tijolo.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    //add each tijolo to the group
    grupoTijolos.add(tijolo);
  }
  
}

function spawnObstaculos() {
  if(frameCount % 60 === 0) {
    var obstaculo = createSprite(600,300,10,40);
    //obstacle.debug = true;
    obstaculo.velocityX = -(6);
    
    //generate random obstacles
    obstaculo.addAnimation("obstacles",imagemObstaculo)
    
    //assign scale and lifetime to the obstacle           
    obstaculo.scale = 1;
    obstaculo.lifetime = 300;
    //add each obstacle to the group
    grupoObstaculo.add(obstaculo);
  }
}

function spawnEstrela() {
  if(frameCount % 60 === 0) {
    var estrela = createSprite(600,200,10,40);
    //obstacle.debug = true;
    estrela.velocityX = -(6);
    
    //generate random obstacles
    estrela.addAnimation("estrelas",imagemEstrela)
    
    //assign scale and lifetime to the obstacle           
    estrela.scale = 0.2;
    estrela.lifetime = 300;
    //add each obstacle to the group
    grupoEstrelas.add(estrela);
  }
}
function reset(){
  mario.scale = 0.4
  chao.velocityX = -6
  gameState = PLAY
  mario.changeAnimation("mario_correndo", marioCorrendo)
  grupoObstaculo.destroyEach()
  grupoTijolos.destroyEach()
  grupoEstrelas.destroyEach()
}