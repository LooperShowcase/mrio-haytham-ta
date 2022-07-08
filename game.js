kaboom({
  global: true,
  fullscreen: true,
  clearColor: [0, 0, 1, 1],
  debug: true,
  scale: 2,
});

loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("block", "ground.png");
loadSprite("coin", "coin.png");
loadSprite("surprise", "surprise.png");
loadSprite("goomba", "evil_mushroom.png");
loadSprite("unboxed", "unboxed.png");
loadSprite("pipe_up", "pipe_up.png");
loadSprite("mushroom", "mushroom.png");

loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");

scene("begin", () => {
  add([
    text("welcome to super mario bros\npress enter to start", 22),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyRelease("enter", () => {
    go("game");
  });
});
scene("winscreen", (score) => {
add([
  text("you\nwin\nyourscore:"+score+"",30),
  origin("center"),
  pos(width() / 2, height() / 2),
]);
keyPress("enter", () => {
  go("begin");
  });
});

scene("vacation", (score) => {
  add([
    text("haytham\ngame over!\n made by loop <3\nyourscore:"+score+" ", 30),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
 keyPress("enter", () => {
    go("begin");
  });
});

scene("game", () => {
  play("gameSound");
  layers(["bg", "obj", "ui"], "obg");
  const symbolmap = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), scale(1.3)],
    "?": [sprite("surprise"), solid(), "surprise-coin"],
    "!": [sprite("surprise"), solid(), "surprise-mushroom"],
    $: [sprite("coin"), "coin"],
    M: [sprite("mushroom"), body(), "mushroom"],
    x: [sprite("unboxed"), solid()],
    g: [sprite("goomba"), body(), solid(), "goomba"],
    p: [sprite("pipe_up"),solid(), "pipe_up"],
  };
  const map = [
    "                                                 ",
    "                                                 ",
    "                                                 ",
    "                                                 ",
    "                                                 ",
    "                                                 ",
    "                                                 ",
    "                                                 ",
    "     ==?==     =!==                              ",
    "                                                 ",
    "                                                 ",
    "                                               p ",
    "                                     g           ",
    "=================================================",
    "=================================================",
    "=================================================",
  ];
  const speed = 120;
  const jumpforce = 450;
  let goombaSpeed = 20;
  let score = 0;
  const scorelabel = add([
    text("score: " + score),
    pos(50, 10),
    layer("ui"),
    {
      value: score,
    },
  ]);
  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(jumpforce),
  ]);
  const gamelevel = addLevel(map, symbolmap);

  let isjumping = false;
  keyDown("right", () => {
    player.move(speed, 0);
  });

  keyDown("left", () => {
    if (player.pos.x > 10) player.move(-speed, 0);
  });

  keyDown("up", () => {
    if (player.grounded()) {
      player.jump(jumpforce);
      play("jumpSound");
      isjumping = true;
    }
  });
  player.on("headbump", (obj) => {
    if (obj.is("surprise-coin")) {
      gamelevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos);
    }
    if (obj.is("surprise-mushroom")) {
      gamelevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gamelevel.spawn("x", obj.gridPos);
    }
  });
  player.collides("coin", (x) => {
    destroy(x);
    scorelabel.value += 1;
    scorelabel.text = "score: " + scorelabel.value;
  });
  action("mushroom", (mush) => {
    mush.move(90, 0);
  });
  action("goomba", (gege) => {
    gege.move(goombaSpeed, 0);
  });

  player.collides("goomba", (x) => {
    if (isjumping) {
      destroy(x);
      scorelabel.value += 100;
      scorelabel.text = "score: " + scorelabel.value;
    } else {
      if (player.isBig()) {
        player.smallify();
        destroy(x);
      } else {
        go("vacation", scorelabel.value);
        destroy(player);
      }
    }
  });

  player.collides("mushroom", (x) => {
    destroy(x);
    scorelabel.value += 5;
    scorelabel.text = "score: " + scorelabel.value;
    player.biggify(5);
  });
  

  player.action(() => {
    camPos(player.pos.x, 150);
    if (player.pos.x >= 955 && player.pos.y >= 220 ) 
    
     {
      go("winscreen",scorelabel.value);
    }
    scorelabel.pos.x = player.pos.x - 400;
    if (player.grounded()) {
      isjumping = false;
    } else {
      isjumping = true;
    }
    if (player.pos.y >= height()) {
      go("vacation", scorelabel.value);
    }
  });

 loop(8, () => {
  goombaSpeed = goombaSpeed * -1;
 });
});
start("begin");
