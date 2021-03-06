var ObstacleDiamond = Obstacle.extend({
    _radius1: 0,
    _radius2: 0,
    _thick: 25,
    _autoAddShape: false,
    ctor: function (radius1, radius2, thick) {
        this._super();

        this._radius1 = radius1;
        this._radius2 = radius2;
        if (thick !== undefined) {
            this._thick = thick;
        }
    },
    onEnter: function () {
        this._super();

        if (this._autoAddStar) {
            this.addStar(0);
        }
        if (this._autoAddSwitch) {
            this.addSwitch(this.getMaxHeight() + 150);
        }
    },
    getMaxHeight: function () {
        return Math.max(this._radius1, this._radius2) * 2;
    },
    move: function () {
        this._super();

        var origin = util.p2$v(this.center()),
            x = this._radius1,
            y = this._radius2,
            pxy = Math.sqrt(x * x + y * y) * this._thick,
            px = pxy / y,
            py = pxy / x,
            p1 = $V([0, y]),
            p2 = $V([0, y + py]),
            p3 = $V([x + px, 0]),
            p4 = $V([x, 0]),
            p5 = $V([-x - px, 0]),
            p6 = $V([-x, 0]),
            p7 = $V([0, -y]),
            p8 = $V([0, -y - py]),
            ps = [
                [p1, p2, p3, p4],
                [p5, p2, p1, p6],
                [p5, p6, p7, p8],
                [p8, p7, p4, p3]
            ];

        for(var i = 0; i < ps.length; i++) {
            this.drawOperate(i, origin, ps[i]);
        }
    },
    drawOperate: function (i, origin, ps) {
        var degree = cc.degreesToRadians(this._delta),
            _verts = util.rotate$v2ps(ps, degree, origin),
            verts = _.map(_verts, this.pAddDeltaY.bind(this)),
            color = this._colors[i];
        this.drawPoly(verts, color, 0, color);

        var shape = new cp.PolyShape(util.space.staticBody, util.cpVerts(verts), this.getPosition());
        this.addShape(shape, color);
    }
});

ObstacleDiamond.create = function (args) {
    return new ObstacleDiamond(args.radius1, args.radius2, args.thick);
};

ObstacleDiamond.args = function () {
    return {
        type: 'Diamond',
        radius1: _.random(90, 180),
        radius2: _.random(70, 150),
        thick: _.random(10, 60),
        shake: _.sample([
            0,
            _.random(20, 90)
        ])
    };
};