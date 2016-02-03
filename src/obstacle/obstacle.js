var Obstacle = cc.DrawNode.extend({
    VERT_COUNT: 50,
    _shapes: [],
    _colors: [],
    _speed: 1,
    ctor: function () {
        this._super();
        this.setAnchorPoint(0.5, 0.5);
    },
    setColors: function (colors) {
        if (_.isNumber(colors)) {
            colors = _.sampleSize(util.COLORS, colors);
        } else {
            colors = colors || util.COLORS;
        }
        colors.push(util.ballColor);
        this._colors = _.shuffle(colors);
    },
    setSpeed: function (speed) {
        this._speed = speed;
    },
    center: function () {
        var size = this.getContentSize();
        return cc.p(size.width / 2, size.height / 2);
    },
    clear: function () {
        this._super();

        _.forEach(this._shapes, function (v, k) {
            util.space.staticBody.removeShape(v);
            if (util.space.containsShape(v)) {
                util.space.removeShape(v);
            }
        });
        this._shapes.length = 0;
    },
    drawSector: function (origin, radius, thick, startDegree, angleDegree, fillColor) {
        var angleStart = cc.degreesToRadians(startDegree),
            angleStep = cc.degreesToRadians(angleDegree) / (this.VERT_COUNT - 1),
            verts = [],
            vertsReversed = [];
        for (var i = 0; i < this.VERT_COUNT; i++)
        {
            var rads = angleStart + angleStep * i,
                cos = Math.cos(rads),
                sin = Math.sin(rads),
                x = origin.x + radius * cos,
                y = origin.y + radius * sin;
            verts.push(cc.p(x, y));

            x -= thick * cos;
            y -= thick * sin;
            vertsReversed.push(cc.p(x, y));
        }
        vertsReversed = _.reverse(vertsReversed);
        var vertsAll = _.concat(verts, vertsReversed);
        this.drawPoly(vertsAll, fillColor, 0, fillColor);

        for (i = 0; i < this.VERT_COUNT - 1; i++) {
            var p1 = vertsReversed[i],
                p2 = vertsReversed[i + 1],
                p3 = verts[this.VERT_COUNT - 2 - i],
                p4 = verts[this.VERT_COUNT - 1 - i],
                cpVerts = util.cpVerts([p4, p3, p2, p1]);

            var shape = new cp.PolyShape(util.space.staticBody, cpVerts, cc.pSub(this.getPosition(), this.center()));
            shape.setSensor(true);
            shape.setCollisionType(util.COLLISION_OBSTACLE);
            shape.color = fillColor;
            shape.obstacle = this;
            util.space.addShape(shape);
            this._shapes.push(shape);
        }
    }
});