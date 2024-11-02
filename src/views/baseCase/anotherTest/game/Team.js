// 阵营类，表示一个队伍，包含玩家
class Team {
    constructor(name) {
        this.name = name;
        this.players = [
            new Player(100, 100, this.name),
            new Player(150, 150, this.name)
        ]; // 这里创建多个玩家
    }

    update() {
        this.players.forEach(player => player.update());
    }

    render() {
        this.players.forEach(player => player.render());
    }
}