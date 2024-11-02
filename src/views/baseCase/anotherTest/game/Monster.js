// 定义怪兽类，怪兽可以是固定位置或者攻击范围内的威胁
class Monster {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hp = 200;
        this.attackPower = 15;
    }

    update() {
        // 怪兽的行为逻辑，如自动攻击范围内的敌人
    }

    render() {
        // 渲染怪兽
    }

    takeDamage(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.die();
        }
    }

    die() {
        console.log('Monster died');
        // 处理怪兽死亡的逻辑
    }
}
