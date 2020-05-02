//create a simple shockwave effect
const mortarLaunchEffect = newEffect(20, e => {
    Draw.color(Color.white, Color.lightGray, e.fin()); //color goes from white to light gray
    Lines.stroke(e.fout() * 7); //line thickness goes from 7 to 0
    Lines.circle(e.x, e.y, e.fin() * 30); //draw a circle whose radius goes from 0 to 30
});

const listBulletFrag1 = [];
const listMortarBullet = [];

const fragBullet2 =  new LiquidBulletType(Liquids.oil);
const fragBullet3 =  new LiquidBulletType(Liquids.slag);

fragBullet2.lifetime=2;
fragBullet2.speed = 1;
fragBullet2.damage = 30;
fragBullet2.statusDuration = 600;
fragBullet2.fragBullets = 3;
fragBullet2.fragBullet = fragBullet3;

fragBullet3.lifetime=2;
fragBullet3.speed = 1;
fragBullet3.damage = 15;
fragBullet3.statusDuration = 450;

for (var i = 0; i < 50; i++) {
    listBulletFrag1[i] = new BombBulletType(1, 1, "shell"); 
    listBulletFrag1[i].speed = Math.random()*2.6+0.7;
    listBulletFrag1[i].lifetime = Math.random()*35+25
    listBulletFrag1[i].fragBullets = 3;
    listBulletFrag1[i].damage = 70;
    listBulletFrag1[i].splashDamage = 50;
    listBulletFrag1[i].splashDamageRadius = 12;
    listBulletFrag1[i].fragBullet = fragBullet2;
};

for (var i = 0; i < 50; i++) {
    listMortarBullet[i] = new ArtilleryBulletType(1,1, "shell");
    listMortarBullet[i].damage = 425/50;
    listMortarBullet[i].bulletWidth = 18;
    listMortarBullet[i].bulletHeight = 22;
    listMortarBullet[i].bulletShrink = 0.8;
    listMortarBullet[i].splashDamageRadius= 36;
    listMortarBullet[i].splashDamage= 280/50;
    listMortarBullet[i].ammoMultiplier = 1;
    listMortarBullet[i].fragBullets = 1;
    listMortarBullet[i].fragBullet = listBulletFrag1[i];
};

const mortar = extendContent(Block, "mortar", {
    buildConfiguration(tile, table){
        this.mortarList.forEach(mortar => {
            if(mortar[0] == tile.x && mortar[1] == tile.y){
                rightMortar = mortar;
            }
        })
        table.addImageButton(Icon.upOpen, Styles.clearTransi, run(() => {
            tile.configure(1)
        })).size(50).disabled(boolf(b => tile.entity != null && !tile.entity.cons.valid() || (new Date().getTime() - rightMortar[4]) < 1000 ))
        table.addImageButton(Icon.lock, Styles.clearTransi, run(() => {
            tile.configure(2)
        })).size(50).disabled(boolf(b => tile.entity == null))
    },

    doSomeMath(tile, player){
        xShip = player.x/8;
        yShip = player.y/8;
        valueA = xShip - tile.x;
        valueB = Math.sqrt( (xShip - tile.x)*(xShip - tile.x) + (yShip - tile.y)*(yShip - tile.y) );

        cosAlpha = valueA / valueB;

        angle = Math.acos(cosAlpha)*180/Math.PI;

        if(yShip - tile.y < 0) angle *= -1;

        return angle;
    },

    //[mortarX, mortarY, locked, angle, last shoot]
    mortarList : [],

    configured(tile, player, value){
        if(value == 0){ //only happen when placed.
            this.mortarList.push([tile.x, tile.y, false, 0, 0])
        }
        else{

            this.mortarList.forEach(mortar => {
                if(mortar[0] == tile.x && mortar[1] == tile.y){
                    rightMortar = mortar;
                }
            })

            if (value == 1 && tile.entity.cons.valid()){
                Effects.effect(mortarLaunchEffect, tile)

                //do math to known angle
                if(!rightMortar[2]) angle = this.doSomeMath(tile, player);

                for(var i = 0; i< listMortarBullet.length; i++){
                    if (rightMortar[2]) Calls.createBullet(listMortarBullet[i], tile.getTeam(), tile.drawx(), tile.drawy(), rightMortar[3], 0.95, 4.5);
                    else Calls.createBullet(listMortarBullet[i], tile.getTeam(), tile.drawx(), tile.drawy(), angle, 0.95, 4.5)
                }
                rightMortar[4] =  new Date().getTime();
                tile.entity.cons.trigger()
            }

            else if(value == 2){
                if(rightMortar[2]) rightMortar[2] = false;
                else rightMortar[2] = true;
                rightMortar[3] = this.doSomeMath(tile, player);
            }
        }
    }
})

