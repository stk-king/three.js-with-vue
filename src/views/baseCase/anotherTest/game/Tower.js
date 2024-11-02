// 定义防御塔类，攻击进入范围的敌人
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 150;
        this.attackPower = 20;
    }

    update() {
        // 检测范围内是否有敌人，攻击敌人
        this.detectAndAttack();
    }

    detectAndAttack() {
        // 检查是否有敌人进入范围，如果有则攻击
    }

    render() {
        // 渲染防御塔
    }
}