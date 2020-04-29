//create a simple shockwave effect
const mortarLaunchEffect = newEffect(20, e => {
    Draw.color(Color.white, Color.lightGray, e.fin()); //color goes from white to light gray
    Lines.stroke(e.fout() * 7); //line thickness goes from 7 to 0
    Lines.circle(e.x, e.y, e.fin() * 30); //draw a circle whose radius goes from 0 to 30
});



const testBullet = new ArtilleryBulletType(2.5, 10, "shell");
const fragBullet1 =  new BombBulletType(7, 10, "shell");
const fragBullet2 =  new LiquidBulletType(Liquids.oil);
const fragBullet3 =  new LiquidBulletType(Liquids.slag);

testBullet.damage = 275;
testBullet.bulletWidth = 18;
testBullet.bulletHeight = 22;
testBullet.bulletShrink = 0.8;
testBullet.splashDamageRadius= 12;
testBullet.splashDamage= 160;
testBullet.ammoMultiplier = 1;
testBullet.fragBullets = 15;
testBullet.fragBullet = fragBullet1;

fragBullet1.fragBullets = 1;
fragBullet1.damage = 50;
fragBullet1.splashDamage = 20;
fragBullet1.splashDamageRadius = 4;
fragBullet1.fragBullet = fragBullet2;

fragBullet2.lifetime=2;
fragBullet2.speed = 1;
fragBullet2.damage = 15;
fragBullet2.statusDuration = 300;
fragBullet2.fragBullets = 2;
fragBullet2.fragBullet = fragBullet3;

fragBullet3.lifetime=2;
fragBullet3.speed = 1;
fragBullet3.damage = 5;
fragBullet3.statusDuration = 300;

const mortar = extendContent(Block, "mortar", {
    buildConfiguration(tile, table){
        table.addImageButton(Icon.upOpen, Styles.clearTransi, run(() => {
            tile.configure(0)
        })).size(50).disabled(boolf(b => tile.entity != null && !tile.entity.cons.valid()))
    },

    configured(tile, value){
        if(tile.entity.cons.valid()){
            Effects.effect(mortarLaunchEffect, tile)

            //do math to known angle
            xShip = value.x/8;
            yShip = value.y/8;
            valueA = xShip - tile.x;
            valueB = Math.sqrt( (xShip - tile.x)*(xShip - tile.x) + (yShip - tile.y)*(yShip - tile.y) );

            cosAlpha = valueA / valueB;

            angle = Math.acos(cosAlpha)*180/Math.PI;

            if(yShip - tile.y < 0) angle *= -1;

            //create 1 bullet
            Calls.createBullet(testBullet, tile.getTeam(), tile.drawx(), tile.drawy(), angle, 0.4, 4.5)
            tile.entity.cons.trigger()
        }
    }
})

