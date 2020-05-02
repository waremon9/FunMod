const hotGenerator = extendContent( SingleTypeGenerator, "hot-generator", {
    getLiquidEfficiency(liquid){
        return 1;
    },
    draw(tile){
        this.super$draw(tile)
        Draw.rect(Core.atlas.find(this.name + "-top"), tile.drawx(), tile.drawy());
    },
});