// 地图类，包括怪兽、机器人和防御塔等
class Map {
    constructor() {
        this.monsters = [new Monster(100, 200), new Monster(300, 400)]; // 固定怪兽
        this.robots = [new Robot(50, 50, 'path1'), new Robot(100, 50, 'path2')]; // 移动机器人
        this.towers = [new Tower(200, 300), new Tower(400, 500)]; // 防御塔
    }

    // 更新地图上的元素状态
    update() {
        this.monsters.forEach(monster => monster.update());
        this.robots.forEach(robot => robot.update());
        this.towers.forEach(tower => tower.update());
    }

    // 渲染地图上的元素
    render() {
        this.monsters.forEach(monster => monster.render());
        this.robots.forEach(robot => robot.render());
        this.towers.forEach(tower => tower.render());
    }
}