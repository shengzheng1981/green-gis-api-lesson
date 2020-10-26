import {PointAnimation} from "./animation";
import {WebMercator} from "../projection/web-mercator";
import {Projection} from "../projection/projection";
/**
 * 星球或粒子类
 */
class Particle {
    x: number;
    y: number;
    c: string;
    r: number;
    R: number;
    s: number;
    pos: number;
    constructor(radius, speed, color) {
        this.pos = Math.random() * 360;
        this.c = color;
        this.r = (Math.random() * radius / 10);
        this.R = radius;
        this.s = speed;
    }
}
/**
 * 轨道类
 */
class Orbit {
    particles: Particle[] = [];
    radius: number;
    speed: number;
    color: string;
    constructor(radius, speed, color, count) {
        this.radius = radius;
        this.speed = speed;
        this.color = color;
        for (let index = 0; index < count; index++) {
            let s = Math.random() / 60 * this.speed;
            s = index % 2 ? s : s * -1;
            this.particles.push(new Particle(radius, s, color));
        }
    }
}
/**
 * 星球环绕动画效果类
 * @remarks
 * 轨道星球环绕动画效果
 */
export class ParticleAnimation extends PointAnimation {

    private _orbit: Orbit;
    /**
     * 轨道半径
     */
    radius: number = 20;
    /**
     * 环绕速度
     */
    speed: number = 10;
    /**
     * 颜色
     */
    color: string = "#E76B76";
    /**
     * 星球或粒子数
     */
    count: number = 40;
    /**
     * alpha通道
     */
    alpha: number = 0.5;
    /**
     * 颜色合成方式
     */
    composite: string = "soft-light";
    /**
     * 动画效果初始化
     * @remarks
     * 一般情况下，把一次性逻辑放于此处，以及处理动画的初始状态
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     * @param {Projection} projection - 坐标投影转换
     */
    init(ctx: CanvasRenderingContext2D, projection: Projection = new WebMercator()) {
        super.init(ctx, projection);
        this._orbit = new Orbit(this.radius, this.speed, this.color, this.count);
    }
    /**
     * 动画效果
     * @remarks
     * 通过Animator中requestAnimationFrame循环调用，因此注意优化代码，保持帧数
     * @param {number} elapsed - 已逝去的时间，毫秒
     * @param {CanvasRenderingContext2D} ctx - 绘图上下文
     */
    animate(elapsed, ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.setTransform(1,0,0,1,0,0);

        this._orbit.particles.forEach( particle => {
            //绕圆形轨道，sin和cos来获得x和y的delta分量
            particle.x = this._screenX + particle.R * Math.sin(Math.PI/2 + particle.pos);
            particle.y = this._screenY + particle.R * Math.cos(Math.PI/2 + particle.pos);
            particle.pos += particle.s;
            ctx.beginPath();
            ctx.globalAlpha = this.alpha;
            ctx.globalCompositeOperation = this.composite;
            ctx.fillStyle = particle.c;
            ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fill();

        });
        ctx.restore();
    }
}