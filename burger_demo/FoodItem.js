export default class FoodItem{
    constructor(fbxFilePath, foodName, fbxLoader, scene){
        this.name = foodName
        this.object = null;

        fbxLoader.load(fbxFilePath, (object) =>{
            object.scale.set(.5, .5, 0.5);
            object.position.y = .5
            object.position.z = -4
            object.rotation.x = -Math.PI/2
            scene.add(object)
            this.object = object
        })
    }

    holding() {
    }

    update(mouseX, rendererWidth, itemHolding){
        if (this.object && itemHolding == this.name){this.object.position.z = -mouseX/rendererWidth  * 7 + 3.5;}
    }
}

        